import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { I18N_OPTIONS } from './i18n.constants';
import { I18nService } from './services/i18n.service';
import {
  I18nAsyncOptions,
  I18nOptions,
  I18nOptionsFactory,
} from './interfaces/i18n-options.interface';
import { ValueProvider } from '@nestjs/common/interfaces';

@Global()
@Module({})
export class I18nModule {
  static forRoot(options: I18nOptions): DynamicModule {
    const i18nOptions: ValueProvider = {
      provide: I18N_OPTIONS,
      useValue: options,
    };

    return {
      module: I18nModule,
      providers: [I18nService, i18nOptions],
      exports: [I18nService],
    };
  }

  static forRootAsync(options: I18nAsyncOptions): DynamicModule {
    const asyncProvider = this.createAsyncOptionsProvider(options);
    return {
      module: I18nModule,
      imports: options.imports || [],
      providers: [asyncProvider, I18nService],
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
}
