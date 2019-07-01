import { Inject, Injectable, Logger } from '@nestjs/common';
import * as format from 'string-format';
import {
  I18N_OPTIONS,
  I18N_TRANSLATIONS,
  I18nTranslation,
} from '../i18n.constants';
import { I18nOptions } from '../interfaces/i18n-options.interface';

@Injectable()
export class I18nService {
  constructor(
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
    @Inject(I18N_TRANSLATIONS)
    private readonly translations: I18nTranslation,
    private readonly logger: Logger,
  ) {}

  public translate(
    lang: string,
    key: string,
    args: Array<{ [k: string]: any } | string> = [],
  ) {
    let translation = this.translations[lang][key];

    if (translation === undefined || translation === null) {
      const message = `translation "${key}" in "${lang}" doesn't exist.`;
      this.logger.error(message);
      if (
        (this.i18nOptions.fallbackLanguage !== null ||
          this.i18nOptions.fallbackLanguage !== undefined) &&
        lang !== this.i18nOptions.fallbackLanguage
      ) {
        return this.translate(this.i18nOptions.fallbackLanguage, key, args);
      } else {
        return undefined;
      }
    }
    if (args && args.length > 0) {
      translation = format(translation, ...(args || []));
    }
    return translation;
  }
}
