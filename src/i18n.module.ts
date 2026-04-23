import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import {
  I18N_OPTIONS,
  I18N_TRANSLATIONS,
  I18N_LANGUAGES,
  I18N_RESOLVERS,
  I18N_LOADER_OPTIONS,
  I18N_LOADERS,
  I18N_LANGUAGES_SUBJECT,
  I18N_TRANSLATIONS_SUBJECT,
} from './i18n.constants';
import { I18nService } from './services/i18n.service';
import {
  I18nAsyncOptions,
  Formatter,
  I18nOptions,
  I18nOptionsFactory,
  I18nOptionResolver,
} from './interfaces/i18n-options.interface';
import { ValueProvider, ClassProvider, OnModuleInit, NestModule } from '@nestjs/common';
import { I18nLanguageInterceptor } from './interceptors/i18n-language.interceptor';
import { APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';
import { getI18nResolverOptionsToken } from './decorators';
import { shouldResolve, usingFastify, mergeDeep, processTranslations, processLanguages } from './utils';
import { I18nTranslation } from './interfaces/i18n-translation.interface';
import { I18nLoader } from './loaders/i18n.loader';
import { Observable, BehaviorSubject, Subject, takeUntil } from 'rxjs';
import * as format from 'string-format';
import { I18nJsonLoader } from './loaders';
import { I18nMiddleware } from './middlewares/i18n.middleware';
import * as fs from 'fs';
import * as path from 'path';
import { NestMiddlewareConsumer } from './types';
export const logger = new Logger('I18nService');

const defaultOptions: Partial<I18nOptions> = {
  resolvers: [],
  formatter: format as unknown as Formatter,
  logging: true,
  throwOnMissingKey: false,
  loader: I18nJsonLoader,
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
    private readonly middleware: I18nMiddleware,
  ) {}

  async onModuleInit() {
    // makes sure languages & translations are loaded before application loads
    await this.i18n.refresh();

    // Register handlebars helper

    if (this.i18nOptions.viewEngine) {
      if (['hbs', 'handlebars'].includes(this.i18nOptions.viewEngine)) {
        try {
          // Import handlebars or hbs
          const hbs =
            this.i18nOptions.viewEngine === 'hbs'
              ? await import('hbs')
              : await import('handlebars');

          hbs.registerHelper('t', this.i18n.hbsHelper);
          logger.log('Handlebars helper registered');
        } catch (e) {
          logger.error(this.i18nOptions.viewEngine + ' module failed to load', e);
        }
      }

      if (['pug', 'ejs'].includes(this.i18nOptions.viewEngine)) {
        const app = this.adapter.httpAdapter.getInstance();
        app.locals ??= {};
        app.locals['t'] = (key: string, lang: any, args: any) => {
          return this.i18n.t(key, { lang, args });
        };
      }
    }

    if (this.i18nOptions.typesOutputPath) {
      try {
        const ts = await import('./utils/typescript');

        const typesOutputPath = this.i18nOptions.typesOutputPath;

        this.translations.pipe(takeUntil(this.unsubscribe)).subscribe(async (t) => {
          logger.log('Checking translation changes');
          const object = Object.keys(t).reduce((result, key) => mergeDeep(result, t[key]), {});

          const rawContent = await ts.createTypesFile(object);

          if (!rawContent) {
            return;
          }

          const outputFile = ts.annotateSourceCode(rawContent);

          fs.mkdirSync(path.dirname(typesOutputPath), {
            recursive: true,
          });
          let currentFileContent = null;
          try {
            currentFileContent = fs.readFileSync(typesOutputPath, 'utf8');
          } catch (err) {
            logger.error(err);
          }
          if (currentFileContent != outputFile) {
            fs.writeFileSync(typesOutputPath, outputFile);
            logger.log(
              `Types generated in: ${this.i18nOptions.typesOutputPath}.
                Please also add it to ignore files of your linter and formatter to avoid linting and formatting it
                `,
            );
          } else {
            logger.log('No changes detected');
          }
        });
      } catch {
        logger.error(
          'typescript package not found, types generation failed. Please install typescript as a dev dependency to enable this feature.',
        );
      }
    }
  }

  onModuleDestroy() {
    this.unsubscribe.complete();
  }

  configure(consumer: NestMiddlewareConsumer) {
    if (this.i18nOptions.disableMiddleware) return;

    const middlewareRoute = usingFastify(consumer) ? '*' : '*path';
    consumer.apply(I18nMiddleware).forRoutes(middlewareRoute);

    if (usingFastify(consumer)) {
      consumer.httpAdapter.getInstance().addHook('preHandler', async (request: any, reply: any) => {
        const locals: Record<string, unknown> = {
          ...reply.locals,
        };

        if (request.raw.i18nLang) {
          locals.i18nLang = request.raw.i18nLang;
        }

        if (this.i18nOptions.viewEngine && ['pug', 'ejs'].includes(this.i18nOptions.viewEngine)) {
          locals.t = (key: string, lang: any, args: any) => {
            return this.i18n.t(key, { lang, args });
          };
        }

        reply.locals = locals;
      });
    }
  }

  static forRoot(options: I18nOptions): DynamicModule {
    options = this.sanitizeI18nOptions(options);

    const i18nLanguagesSubject = new BehaviorSubject<string[]>([]);
    const i18nTranslationSubject = new BehaviorSubject<I18nTranslation>({});

    const i18nOptions: ValueProvider = {
      provide: I18N_OPTIONS,
      useValue: options,
    };

    const legacyProviders: Provider[] = [];

    let i18nLoadersProvider: Provider;
    if (options.loaders && options.loaders.length > 0) {
      i18nLoadersProvider = {
        provide: I18N_LOADERS,
        useValue: options.loaders,
      };
    } else {
      // Legacy: loader + loaderOptions
      const i18nLoaderProvider: ClassProvider = {
        provide: I18nLoader,
        useClass: options.loader!,
      };
      const i18nLoaderOptionsProvider: ValueProvider = {
        provide: I18N_LOADER_OPTIONS,
        useValue: options.loaderOptions,
      };
      legacyProviders.push(i18nLoaderProvider, i18nLoaderOptionsProvider);
      i18nLoadersProvider = {
        provide: I18N_LOADERS,
        useFactory: (loader: I18nLoader) => [loader],
        inject: [I18nLoader],
      };
    }

    const i18nLanguagesSubjectProvider: ValueProvider = {
      provide: I18N_LANGUAGES_SUBJECT,
      useValue: i18nLanguagesSubject,
    };

    const i18nTranslationSubjectProvider: ValueProvider = {
      provide: I18N_TRANSLATIONS_SUBJECT,
      useValue: i18nTranslationSubject,
    };

    const translationsProvider = this.createMultiLoaderStreamProvider<I18nTranslation>(
      I18N_TRANSLATIONS,
      (loaders) => processTranslations(loaders),
      i18nTranslationSubject,
    );

    const languagesProvider = this.createMultiLoaderStreamProvider<string[]>(
      I18N_LANGUAGES,
      (loaders) => processLanguages(loaders),
      i18nLanguagesSubject,
    );

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
        I18nMiddleware,
        i18nOptions,
        translationsProvider,
        languagesProvider,
        resolversProvider,
        i18nLoadersProvider,
        ...legacyProviders,
        i18nLanguagesSubjectProvider,
        i18nTranslationSubjectProvider,
        ...this.createResolverProviders(options.resolvers),
      ],
      exports: [I18N_OPTIONS, I18N_RESOLVERS, I18nService, I18nMiddleware, languagesProvider],
    };
  }

  static forRootAsync(options: I18nAsyncOptions): DynamicModule {
    options = this.sanitizeI18nOptions(options);

    const asyncOptionsProvider = this.createAsyncOptionsProvider(options);
    const asyncTranslationProvider = this.createAsyncTranslationProvider();
    const asyncLanguagesProvider = this.createAsyncLanguagesProvider();
    const asyncLoaderOptionsProvider = this.createAsyncLoaderOptionsProvider();
    const asyncLoadersProvider = this.createAsyncLoadersProvider(options);

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
        asyncLoaderOptionsProvider,
        asyncLoadersProvider,
        I18nService,
        I18nMiddleware,
        resolversProvider,
        i18nLanguagesSubjectProvider,
        i18nTranslationSubjectProvider,
        ...this.createResolverProviders(options.resolvers),
      ],
      exports: [I18N_OPTIONS, I18N_RESOLVERS, I18nService, I18nMiddleware, asyncLanguagesProvider],
    };
  }

  private static createAsyncOptionsProvider(options: I18nAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: I18N_OPTIONS,
        useFactory: async (...args) => {
          return this.sanitizeI18nOptions((await options.useFactory!(...args)) as any);
        },
        inject: options.inject || [],
      };
    }
    return {
      provide: I18N_OPTIONS,
      useFactory: async (optionsFactory: I18nOptionsFactory) =>
        this.sanitizeI18nOptions((await optionsFactory.createI18nOptions()) as any),
      inject: [options.useClass ?? options.useExisting!],
    };
  }

  private static createAsyncLoaderOptionsProvider(): Provider {
    return {
      provide: I18N_LOADER_OPTIONS,
      useFactory: async (options: I18nOptions): Promise<any> => {
        return this.sanitizeI18nOptions(options.loaderOptions);
      },
      inject: [I18N_OPTIONS],
    };
  }

  private static createAsyncLoadersProvider(options: I18nAsyncOptions): Provider {
    if (options.loaders && options.loaders.length > 0) {
      return {
        provide: I18N_LOADERS,
        useValue: options.loaders,
      };
    }

    // Resolve loaders from runtime options and preserve legacy loader/loaderOptions behavior.
    return {
      provide: I18N_LOADERS,
      useFactory: (resolvedOptions: I18nOptions) => {
        if (resolvedOptions.loaders && resolvedOptions.loaders.length > 0) {
          return resolvedOptions.loaders;
        }

        if (resolvedOptions.loader) {
          return [new resolvedOptions.loader(resolvedOptions.loaderOptions)];
        }

        return [];
      },
      inject: [I18N_OPTIONS],
    };
  }

  private static createAsyncTranslationProvider(): Provider {
    return this.createMultiLoaderStreamProvider<I18nTranslation>(
      I18N_TRANSLATIONS,
      (loaders) => processTranslations(loaders),
      undefined,
      I18N_TRANSLATIONS_SUBJECT,
    );
  }

  private static createAsyncLanguagesProvider(): Provider {
    return this.createMultiLoaderStreamProvider<string[]>(
      I18N_LANGUAGES,
      (loaders) => processLanguages(loaders),
      undefined,
      I18N_LANGUAGES_SUBJECT,
    );
  }

  private static createMultiLoaderStreamProvider<T>(
    provide: string,
    processLoaders: (loaders: I18nLoader[]) => Promise<T | Observable<T>>,
    subject?: BehaviorSubject<T>,
    subjectToken?: string,
  ): Provider {
    return {
      provide,
      useFactory: async (
        loaders: I18nLoader[],
        injectedSubject?: BehaviorSubject<T>,
      ): Promise<Observable<T>> => {
        const streamSubject = injectedSubject ?? subject;
        if (!streamSubject) {
          throw new Error('Missing BehaviorSubject provider for i18n stream');
        }
        try {
          const value = await processLoaders(loaders);
          if (value instanceof Observable) {
            value.subscribe(streamSubject);
          } else {
            streamSubject.next(value);
          }
        } catch (e) {
          logger.error('parsing translation error', e);
        }
        return streamSubject.asObservable();
      },
      inject: subjectToken ? [I18N_LOADERS, subjectToken] : [I18N_LOADERS],
    };
  }

  private static createLoaderStreamProvider<T>(
    provide: string,
    loaderCall: (loader: I18nLoader) => Promise<T | Observable<T>>,
    subject?: BehaviorSubject<T>,
    subjectToken?: string,
  ): Provider {
    return {
      provide,
      useFactory: async (
        loader: I18nLoader,
        injectedSubject?: BehaviorSubject<T>,
      ): Promise<Observable<T>> => {
        const streamSubject = injectedSubject ?? subject;
        if (!streamSubject) {
          throw new Error('Missing BehaviorSubject provider for i18n stream');
        }

        try {
          const value = await loaderCall(loader);
          if (value instanceof Observable) {
            value.subscribe(streamSubject);
          } else {
            streamSubject.next(value);
          }
        } catch (e) {
          logger.error('parsing translation error', e);
        }
        return streamSubject.asObservable();
      },
      inject: subjectToken ? [I18nLoader, subjectToken] : [I18nLoader],
    };
  }

  private static sanitizeI18nOptions<T = I18nOptions | I18nAsyncOptions>(options: T) {
    options = { ...defaultOptions, ...options };
    return options;
  }

  private static createResolverProviders(resolvers?: I18nOptionResolver[]) {
    if (!resolvers || resolvers.length === 0) {
      logger.log(
        `No resolvers provided. Set the language manually per request or configure resolvers: https://nestjs-i18n.com/quick-start`,
      );
    }
    return (resolvers || []).filter(shouldResolve).reduce<Provider[]>((providers, r) => {
      if ('use' in r) {
        const { use: resolver, options, ...rest } = r as any;
        const optionsToken = getI18nResolverOptionsToken(resolver as unknown as () => void);
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
        const optionsToken = getI18nResolverOptionsToken(r as unknown as () => void);
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
