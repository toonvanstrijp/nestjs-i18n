import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  I18N_OPTIONS,
  I18N_TRANSLATIONS,
  I18N_LANGUAGES,
  I18N_LANGUAGES_SUBJECT,
  I18N_TRANSLATIONS_SUBJECT,
} from '../i18n.constants';
import { I18nOptions } from '..';
import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import { Observable, BehaviorSubject, lastValueFrom } from 'rxjs';
import { I18nLoader } from '../loaders/i18n.loader';
import { take } from 'rxjs/operators';
import { I18nPluralObject } from 'src/interfaces/i18n-plural.interface';

export type TranslateOptions = {
  lang?: string;
  args?: ({ [k: string]: any } | string)[] | { [k: string]: any };
  defaultValue?: string;
  debug?: boolean;
};

@Injectable()
export class I18nService {
  private supportedLanguages: string[];
  private translations: I18nTranslation;

  constructor(
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
    @Inject(I18N_TRANSLATIONS)
    translations: Observable<I18nTranslation>,
    @Inject(I18N_LANGUAGES)
    supportedLanguages: Observable<string[]>,
    private readonly logger: Logger,
    private readonly loader: I18nLoader,
    @Inject(I18N_LANGUAGES_SUBJECT)
    private readonly languagesSubject: BehaviorSubject<string[]>,
    @Inject(I18N_TRANSLATIONS_SUBJECT)
    private readonly translationsSubject: BehaviorSubject<I18nTranslation>,
  ) {
    supportedLanguages.subscribe((languages) => {
      this.supportedLanguages = languages;
    });
    translations.subscribe((t) => {
      this.translations = t;
    });
  }

  public translate<T = any>(key: string, options?: TranslateOptions): T {
    options = {
      lang: this.i18nOptions.fallbackLanguage,
      ...options,
    };

    const { defaultValue } = options;
    let { lang } = options;

    if (lang === 'debug') {
      return key as unknown as T;
    }

    lang =
      lang === undefined || lang === null
        ? this.i18nOptions.fallbackLanguage
        : lang;

    lang = this.handleFallbacks(lang);

    const translationsByLanguage = this.translations[lang];

    const translation = this.translateObject(
      key,
      translationsByLanguage ? translationsByLanguage : key,
      options,
      translationsByLanguage ? translationsByLanguage : undefined,
    );

    if (
      translationsByLanguage === undefined ||
      translationsByLanguage === null ||
      !translation
    ) {
      if (lang !== this.i18nOptions.fallbackLanguage || !!defaultValue) {
        if (this.i18nOptions.logging) {
          const message = `Translation "${key}" in "${lang}" does not exist.`;
          this.logger.error(message);
        }
        return this.translate(key, {
          ...options,
          lang: this.i18nOptions.fallbackLanguage,
        });
      }
    }

    return (translation ?? key) as unknown as T;
  }

  public t<T = any>(key: string, options?: TranslateOptions): T {
    return this.translate<T>(key, options);
  }

  public getSupportedLanguages() {
    return this.supportedLanguages;
  }

  public async refresh(
    translations?: I18nTranslation | Observable<I18nTranslation>,
    languages?: string[] | Observable<string[]>,
  ) {
    if (!translations) {
      translations = await this.loader.load();
    }
    if (translations instanceof Observable) {
      this.translationsSubject.next(
        await lastValueFrom(translations.pipe(take(1))),
      );
    } else {
      this.translationsSubject.next(translations);
    }

    if (!languages) {
      languages = await this.loader.languages();
    }

    if (languages instanceof Observable) {
      this.languagesSubject.next(await lastValueFrom(languages.pipe(take(1))));
    } else {
      this.languagesSubject.next(languages);
    }
  }

  public hbsHelper = (key: string, args: any, options: any) => {
    if (!options) {
      options = args;
    }

    const lang = options.lookupProperty(options.data.root, 'i18nLang');
    return this.t(key, { lang, args });
  };

  private translateObject(
    key: string,
    translations: I18nTranslation | string,
    options?: TranslateOptions,
    rootTranslations?: I18nTranslation | string,
  ): I18nTranslation | string {
    const keys = key.split('.');
    const [firstKey] = keys;

    const args = options?.args ?? {};

    if (keys.length > 1 && !translations[key]) {
      const newKey = keys.slice(1, keys.length).join('.');

      return translations && translations[firstKey]
        ? this.translateObject(
            newKey,
            translations[firstKey],
            options,
            rootTranslations,
          )
        : undefined;
    }

    let translation = translations[key] ?? options?.defaultValue;

    if (translation && (args || (args instanceof Array && args.length > 0))) {
      const pluralObject = this.getPluralObject(translation);
      if (pluralObject && args && args['count'] !== undefined) {
        const count = Number(args['count']);

        if (count == 0 && !!pluralObject.zero) {
          translation = pluralObject.zero;
        } else if (count == 1 && !!pluralObject.one) {
          translation = pluralObject.one;
        } else if (pluralObject.other) {
          translation = pluralObject.other;
        }
      } else if (translation instanceof Object) {
        const result = Object.keys(translation).reduce((obj, nestedKey) => {
          return {
            ...obj,
            [nestedKey]: this.translateObject(
              nestedKey,
              translation,
              options,
              rootTranslations,
            ),
          };
        }, {});

        if (translation instanceof Array) {
          return Object.values(result) as unknown as I18nTranslation;
        }

        return result;
      }
      translation = this.i18nOptions.formatter(
        translation,
        ...(args instanceof Array ? args || [] : [args]),
      );
      const nestedTranslations = this.getNestedTranslations(translation);
      if (nestedTranslations && nestedTranslations.length > 0) {
        let offset = 0;
        for (const nestedTranslation of nestedTranslations) {
          const result =
            (this.translateObject(nestedTranslation.key, rootTranslations, {
              ...options,
              args: { parent: options.args, ...nestedTranslation.args },
            }) as string) ?? '';
          translation =
            translation.substring(0, nestedTranslation.index - offset) +
            result +
            translation.substring(
              nestedTranslation.index + nestedTranslation.length - offset,
            );
          offset = offset + (nestedTranslation.length - result.length);
        }
      }
    }

    return translation;
  }

  private handleFallbacks(lang: string) {
    if (this.i18nOptions.fallbacks && !this.supportedLanguages.includes(lang)) {
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

  private getPluralObject(translation: any): I18nPluralObject | undefined {
    if (translation['one'] || translation['zero'] || translation['other']) {
      return translation as I18nPluralObject;
    }
    return undefined;
  }

  private getNestedTranslations(
    translation: string,
  ): { index: number; length: number; key: string; args: any }[] | undefined {
    const list = [];
    const regex = /\$t\((.*?)(,(.*?))?\)/g;
    let result: RegExpExecArray;
    while ((result = regex.exec(translation))) {
      let key = undefined;
      let args = {};
      let index = undefined;
      let length = undefined;
      if (result && result.length > 0) {
        key = result[1].trim();
        index = result.index;
        length = result[0].length;
        if (result.length >= 3) {
          try {
            args = JSON.parse(result[3]);
          } catch (e) {
            this.logger.error(`Error while parsing JSON`, e);
          }
        }
      }
      if (key) {
        list.push({ index, length, key, args });
      }
      result = undefined;
    }

    return list.length > 0 ? list : undefined;
  }
}
