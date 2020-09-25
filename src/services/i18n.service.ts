import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as format from 'string-format';
import {
  I18N_OPTIONS,
  I18N_TRANSLATIONS,
  I18N_LANGUAGES,
  I18N_LANGUAGES_SUBJECT,
  I18N_TRANSLATIONS_SUBJECT,
} from '../i18n.constants';
import { I18nOptions } from '..';
import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import * as _ from 'lodash';
import { Observable, BehaviorSubject } from 'rxjs';
import { I18nParser } from '../parsers/i18n.parser';
import { take } from 'rxjs/operators';

export type translateOptions = {
  lang?: string;
  args?: ({ [k: string]: any } | string)[] | { [k: string]: any };
};

@Injectable()
export class I18nService {
  constructor(
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
    @Inject(I18N_TRANSLATIONS)
    private readonly translations: Observable<I18nTranslation>,
    @Inject(I18N_LANGUAGES)
    private readonly supportedLanguages: Observable<string[]>,
    private readonly logger: Logger,
    private readonly parser: I18nParser,
    @Inject(I18N_LANGUAGES_SUBJECT)
    private readonly languagesSubject: BehaviorSubject<string[]>,
    @Inject(I18N_TRANSLATIONS_SUBJECT)
    private readonly translationsSubject: BehaviorSubject<I18nTranslation>,
  ) {}

  public async translate(
    key: string,
    options?: translateOptions,
  ): Promise<any> {
    options = {
      lang: this.i18nOptions.fallbackLanguage,
      ...options,
    };

    const { args } = options;
    let { lang } = options;

    lang =
      lang === undefined || lang === null
        ? this.i18nOptions.fallbackLanguage
        : lang;

    lang = await this.handleFallbacks(lang);

    const translationsByLanguage = (
      await this.translations.pipe(take(1)).toPromise()
    )[lang];

    const translation = await this.translateObject(
      key,
      translationsByLanguage ? translationsByLanguage : key,
      options,
    );

    if (
      translationsByLanguage === undefined ||
      translationsByLanguage === null ||
      !translation
    ) {
      if (lang !== this.i18nOptions.fallbackLanguage) {
        const message = `Translation "${key}" in "${lang}" does not exist.`;
        this.logger.error(message);

        return this.translate(key, {
          lang: this.i18nOptions.fallbackLanguage,
          args,
        });
      }
    }

    return translation || key;
  }

  public t(key: string, options?: translateOptions) {
    return this.translate(key, options);
  }

  public async getSupportedLanguages() {
    return this.supportedLanguages.pipe(take(1)).toPromise();
  }

  public async refresh() {
    const translations = await this.parser.parse();
    if (translations instanceof Observable) {
      this.translationsSubject.next(
        await translations.pipe(take(1)).toPromise(),
      );
    } else {
      this.translationsSubject.next(translations);
    }

    const languages = await this.parser.languages();
    if (languages instanceof Observable) {
      this.languagesSubject.next(await languages.pipe(take(1)).toPromise());
    } else {
      this.languagesSubject.next(languages);
    }
  }

  private async translateObject(
    key: string,
    translations: I18nTranslation | string,
    options?: translateOptions,
  ): Promise<I18nTranslation | string> {
    const keys = key.split('.');
    const [firstKey] = keys;

    const { args } = options;

    if (keys.length > 1 && !translations.hasOwnProperty(key)) {
      const newKey = keys.slice(1, keys.length).join('.');

      return translations && translations.hasOwnProperty(firstKey)
        ? await this.translateObject(newKey, translations[firstKey], options)
        : undefined;
    }

    let translation = translations[key];

    if (translation && (args || (args instanceof Array && args.length > 0))) {
      if (translation instanceof Object) {
        return Object.keys(translation).reduce(async (obj, nestedKey) => {
          return {
            ...(await obj),
            [nestedKey]: await this.translateObject(
              nestedKey,
              translation,
              options,
            ),
          };
        }, Promise.resolve({}));
      }
      translation = format(
        translation,
        ...(args instanceof Array ? args || [] : [args]),
      );
    }

    return translation;
  }

  private async handleFallbacks(lang: string) {
    const supportedLanguages = await this.getSupportedLanguages();
    if (this.i18nOptions.fallbacks && !supportedLanguages.includes(lang)) {
      const sanitizedLang = lang.includes('-')
        ? lang.substring(0, lang.indexOf('-')).concat('-*')
        : lang;

      for (const key in this.i18nOptions.fallbacks) {
        if (key === lang || key === sanitizedLang) {
          lang = this.i18nOptions.fallbacks[key];
          break;
        }
      }
    }
    return lang;
  }
}
