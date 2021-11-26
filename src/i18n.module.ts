import {
  DynamicModule,
  Global,
  Logger,
  Module,
  Provider,
} from '@nestjs/common';
import {
  I18N_OPTIONS,
  I18N_TRANSLATIONS,
  I18N_LANGUAGES,
  I18N_RESOLVERS,
  I18N_PARSER_OPTIONS,
  I18N_LANGUAGES_SUBJECT,
  I18N_TRANSLATIONS_SUBJECT,
} from './i18n.constants';
import { I18nService } from './services/i18n.service';
import { I18nRequestScopeService } from './services/i18n-request-scope.service';
import {
  I18nAsyncOptions,
  I18nOptions,
  I18nOptionsFactory,
  ResolverWithOptions,
  I18nOptionResolver,
} from './interfaces/i18n-options.interface';
import {
  ValueProvider,
  ClassProvider,
  OnModuleInit,
} from '@nestjs/common/interfaces';
import { I18nLanguageInterceptor } from './interceptors/i18n-language.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { getI18nResolverOptionsToken } from './decorators/i18n-resolver-options.decorator';
import { shouldResolve } from './utils/util';
import { I18nTranslation } from './interfaces/i18n-translation.interface';
import { I18nParser } from './parsers/i18n.parser';
import { Observable, BehaviorSubject } from 'rxjs';

const logger = new Logger('I18nService');

const defaultOptions: Partial<I18nOptions> = {
  resolvers: [],
  logging: true
};

@Global()
@Module({})
export class I18nModule implements OnModuleInit {
  constructor(private readonly i18n: I18nService) {}

  async onModuleInit() {
    // makes sure languages & translations are loaded before application loads
    await this.i18n.refresh();
  }

  static forRoot(options: I18nOptions): DynamicModule {
    options = this.sanitizeI18nOptions(options);

    const i18nLanguagesSubject = new BehaviorSubject<string[]>([]);
    const i18nTranslationSubject = new BehaviorSubject<I18nTranslation>({});

    const i18nOptions: ValueProvider = {
      provide: I18N_OPTIONS,
      useValue: options,
    };

    const i18nParserProvider: ClassProvider = {
      provide: I18nParser,
      useClass: options.parser,
    };

    const i18nParserOptionsProvider: ValueProvider = {
      provide: I18N_PARSER_OPTIONS,
      useValue: options.parserOptions,
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
        parser: I18nParser,
      ): Promise<Observable<I18nTranslation>> => {
        try {
          const translation = await parser.parse();
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
      inject: [I18nParser],
    };

    const languagessProvider = {
      provide: I18N_LANGUAGES,
      useFactory: async (parser: I18nParser): Promise<Observable<string[]>> => {
        try {
          const languages = await parser.languages();
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
      inject: [I18nParser],
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
        languagessProvider,
        resolversProvider,
        i18nParserProvider,
        i18nParserOptionsProvider,
        i18nLanguagesSubjectProvider,
        i18nTranslationSubjectProvider,
        ...this.createResolverProviders(options.resolvers),
      ],
      exports: [I18nService, I18nRequestScopeService, languagessProvider],
    };
  }

  static forRootAsync(options: I18nAsyncOptions): DynamicModule {
    const asyncOptionsProvider = this.createAsyncOptionsProvider(options);
    const asyncTranslationProvider = this.createAsyncTranslationProvider();
    const asyncLanguagesProvider = this.createAsyncLanguagesProvider();
    const asyncParserOptionsProvider = this.createAsyncParserOptionsProvider();

    const i18nLanguagesSubject = new BehaviorSubject<string[]>([]);
    const i18nTranslationSubject = new BehaviorSubject<I18nTranslation>({});

    const resolversProvider: ValueProvider = {
      provide: I18N_RESOLVERS,
      useValue: options.resolvers || [],
    };

    const i18nParserProvider: ClassProvider<I18nParser> = {
      provide: I18nParser,
      useClass: options.parser,
    };

    const i18nOptions: ValueProvider = {
      provide: I18N_OPTIONS,
      useValue: options,
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
        asyncParserOptionsProvider,
        I18nService,
        i18nOptions,
        I18nRequestScopeService,
        resolversProvider,
        i18nParserProvider,
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
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: I18N_OPTIONS,
      useFactory: async (optionsFactory: I18nOptionsFactory) =>
        await optionsFactory.createI18nOptions(),
      inject: [options.useClass || options.useExisting],
    };
  }

  private static createAsyncParserOptionsProvider(): Provider {
    return {
      provide: I18N_PARSER_OPTIONS,
      useFactory: async (options: I18nOptions): Promise<any> => {
        return options.parserOptions;
      },
      inject: [I18N_OPTIONS],
    };
  }

  private static createAsyncTranslationProvider(): Provider {
    return {
      provide: I18N_TRANSLATIONS,
      useFactory: async (
        parser: I18nParser,
        translationsSubject: BehaviorSubject<I18nTranslation>,
      ): Promise<Observable<I18nTranslation>> => {
        try {
          const translation = await parser.parse();
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
      inject: [I18nParser, I18N_TRANSLATIONS_SUBJECT],
    };
  }

  private static createAsyncLanguagesProvider(): Provider {
    return {
      provide: I18N_LANGUAGES,
      useFactory: async (
        parser: I18nParser,
        languagesSubject: BehaviorSubject<string[]>,
      ): Promise<Observable<string[]>> => {
        try {
          const languages = await parser.languages();
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
      inject: [I18nParser, I18N_LANGUAGES_SUBJECT],
    };
  }

  private static sanitizeI18nOptions(options: I18nOptions) {
    options = { ...defaultOptions, ...options };
    return options;
  }

  private static createResolverProviders(resolvers?: I18nOptionResolver[]) {
    return (resolvers || [])
      .filter(shouldResolve)
      .reduce<Provider[]>((providers, r) => {
        if (r.hasOwnProperty('use') && r.hasOwnProperty('options')) {
          const resolver = r as ResolverWithOptions;
          const optionsToken = getI18nResolverOptionsToken(
            (resolver.use as unknown) as () => void,
          );
          providers.push({
            provide: resolver.use,
            useClass: resolver.use,
            inject: [optionsToken],
          });
          providers.push({
            provide: optionsToken,
            useFactory: () => resolver.options,
          });
        } else {
          const optionsToken = getI18nResolverOptionsToken(
            (r as unknown) as () => void,
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
