import { DynamicModule, Global, Module } from '@nestjs/common';
import { I18N_PATH } from './i18n.constants';
import { I18nService } from './services/i18n.service';

@Global()
@Module({})
export class I18nModule {
  static forRoot(i18nPath: string): DynamicModule {
    const i18nPathOption = {
      provide: I18N_PATH,
      useValue: i18nPath,
    };

    return {
      module: I18nModule,
      providers: [
        i18nPathOption,
        { provide: I18nService, useValue: new I18nService(i18nPath) },
      ],
      exports: [I18nService],
    };
  }
}
