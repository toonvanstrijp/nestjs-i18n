import { I18nService, translateOptions } from './services/i18n.service';

export class I18nContext {
  constructor(readonly lang: string, private readonly service: I18nService) {}

  public translate(key: string, options?: translateOptions) {
    options = {
      lang: this.lang,
      ...options,
    };
    return this.service.translate(key, options);
  }

  public t(key: string, options?: translateOptions) {
    return this.translate(key, options);
  }
}
