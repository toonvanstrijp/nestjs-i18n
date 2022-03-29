import { I18nService, TranslateOptions } from './services/i18n.service';

export class I18nContext {
  constructor(readonly lang: string, private readonly service: I18nService) {}

  public translate(key: string, options?: TranslateOptions) {
    options = {
      lang: this.lang,
      ...options,
    };
    return this.service.translate(key, options);
  }

  public t(key: string, options?: TranslateOptions) {
    return this.translate(key, options);
  }
}
