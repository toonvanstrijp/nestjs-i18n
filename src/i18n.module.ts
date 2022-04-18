import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  MiddlewareConsumer,
  Module,
  Provider,
} from '@nestjs/common';
import {
  I18N_OPTIONS,
  I18N_TRANSLATIONS,
  I18N_LANGUAGES,
  I18N_RESOLVERS,
  I18N_LOADER_OPTIONS,
  I18N_LANGUAGES_SUBJECT,
  I18N_TRANSLATIONS_SUBJECT,
} from './i18n.constants';
import { I18nService } from './services/i18n.service';
import { I18nRequestScopeService } from './services/i18n-request-scope.service';
import {
  I18nAsyncOptions,
  I18nOptions,
  I18nOptionsFactory,
  I18nOptionResolver,
} from './interfaces/i18n-options.interface';
import {
  ValueProvider,
  ClassProvider,
  OnModuleInit,
  NestModule,
} from '@nestjs/common';
import { I18nLanguageInterceptor } from './interceptors/i18n-language.interceptor';
import { APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';
import { getI18nResolverOptionsToken } from './decorators/i18n-resolver-options.decorator';
import { shouldResolve } from './utils/util';
import { I18nTranslation } from './interfaces/i18n-translation.interface';
import { I18nLoader } from './loaders/i18n.loader';
import { Observable, BehaviorSubject } from 'rxjs';
import * as format from 'string-format';
import { I18nJsonLoader } from './loaders/i18n.json.loader';
import { I18nMiddleware } from './middlewares/i18n.middleware';

const logger = new Logger('I18nService');

const defaultOptions: Partial<I18nOptions> = {
  resolvers: [],
  formatter: format,
  logging: true,
  loader: I18nJsonLoader,
};

@Global()
@Module({})
export class I18nModule implements OnModuleInit, NestModule {
  constructor(
    private readonly i18n: I18nService,
    @Inject(I18N_TRANSLATIONS)
    private translations: Observable<I18nTranslation>,
    @Inject(I18N_OPTIONS) private readonly i18nOptions: I18nOptions,
    private adapter: HttpAdapterHost,
  ) {}

  async onModuleInit() {
    // TODO: Generate typescript file
    // this.translations.pipe(
    //   map(t => Object.keys(t).reduce((result, key) => mergeDeep(result, t[key]), {}))
    // ).subscribe(t => {
    //   console.log(t)
    // });

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
  }

  configure(consumer: MiddlewareConsumer) {
    if (this.i18nOptions.disableMiddleware) return;
    consumer.apply(I18nMiddleware).forRoutes('*');
  }

  static forRoot(options: I18nOptions): DynamicModule {
    options = this.sanitizeI18nOptions(options);

    const i18nLanguagesSubject = new BehaviorSubject<string[]>([]);
    const i18nTranslationSubject = new BehaviorSubject<I18nTranslation>({});

    const i18nOptions: ValueProvider = {
      provide: I18N_OPTIONS,
      useValue: options,
    };

    const i18nLoaderProvider: ClassProvider = {
      provide: I18nLoader,
      useClass: options.loader,
    };

    const i18nLoaderOptionsProvider: ValueProvider = {
      provide: I18N_LOADER_OPTIONS,
      useValue: options.loaderOptions,
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
        loader: I18nLoader,
      ): Promise<Observable<I18nTranslation>> => {
        try {
          const translation = await loader.load();
          if (translation instanceof Observable) {
            translation.subscribe(i18nTranslationSubject);
          } else {
            i18nTranslationSubject.next(translation);
          }
        } catch (e) {
          logger.error('parsing translation error', e);
        }
        return i18nTranslationSubject.asObservable();
      },
      inject: [I18nLoader],
    };

    const languagesProvider = {
      provide: I18N_LANGUAGES,
      useFactory: async (loader: I18nLoader): Promise<Observable<string[]>> => {
        try {
          const languages = await loader.languages();
          if (languages instanceof Observable) {
            languages.subscribe(i18nLanguagesSubject);
          } else {
            i18nLanguagesSubject.next(languages);
          }
        } catch (e) {
          logger.error('parsing translation error', e);
        }
        return i18nLanguagesSubject.asObservable();
      },
      inject: [I18nLoader],
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
        I18nRequestScopeService,
        i18nOptions,
        translationsProvider,
        languagesProvider,
        resolversProvider,
        i18nLoaderProvider,
        i18nLoaderOptionsProvider,
        i18nLanguagesSubjectProvider,
        i18nTranslationSubjectProvider,
        ...this.createResolverProviders(options.resolvers),
      ],
      exports: [I18nService, I18nRequestScopeService, languagesProvider],
    };
  }

  static forRootAsync(options: I18nAsyncOptions): DynamicModule {
    options = this.sanitizeI18nOptions(options);

    const asyncOptionsProvider = this.createAsyncOptionsProvider(options);
    const asyncTranslationProvider = this.createAsyncTranslationProvider();
    const asyncLanguagesProvider = this.createAsyncLanguagesProvider();
    const asyncLoaderOptionsProvider = this.createAsyncLoaderOptionsProvider();

    const i18nLanguagesSubject = new BehaviorSubject<string[]>([]);
    const i18nTranslationSubject = new BehaviorSubject<I18nTranslation>({});

    const resolversProvider: ValueProvider = {
      provide: I18N_RESOLVERS,
      useValue: options.resolvers || [],
    };

    const i18nLoaderProvider: ClassProvider<I18nLoader> = {
      provide: I18nLoader,
      useClass: options.loader,
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
        I18nService,
        I18nRequestScopeService,
        resolversProvider,
        i18nLoaderProvider,
        i18nLanguagesSubjectProvider,
        i18nTranslationSubjectProvider,
        ...this.createResolverProviders(options.resolvers),
      ],
      exports: [I18nService, I18nRequestScopeService, asyncLanguagesProvider],
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

  private static createAsyncLoaderOptionsProvider(): Provider {
    return {
      provide: I18N_LOADER_OPTIONS,
      useFactory: async (options: I18nOptions): Promise<any> => {
        return this.sanitizeI18nOptions(options.loaderOptions);
      },
      inject: [I18N_OPTIONS],
    };
  }

  private static createAsyncTranslationProvider(): Provider {
    return {
      provide: I18N_TRANSLATIONS,
      useFactory: async (
        loader: I18nLoader,
        translationsSubject: BehaviorSubject<I18nTranslation>,
      ): Promise<Observable<I18nTranslation>> => {
        try {
          const translation = await loader.load();
          if (translation instanceof Observable) {
            translation.subscribe(translationsSubject);
          } else {
            translationsSubject.next(translation);
          }
        } catch (e) {
          logger.error('parsing translation error', e);
        }
        return translationsSubject.asObservable();
      },
      inject: [I18nLoader, I18N_TRANSLATIONS_SUBJECT],
    };
  }

  private static createAsyncLanguagesProvider(): Provider {
    return {
      provide: I18N_LANGUAGES,
      useFactory: async (
        loader: I18nLoader,
        languagesSubject: BehaviorSubject<string[]>,
      ): Promise<Observable<string[]>> => {
        try {
          const languages = await loader.languages();
          if (languages instanceof Observable) {
            languages.subscribe(languagesSubject);
          } else {
            languagesSubject.next(languages);
          }
        } catch (e) {
          logger.error('parsing translation error', e);
        }
        return languagesSubject.asObservable();
      },
      inject: [I18nLoader, I18N_LANGUAGES_SUBJECT],
    };
  }

  private static sanitizeI18nOptions<T = I18nOptions | I18nAsyncOptions>(
    options: T,
  ) {
    options = { ...defaultOptions, ...options };
    return options;
  }

  private static createResolverProviders(resolvers?: I18nOptionResolver[]) {
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
            inject: [optionsToken],
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
