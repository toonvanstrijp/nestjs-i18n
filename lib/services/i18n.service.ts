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
    key: string,
    options?: {
      lang?: string;
      args?: Array<{ [k: string]: any } | string> | { [k: string]: any };
    },
  ) {
    const { lang, args } = options;
    const translationsByLanguage = this.translations[lang];
    const message = `translation "${key}" in "${lang}" doesn't exist.`;
    if (
      (translationsByLanguage === undefined ||
        translationsByLanguage === null ||
        (!!translationsByLanguage &&
          !translationsByLanguage.hasOwnProperty(key))) &&
      lang !== this.i18nOptions.fallbackLanguage
    ) {
      this.logger.error(message);
      return this.translate(key, {
        lang: this.i18nOptions.fallbackLanguage,
        args: args,
      });
    }

    let translation = translationsByLanguage[key];

    if (args || (args instanceof Array && args.length > 0)) {
      translation = format(
        translation,
        ...(args instanceof Array ? args || [] : [args]),
      );
    }
    return translation || key;
  }
}
