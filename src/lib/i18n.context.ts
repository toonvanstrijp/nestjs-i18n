import { I18nService } from './services/i18n.service';

export class I18nContext {
  constructor(
    readonly detectedLanguage: string,
    private readonly service: I18nService,
  ) {}

  translate(key, options?) {
    options = {
      lang: this.detectedLanguage,
      ...options,
    };
    return this.service.translate(key, options);
  }
}
