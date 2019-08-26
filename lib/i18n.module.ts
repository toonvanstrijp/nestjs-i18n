import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';
import { I18N_OPTIONS, I18N_TRANSLATIONS } from './i18n.constants';
import { I18nService } from './services/i18n.service';
import {
  I18nAsyncOptions,
  I18nOptions,
  I18nOptionsFactory,
} from './interfaces/i18n-options.interface';
import { ValueProvider } from '@nestjs/common/interfaces';
import { parseTranslations } from './utils/parse';
import * as path from 'path';
import { I18nLanguageMiddleware } from './middleware/i18n-language-middleware';
import { HttpAdapterHost, ModuleRef } from '@nestjs/core';

const logger = new Logger('I18nService');

const defaultOptions: Partial<I18nOptions> = {
  filePattern: '*.json',
  resolvers: [],
  saveMissings: false,
};
@Global()
@Module({})
export class I18nModule implements NestModule {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    const adapterName =
      this.httpAdapterHost.httpAdapter &&
      this.httpAdapterHost.httpAdapter.constructor &&
      this.httpAdapterHost.httpAdapter.constructor.name;

    if (adapterName === 'FastifyAdapter') {
      this.moduleRef
        .create(I18nLanguageMiddleware)
        .then(i18nLanguageMiddleware => {
          this.httpAdapterHost.httpAdapter
            .getInstance()
            .addHook('preHandler', (req, res, done) => {
              i18nLanguageMiddleware.use(req, res, done);
            });
        });
    } else {
      consumer.apply(I18nLanguageMiddleware).forRoutes('*');
    }
  }

  static forRoot(options: I18nOptions): DynamicModule {
    options = this.sanitizeI18nOptions(options);
    const i18nOptions: ValueProvider = {
      provide: I18N_OPTIONS,
      useValue: options,
    };

    const translationsProvider = {
      provide: I18N_TRANSLATIONS,
      useFactory: async () => {
        try {
          return await parseTranslations(options);
        } catch (e) {
          return {};
        }
      },
    };

    return {
      module: I18nModule,
      providers: [
        { provide: Logger, useValue: logger },
        I18nService,
        i18nOptions,
        translationsProvider,
      ],
      exports: [I18nService],
    };
  }

  static forRootAsync(options: I18nAsyncOptions): DynamicModule {
    const asyncOptionsProvider = this.createAsyncOptionsProvider(options);
    const asyncTranslationProvider = this.createAsyncTranslationProvider();
    return {
      module: I18nModule,
      imports: options.imports || [],
      providers: [
        { provide: Logger, useValue: logger },
        asyncOptionsProvider,
        asyncTranslationProvider,
        I18nService,
      ],
      exports: [I18nService],
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

  private static createAsyncTranslationProvider(): Provider {
    return {
      provide: I18N_TRANSLATIONS,
      useFactory: async (options: I18nOptions) => {
        options = this.sanitizeI18nOptions(options);
        try {
          return await parseTranslations(options);
        } catch (e) {
          return {};
        }
      },
      inject: [I18N_OPTIONS],
    };
  }

  private static sanitizeI18nOptions(options: I18nOptions) {
    options = { ...defaultOptions, ...options };

    options.path = path.normalize(options.path + path.sep);
    if (!options.filePattern.startsWith('*.')) {
      options.filePattern = '*.' + options.filePattern;
    }

    return options;
  }
}
