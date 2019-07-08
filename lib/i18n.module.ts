import {
  DynamicModule,
  Global,
  Logger,
  Module,
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

const logger = new Logger('I18nService');

@Global()
@Module({})
export class I18nModule {
  static forRoot(options: I18nOptions): DynamicModule {
    options.path = path.normalize(options.path + path.sep);

    const i18nOptions: ValueProvider = {
      provide: I18N_OPTIONS,
      useValue: options,
    };

    const translationsProvider = {
      provide: I18N_TRANSLATIONS,
      useFactory: async () => {
        try {
          return await parseTranslations(options.path);
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
        try {
          return await parseTranslations(options.path);
        } catch (e) {
          return {};
        }
      },
      inject: [I18N_OPTIONS],
    };
  }
}
