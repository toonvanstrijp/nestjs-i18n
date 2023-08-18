import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  MiddlewareConsumer,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import {
  I18N_OPTIONS,
  I18N_TRANSLATIONS,
  I18N_LANGUAGES,
  I18N_RESOLVERS,
  I18N_LANGUAGES_SUBJECT,
  I18N_TRANSLATIONS_SUBJECT,
  I18N_LOADERS,
} from './i18n.constants';
import { I18nService } from './services/i18n.service';
import {
  I18nAsyncOptions,
  I18nOptions,
  I18nOptionsFactory,
  I18nOptionResolver,
} from './interfaces/i18n-options.interface';
import { ValueProvider, OnModuleInit, NestModule } from '@nestjs/common';
import { I18nLanguageInterceptor } from './interceptors/i18n-language.interceptor';
import { APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';
import { getI18nResolverOptionsToken } from './decorators/i18n-resolver-options.decorator';
import { isNestMiddleware, shouldResolve, usingFastify } from './utils/util';
import { I18nTranslation } from './interfaces/i18n-translation.interface';
import { I18nLoader } from './loaders/i18n.loader';
import {
  Observable,
  BehaviorSubject,
  Subject,
  takeUntil,
  of,
  combineLatest,
  distinct,
  flatMap,
  mergeMap,
  filter, reduce, map, merge
} from 'rxjs';
import * as format from 'string-format';
import { I18nMiddleware } from './middlewares/i18n.middleware';
import {mergeDeep, mergeTranslations} from './utils/merge';
import * as fs from 'fs';
import * as path from 'path';

export const logger = new Logger('I18nService');

const defaultOptions: Partial<I18nOptions> = {
  resolvers: [],
  formatter: format,
  logging: true,
};

@Global()
@Module({})
export class I18nModule implements OnModuleInit, OnModuleDestroy, NestModule {
  private unsubscribe = new Subject<void>();

  constructor(
    private readonly i18n: I18nService,
    @Inject(I18N_TRANSLATIONS)
    private translations: Observable<I18nTranslation>,
    @Inject(I18N_OPTIONS) private readonly i18nOptions: I18nOptions,
    private adapter: HttpAdapterHost,
  ) {}

  async onModuleInit() {
    // makes sure languages & translations are loaded before application loads
    await this.i18n.refresh();

    // Register handlebars helper
    if (this.i18nOptions.viewEngine == 'hbs') {
      try {
        const hbs = await import('hbs');
        hbs.registerHelper('t', this.i18n.hbsHelper);
        logger.log('Handlebars helper registered');
      } catch (e) {
        logger.error('hbs module failed to load', e);
      }
    }

    if (['pug', 'ejs'].includes(this.i18nOptions.viewEngine)) {
      const app = this.adapter.httpAdapter.getInstance();
      app.locals['t'] = (key: string, lang: any, args: any) => {
        return this.i18n.t(key, { lang, args });
      };
    }

    if (!!this.i18nOptions.typesOutputPath) {
      try {
        const ts = await import('./utils/typescript');

        this.translations
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(async (t) => {
            logger.log('Checking translation changes');
            const object = Object.keys(t).reduce(
              (result, key) => mergeDeep(result, t[key]),
              {},
            );

            const rawContent = await ts.createTypesFile(object);

            if (!rawContent) {
              return;
            }

            const outputFile = ts.annotateSourceCode(rawContent);

            fs.mkdirSync(path.dirname(this.i18nOptions.typesOutputPath), {
              recursive: true,
            });
            let currentFileContent = null;
            try {
              currentFileContent = fs.readFileSync(
                this.i18nOptions.typesOutputPath,
                'utf8',
              );
            } catch (err) {
              logger.error(err);
            }
            if (currentFileContent != outputFile) {
              fs.writeFileSync(this.i18nOptions.typesOutputPath, outputFile);
              logger.log(
                `Types generated in: ${this.i18nOptions.typesOutputPath}`,
              );
            } else {
              logger.log('No changes detected');
            }
          });
      } catch (_) {
        // NOOP: typescript package not found
      }
    }
  }

  onModuleDestroy() {
    this.unsubscribe.complete();
  }

  configure(consumer: MiddlewareConsumer) {
    if (this.i18nOptions.disableMiddleware) return;

    consumer
      .apply(I18nMiddleware)
      .forRoutes(
        isNestMiddleware(consumer) && usingFastify(consumer) ? '(.*)' : '*',
      );
  }

  static forRoot(options: I18nOptions): DynamicModule {
    options = this.sanitizeI18nOptions(options);

    const i18nLanguagesSubject = new BehaviorSubject<string[]>([]);
    const i18nTranslationSubject = new BehaviorSubject<I18nTranslation>({});

    const i18nOptions: ValueProvider = {
      provide: I18N_OPTIONS,
      useValue: options,
    };

    const i18nLoaderProvider: ValueProvider = {
      provide: I18N_LOADERS,
      useValue: options.loaders,
    };

    const i18nLanguagesSubjectProvider: ValueProvider = {
      provide: I18N_LANGUAGES_SUBJECT,
      useValue: i18nLanguagesSubject,
    };

    const i18nTranslationSubjectProvider: ValueProvider = {
      provide: I18N_TRANSLATIONS_SUBJECT,
      useValue: i18nTranslationSubject,
    };

    const translationsProvider = {
      provide: I18N_TRANSLATIONS,
      useFactory: async (
        loaders: I18nLoader<unknown>[],
      ): Promise<Observable<I18nTranslation>> => {
        try {
          for (let loader of loaders) {
            const translation = await loader.load();
            if (translation instanceof Observable) {
              translation.subscribe(i18nTranslationSubject);
            } else {
              i18nTranslationSubject.next(translation);
            }
          }
        } catch (e) {
          logger.error('parsing translation error', e);
        }
        return i18nTranslationSubject.asObservable();
      },
      inject: [I18N_LOADERS],
    };

    const languagesProvider = {
      provide: I18N_LANGUAGES,
      useFactory: async (
        loaders: I18nLoader<unknown>[],
      ): Promise<Observable<string[]>> => {
        try {
          for (let loader of loaders) {
            const languages = await loader.languages();
            if (languages instanceof Observable) {
              languages.subscribe(i18nLanguagesSubject);
            } else {
              i18nLanguagesSubject.next(languages);
            }
          }
        } catch (e) {
          logger.error('parsing translation error', e);
        }
        return i18nLanguagesSubject.asObservable();
      },
      inject: [I18N_LOADERS],
    };

    const resolversProvider = {
      provide: I18N_RESOLVERS,
      useValue: options.resolvers || [],
    };

    return {
      module: I18nModule,
      providers: [
        { provide: Logger, useValue: logger },
        {
          provide: APP_INTERCEPTOR,
          useClass: I18nLanguageInterceptor,
        },
        I18nService,
        i18nOptions,
        translationsProvider,
        languagesProvider,
        resolversProvider,
        i18nLoaderProvider,
        i18nLanguagesSubjectProvider,
        i18nTranslationSubjectProvider,
        ...this.createResolverProviders(options.resolvers),
      ],
      exports: [I18N_OPTIONS, I18N_RESOLVERS, I18nService, languagesProvider],
    };
  }

  static forRootAsync(options: I18nAsyncOptions): DynamicModule {
    options = this.sanitizeI18nOptions(options);

    const asyncOptionsProvider = this.createAsyncOptionsProvider(options);
    const asyncTranslationProvider = this.createAsyncTranslationProvider();
    const asyncLanguagesProvider = this.createAsyncLanguagesProvider();
    const asyncLoadersProvider = this.createAsyncLoadersProvider();

    const i18nLanguagesSubject = new BehaviorSubject<string[]>([]);
    const i18nTranslationSubject = new BehaviorSubject<I18nTranslation>({});

    const resolversProvider: ValueProvider = {
      provide: I18N_RESOLVERS,
      useValue: options.resolvers || [],
    };


    const i18nLanguagesSubjectProvider: ValueProvider = {
      provide: I18N_LANGUAGES_SUBJECT,
      useValue: i18nLanguagesSubject,
    };

    const i18nTranslationSubjectProvider: ValueProvider = {
      provide: I18N_TRANSLATIONS_SUBJECT,
      useValue: i18nTranslationSubject,
    };

    return {
      module: I18nModule,
      imports: options.imports || [],
      providers: [
        { provide: Logger, useValue: logger },
        {
          provide: APP_INTERCEPTOR,
          useClass: I18nLanguageInterceptor,
        },
        asyncOptionsProvider,
        asyncTranslationProvider,
        asyncLanguagesProvider,
        I18nService,
        resolversProvider,
        asyncLoadersProvider,
        i18nLanguagesSubjectProvider,
        i18nTranslationSubjectProvider,
        ...this.createResolverProviders(options.resolvers),
      ],
      exports: [
        I18N_OPTIONS,
        I18N_RESOLVERS,
        I18N_LOADERS,
        I18nService,
        asyncLanguagesProvider,
      ],
    };
  }

  private static createAsyncLoadersProvider(): Provider {

    return {
      provide: I18N_LOADERS,
      useFactory: async (options: I18nOptions) => {
        return options.loaders;
      },
      inject: [I18N_OPTIONS],
    };

  }

  private static createAsyncOptionsProvider(
    options: I18nAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: I18N_OPTIONS,
        useFactory: async (...args) => {
          return this.sanitizeI18nOptions(
            (await options.useFactory(...args)) as any,
          );
        },
        inject: options.inject || [],
      };
    }
    return {
      provide: I18N_OPTIONS,
      useFactory: async (optionsFactory: I18nOptionsFactory) =>
        this.sanitizeI18nOptions(
          (await optionsFactory.createI18nOptions()) as any,
        ),
      inject: [options.useClass || options.useExisting],
    };
  }

  private static createAsyncTranslationProvider(): Provider {
    return {
      provide: I18N_TRANSLATIONS,
      useFactory: async (
        loaders: I18nLoader<unknown>[],
        translationsSubject: BehaviorSubject<I18nTranslation>,
      ): Promise<Observable<I18nTranslation>> => {
        try {

          const loadedTranslations = await Promise.all(loaders.map((loader) => loader.load()));

          const hasAtLeastOneObservable = loadedTranslations.find(
              (translation) => translation instanceof Observable,
          ) !== undefined;

          if (hasAtLeastOneObservable) {

            const sources = loadedTranslations.map((translation) => {
              const observable = translation instanceof Observable;
              return observable ? translation : of(translation);
            });

            const translationsObs = merge(...sources).pipe(
                reduce((acc, translation) => mergeTranslations(acc, translation)),
            );

            translationsObs.subscribe(translationsSubject);
          } else {

            const translations = loadedTranslations
                .filter((translation): translation is I18nTranslation => translation !== undefined)
                .reduce((acc, translation) => {
                  return mergeTranslations(
                      acc, translation);
                }, {});

            translationsSubject.next(translations);
          }

        } catch (e) {
          throw e;
        }
        return translationsSubject.asObservable();
      },
      inject: [I18N_LOADERS, I18N_TRANSLATIONS_SUBJECT],
    };
  }

  private static createAsyncLanguagesProvider(): Provider {
    return {
      provide: I18N_LANGUAGES,
      useFactory: async (
        loaders: I18nLoader<unknown>[],
        languagesSubject: BehaviorSubject<string[]>,
      ): Promise<Observable<string[]>> => {
        try {
          const languagesSource = await Promise.all(
            loaders.map((loader) => loader.languages()),
          );

          const hasAtLeastOneObservable = languagesSource.find(
            (languages) => languages instanceof Observable,
          ) !== undefined;


          if (hasAtLeastOneObservable) {
            const languagesCombined = merge(languagesSource.map((languages) => {
              const observable = languages instanceof Observable;
              return observable ? languages : of(languages);
            })).pipe(
                mergeMap((languages) => languages),
                distinct()
            );

            languagesCombined.subscribe(languagesSubject);

          } else {

            const languages = languagesSource
                .filter((languages): languages is string[] => languages !== undefined)
                .flatMap((languages) => languages);

            languagesSubject.next([...new Set(languages)]);
          }
        } catch (e) {
          logger.error('parsing translation error', e);
        }
        return languagesSubject.asObservable();
      },
      inject: [I18N_LOADERS, I18N_LANGUAGES_SUBJECT],
    };
  }

  private static sanitizeI18nOptions<T = I18nOptions | I18nAsyncOptions>(
    options: T,
  ) {
    options = { ...defaultOptions, ...options };
    return options;
  }

  private static createResolverProviders(resolvers?: I18nOptionResolver[]) {
    if (!resolvers || resolvers.length === 0) {
      logger.error(
        `No resolvers provided! nestjs-i18n won't work properly, please follow the quick-start guide: https://nestjs-i18n.com/quick-start`,
      );
    }
    return (resolvers || [])
      .filter(shouldResolve)
      .reduce<Provider[]>((providers, r) => {
        if (r['use']) {
          const { use: resolver, options, ...rest } = r as any;
          const optionsToken = getI18nResolverOptionsToken(
            resolver as unknown as () => void,
          );
          providers.push({
            provide: resolver,
            useClass: resolver,
          });
          if (options) {
            (rest as any).useValue = options;
          }
          providers.push({
            provide: optionsToken,
            ...(rest as any),
          });
        } else {
          const optionsToken = getI18nResolverOptionsToken(
            r as unknown as () => void,
          );
          providers.push({
            provide: r,
            useClass: r,
            inject: [optionsToken],
          } as any);
          providers.push({
            provide: optionsToken,
            useFactory: () => undefined,
          });
        }

        return providers;
      }, []);
  }
}
