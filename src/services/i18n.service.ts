import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
  BehaviorSubject,
  Observable,
  Subject,
  lastValueFrom,
  take,
  takeUntil,
} from 'rxjs';
import {
  I18nContext,
  I18nOptions,
  I18nTranslation,
  I18nValidationError,
} from '..';
import {
  I18N_LANGUAGES,
  I18N_LANGUAGES_SUBJECT,
  I18N_LOADERS,
  I18N_OPTIONS,
  I18N_TRANSLATIONS,
  I18N_TRANSLATIONS_SUBJECT,
  PLURAL_KEYS,
  TransformPipeName,
  DEFAULT_KEY_SEPARATOR,
  DEFAULT_NAMESPACE_SEPARATOR,
  PIPE_SEPARATOR,
} from '../i18n.constants';
import { I18nLoader } from '../loaders/i18n.loader';
import { IfAnyOrNever, Path, PathValue } from '../types';
import { formatI18nErrors, processTranslations, processLanguages } from '../utils';
import { I18nTranslator, I18nPluralObject } from '../interfaces';
import { I18nError } from '../i18n.error';

const translationTransformPipes: Record<string, (value: string) => string> = {
  [TransformPipeName.UPPERCASE]: (value: string) => value.toUpperCase(),
  [TransformPipeName.LOWERCASE]: (value: string) => value.toLowerCase(),
  [TransformPipeName.CAPITALIZE]: (value: string) =>
    value.length > 0
      ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      : value,
};

type ClassValidatorValidate = (
  value: any,
  options?: Record<string, any>,
) => Promise<any[]>;

export interface TranslateOptions {
  lang?: string;
  args?: ({ [k: string]: any } | string)[] | { [k: string]: any };
  defaultValue?: string;
  debug?: boolean;
  useICU?: boolean;
  keySeparator?: string | false;
  nsSeparator?: string | false;
  returnObjects?: boolean;
  joinArrays?: string;
}

