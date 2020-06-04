import { I18nService, translateOptions } from './services/i18n.service';

export class I18nContext {
  constructor(
    readonly detectedLanguage: string,
    private readonly service: I18nService,
  ) {}

  public translate(key: string, options?: translateOptions) {
    options = {
      lang: this.detectedLanguage,
      ...options,
    };
    return this.service.translate(key, options);
  }

  public t(key: string, options?: translateOptions) {
    return this.translate(key, options);
  }
}
