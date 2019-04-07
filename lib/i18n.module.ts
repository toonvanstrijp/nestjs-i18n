import { DynamicModule, Global, Module } from '@nestjs/common';
import { I18N_OPTIONS } from './i18n.constants';
import { I18nService } from './services/i18n.service';

export interface I18nOptions {
  path: string,
  fallbackLanguage?: string
}

@Global()
@Module({})
export class I18nModule {
  static forRoot(options: I18nOptions): DynamicModule {
    const i18nOptions = {
      provide: I18N_OPTIONS,
      useValue: options,
    };

    return {
      module: I18nModule,
      providers: [
        i18nOptions,
        I18nService,
      ],
      exports: [I18nService],
    };
  }
}