@Injectable()
export class I18nService<K = Record<string, unknown>>
  implements I18nTranslator<K>, OnModuleDestroy
{
  private supportedLanguages!: string[];
  private translations!: I18nTranslation;
  private pluralRules = new Map<string, Intl.PluralRules>();
  private transformPlaceholderCounter = 0;

  private unsubscribe = new Subject<void>();

  constructor(
    @Inject(I18N_OPTIONS)
    protected readonly i18nOptions: I18nOptions,
    @Inject(I18N_TRANSLATIONS)
    translations: Observable<I18nTranslation>,
    @Inject(I18N_LANGUAGES)
    supportedLanguages: Observable<string[]>,
    private readonly logger: Logger,
    @Inject(I18N_LOADERS)
    private readonly loaders: I18nLoader[],
    @Inject(I18N_LANGUAGES_SUBJECT)
    private readonly languagesSubject: BehaviorSubject<string[]>,
    @Inject(I18N_TRANSLATIONS_SUBJECT)
    private readonly translationsSubject: BehaviorSubject<I18nTranslation>,
  ) {
    supportedLanguages
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((languages) => {
        this.supportedLanguages = languages;
      });
    translations.pipe(takeUntil(this.unsubscribe)).subscribe((t) => {
      this.translations = t;
    });
  }

  public onModuleDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public translate<P extends Path<K> = any, R = PathValue<K, P>>(
    key: P,
    options?: TranslateOptions,
  ): IfAnyOrNever<R, string, R> {
    options = {
      lang: I18nContext.current()?.lang || this.i18nOptions.fallbackLanguage,
      ...options,
    };

    const { defaultValue } = options;
    let { lang } = options;

    if (lang === 'debug') {
      return key as unknown as IfAnyOrNever<R, string, R>;
    }

    const previousFallbackLang = lang;

    lang = lang ?? this.i18nOptions.fallbackLanguage;

    lang = this.resolveLanguage(lang);

    const translationsByLanguage = this.translations[lang];

    const translation = this.translateObject(
      key as string,
      (translationsByLanguage ?? key) as string,
      lang,
      options,
      translationsByLanguage,
    );

    if (translationsByLanguage == null || !translation) {
      const translationKeyMissing = `Translation "${
        key as string
      }" in "${lang}" does not exist.`;
      if (lang !== this.i18nOptions.fallbackLanguage || defaultValue) {
        if (this.i18nOptions.throwOnMissingKey) {
          if (this.i18nOptions.logging) {
            this.logger.error(translationKeyMissing);
          }
          throw new I18nError(translationKeyMissing);
        }

        const nextFallbackLanguage = this.getFallbackLanguage(lang);

        if (previousFallbackLang !== nextFallbackLanguage) {
          return this.translate(key, {
            ...options,
            lang: nextFallbackLanguage,
          });
        }
      }
    }

    return (translation ?? key) as unknown as IfAnyOrNever<R, string, R>;
  }

  private getFallbackLanguage(lang: string) {
    let regionSepIndex = -1;

    if (lang.includes('-')) {
      regionSepIndex = lang.lastIndexOf('-');
    }

    if (lang.includes('_')) {
      regionSepIndex = lang.lastIndexOf('_');
    }

    return regionSepIndex !== -1
      ? lang.slice(0, regionSepIndex)
      : this.i18nOptions.fallbackLanguage;
  }

  public t<P extends Path<K> = any, R = PathValue<K, P>>(
    key: P,
    options?: TranslateOptions,
  ): IfAnyOrNever<R, string, R> {
    return this.translate(key, options);
  }

  public getSupportedLanguages() {
    return this.supportedLanguages;
  }

  public getTranslations() {
    return this.translations;
  }

  public async refresh(
    translations?: I18nTranslation | Observable<I18nTranslation>,
    languages?: string[] | Observable<string[]>,
  ) {
    if (!translations) {
      translations = await processTranslations(this.loaders);
    }
    if (translations instanceof Observable) {
      this.translationsSubject.next(
        await lastValueFrom(translations.pipe(take(1))),
      );
    } else {
      this.translationsSubject.next(translations);
    }

    if (!languages) {
      languages = await processLanguages(this.loaders);
    }

    if (languages instanceof Observable) {
      this.languagesSubject.next(await lastValueFrom(languages.pipe(take(1))));
    } else {
      this.languagesSubject.next(languages);
    }
  }

  public hbsHelper = (key: string, args: any, options: any): string => {
    if (!options) {
      options = args;
    }

    const lang = options.lookupProperty(options.data.root, 'i18nLang');
    return this.t(key as Path<K>, { lang, args }) as string;
  };

  private translateObject(
    key: string,
    translations: I18nTranslation | string,
    lang: string,
    options?: TranslateOptions,
    rootTranslations?: I18nTranslation | string,
  ): I18nTranslation | string | undefined {
    const args = options?.args;
    const translationObject =
      typeof translations === 'string' ? undefined : translations;

    let translation =
      (translationObject
        ? this.getTranslationByKey(translationObject, key, options)
        : translations) ??
      options?.defaultValue;

    if (translation && args !== undefined) {
      const pluralObject = this.getPluralObject(translation);
      const countValue =
        !Array.isArray(args) && args ? args['count'] : undefined;
      if (pluralObject && countValue !== undefined) {
        const count = Number(countValue);

        let pluralRules = this.pluralRules.get(lang);
        if (!pluralRules) {
          pluralRules = new Intl.PluralRules(lang);
          this.pluralRules.set(lang, pluralRules);
        }
        const pluralCategory = pluralRules.select(count);

        if (count === 0 && pluralObject['zero']) {
          translation = pluralObject['zero'];
        } else if (pluralObject[pluralCategory]) {
          translation = pluralObject[pluralCategory];
        }
      }
    }

    if (translation instanceof Object) {
      const shouldReturnObjects =
        options?.returnObjects ?? this.i18nOptions.returnObjects ?? true;
      const joinArrays = options?.joinArrays ?? this.i18nOptions.joinArrays;

      if (translation instanceof Array) {
        if (typeof joinArrays === 'string') {
          return translation.map((item) => String(item)).join(joinArrays);
        }

        if (!shouldReturnObjects) {
          return key;
        }

        if (args === undefined) {
          return translation as unknown as I18nTranslation;
        }

        const result: { [key: string]: I18nTranslation | string } = {};
        for (const nestedKey of Object.keys(translation)) {
          const nestedTranslation = this.translateObject(
            nestedKey,
            translation,
            lang,
            options,
            rootTranslations,
          );
          result[nestedKey] =
            nestedTranslation === undefined ? nestedKey : nestedTranslation;
        }

        return Object.values(result) as unknown as I18nTranslation;
      }

      if (!shouldReturnObjects) {
        return key;
      }

      if (args === undefined) {
        return translation;
      }

      const result: { [key: string]: I18nTranslation | string } = {};
      for (const nestedKey of Object.keys(translation)) {
        const nestedTranslation = this.translateObject(
          nestedKey,
          translation,
          lang,
          options,
          rootTranslations,
        );
        result[nestedKey] =
          nestedTranslation === undefined ? nestedKey : nestedTranslation;
      }

      return result;
    }

    if (typeof translation !== 'string') {
      return translation;
    }

    if (args !== undefined) {
      const { template, formatterArgs } = this.applyTranslationTransformPipes(
        translation,
        args,
      );
      if (this.i18nOptions.formatter) {
        translation = this.i18nOptions.formatter(template, ...formatterArgs);
      } else {
        translation = template;
      }
      const nestedTranslations = this.getNestedTranslations(translation);
      if (nestedTranslations && nestedTranslations.length > 0) {
        let offset = 0;
        for (const nestedTranslation of nestedTranslations) {
          const result = rootTranslations
            ? ((this.translateObject(
                nestedTranslation.key,
                rootTranslations,
                lang,
                {
                  ...options,
                  args: { parent: options?.args, ...nestedTranslation.args },
                },
              ) as string) ?? '')
            : '';
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

  private getTranslationByKey(
    translations: I18nTranslation,
    key: string,
    options?: TranslateOptions,
  ): I18nTranslation | string | undefined {
    if (translations[key] !== undefined) {
      return translations[key] as I18nTranslation | string;
    }

    const nsSeparator = this.getNamespaceSeparator(options);
    if (nsSeparator && key.includes(nsSeparator)) {
      const separatorIndex = key.indexOf(nsSeparator);
      const namespace = key.slice(0, separatorIndex);
      const namespacedKey = key.slice(separatorIndex + nsSeparator.length);
      const namespaceTranslations = translations[namespace];

      if (
        namespaceTranslations !== undefined &&
        typeof namespaceTranslations !== 'string'
      ) {
        return this.getTranslationByKey(
          namespaceTranslations as I18nTranslation,
          namespacedKey,
          {
            ...options,
            nsSeparator: false,
          },
        );
      }
    }

    const keySeparator = this.getKeySeparator(options);
    if (!keySeparator || !key.includes(keySeparator)) {
      return undefined;
    }

    const separatorIndex = key.indexOf(keySeparator);
    const firstKey = key.slice(0, separatorIndex);
    const nestedKey = key.slice(separatorIndex + keySeparator.length);
    const nestedTranslations = translations[firstKey];

    if (nestedTranslations && typeof nestedTranslations !== 'string') {
      return this.getTranslationByKey(
        nestedTranslations as I18nTranslation,
        nestedKey,
        options,
      );
    }

    return undefined;
  }

  private getKeySeparator(options?: TranslateOptions): string | false {
    return options?.keySeparator ?? this.i18nOptions.keySeparator ?? DEFAULT_KEY_SEPARATOR;
  }

  private getNamespaceSeparator(options?: TranslateOptions): string | false {
    return options?.nsSeparator ?? this.i18nOptions.nsSeparator ?? DEFAULT_NAMESPACE_SEPARATOR;
  }

  private applyTranslationTransformPipes(
    template: string,
    args?: ({ [k: string]: any } | string)[] | { [k: string]: any },
  ): {
    template: string;
    formatterArgs: (string | Record<string, string>)[];
  } {
    const transformedValues: Record<string, string> = {};
    const withPipesApplied = template.replace(
      /\{\{\s*([^{}]+?)\s*\}\}/g,
      (match, rawExpression: string) => {
        const parts = rawExpression
          .split(PIPE_SEPARATOR)
          .map((part) => part.trim())
          .filter((part) => part.length > 0);

        if (parts.length < 2) {
          return match;
        }

        const [argPath, ...transforms] = parts;
        const rawValue = this.getArgValueByPath(args, argPath);
        let transformedValue = rawValue == null ? '' : String(rawValue);

        for (const transformName of transforms) {
          const transformFn =
            translationTransformPipes[transformName.toLowerCase()];
          if (!transformFn) {
            continue;
          }
          transformedValue = transformFn(transformedValue);
        }

        const placeholderKey = `__i18n_transform_${this
          .transformPlaceholderCounter++}`;
        transformedValues[placeholderKey] = transformedValue;

        return `{${placeholderKey}}`;
      },
    );

    const formatterArgs = this.createFormatterArgs(args, transformedValues);
    return {
      template: withPipesApplied,
      formatterArgs,
    };
  }

  private createFormatterArgs(
    args?: ({ [k: string]: any } | string)[] | { [k: string]: any },
    transformedValues: Record<string, string> = {},
  ): (string | Record<string, string>)[] {
    if (!args || !Object.keys(transformedValues).length) {
      return args instanceof Array ? args || [] : ([args] as any);
    }

    if (!(args instanceof Array)) {
      return [{ ...args, ...transformedValues } as Record<string, string>];
    }

    const formatterArgs = [...args];
    const objectArgIndex = formatterArgs.findIndex(
      (entry) => typeof entry === 'object' && entry !== null,
    );

    if (objectArgIndex === -1) {
      formatterArgs.push(transformedValues);
      return formatterArgs as (string | Record<string, string>)[];
    }

    formatterArgs[objectArgIndex] = {
      ...(formatterArgs[objectArgIndex] as Record<string, string>),
      ...transformedValues,
    };

    return formatterArgs as (string | Record<string, string>)[];
  }

  private getArgValueByPath(
    args: ({ [k: string]: any } | string)[] | { [k: string]: any } | undefined,
    path: string,
  ): unknown {
    if (!args || !path) {
      return undefined;
    }

    const sources = args instanceof Array ? args : [args];
    for (const source of sources) {
      if (typeof source !== 'object' || source === null) {
        continue;
      }

      const value = path
        .split('.')
        .reduce((acc: unknown, key: string): unknown => {
          if (acc == null || typeof acc !== 'object') {
            return undefined;
          }
          return (acc as Record<string, unknown>)[key];
        }, source as unknown);

      if (value !== undefined) {
        return value;
      }
    }

    return undefined;
  }

  public resolveLanguage(lang: string) {
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
    for (const k of PLURAL_KEYS) {
      if (translation[k]) {
        return translation as I18nPluralObject;
      }
    }

    return undefined;
  }

  private getNestedTranslations(
    translation: string,
  ): { index: number; length: number; key: string; args: any }[] | undefined {
    const list: { index: number; length: number; key: string; args: any }[] =
      [];
    const regex = /\$t\((.*?)(,(.*?))?\)/g;
    let result: RegExpExecArray | null;
    while ((result = regex.exec(translation)) !== null) {
      const key = result[1]?.trim();
      if (!key) {
        continue;
      }

      let args = {};
      if (result.length >= 3 && result[3]) {
        try {
          args = JSON.parse(result[3]);
        } catch (e) {
          this.logger.error(`Error while parsing JSON`, e);
        }
      }

      list.push({
        index: result.index,
        length: result[0].length,
        key,
        args,
      });
    }

    return list.length > 0 ? list : undefined;
  }

  public async validate(
    value: any,
    options?: TranslateOptions,
  ): Promise<I18nValidationError[]> {
    const validate = await this.getClassValidatorValidate();
    const errors = await validate(value, this.i18nOptions.validatorOptions);
    return formatI18nErrors(errors, this, options);
  }

  private async getClassValidatorValidate(): Promise<ClassValidatorValidate> {
    try {
      const module = await import('class-validator');
      if (typeof module.validate !== 'function') {
        throw new Error('Missing validate export');
      }
      return module.validate as ClassValidatorValidate;
    } catch {
      throw new I18nError(
        'class-validator is required when using i18n validation features. Install it with: npm install class-validator',
      );
    }
  }
}
