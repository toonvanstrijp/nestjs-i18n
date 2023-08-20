import { I18nLoader } from '../loaders/i18n.loader';
import {
  BehaviorSubject,
  distinct,
  merge,
  mergeMap,
  Observable,
  of,
  reduce,
} from 'rxjs';
import { logger } from '../i18n.module';
import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import { mergeTranslations } from './merge';

export async function processTranslations(loaders: I18nLoader<unknown>[]) {
  try {
    const loadedTranslations = await Promise.all(
      loaders.map((loader) => loader.load()),
    );

    const hasAtLeastOneObservable =
      loadedTranslations.find(
        (translation) => translation instanceof Observable,
      ) !== undefined;

    if (hasAtLeastOneObservable) {
      const sources = loadedTranslations.map((translation) => {
        const observable = translation instanceof Observable;
        return observable ? translation : of(translation);
      });

      const translationsObs = merge(...sources).pipe(
        reduce((acc, translation) => mergeTranslations(acc, translation)),
      );

      return translationsObs;
    } else {
      return loadedTranslations
        .filter(
          (translation): translation is I18nTranslation =>
            translation !== undefined,
        )
        .reduce((acc, translation) => {
          return mergeTranslations(acc, translation);
        }, {});
    }
  } catch (e) {
    logger.error('parsing translations files or processing error', e);
    throw e;
  }
}

export async function processTranslationsAndReply(
  loaders: I18nLoader<unknown>[],
  translationsSubject: BehaviorSubject<I18nTranslation>,
) {
  const translations = await processTranslations(loaders);

  if (translations instanceof Observable) {
    translations.subscribe(translationsSubject);
  } else {
    translationsSubject.next(translations);
  }

  return translationsSubject.asObservable();
}

export async function processLanguages(loaders: I18nLoader<unknown>[]) {
  try {
    const allLanguages = await Promise.all(
      loaders.map((loader) => loader.languages()),
    );

    const hasAtLeastOneObservable =
      allLanguages.find((languages) => languages instanceof Observable) !==
      undefined;

    if (hasAtLeastOneObservable) {
      return merge(
        allLanguages.map((languages) => {
          const observable = languages instanceof Observable;
          return observable ? languages : of(languages);
        }),
      ).pipe(
        mergeMap((languages) => languages),
        distinct(),
      );
    } else {
      const languagesToRespond = allLanguages
        .filter((languages): languages is string[] => languages !== undefined)
        .flatMap((languages) => languages);

      return [...new Set(languagesToRespond)];
    }
  } catch (e) {
    logger.error('parsing languages or processing error', e);
    throw e;
  }
}

export async function processLanguagesAndReply(
  loaders: I18nLoader<unknown>[],
  languagesSubject: BehaviorSubject<string[]>,
) {
  const languages = await processLanguages(loaders);

  if (languages instanceof Observable) {
    languages.subscribe(languagesSubject);
  } else {
    languagesSubject.next(languages);
  }

  try {
    const languagesSource = await Promise.all(
      loaders.map((loader) => loader.languages()),
    );

    const hasAtLeastOneObservable =
      languagesSource.find((languages) => languages instanceof Observable) !==
      undefined;

    if (hasAtLeastOneObservable) {
      const languagesCombined = merge(
        languagesSource.map((languages) => {
          const observable = languages instanceof Observable;
          return observable ? languages : of(languages);
        }),
      ).pipe(
        mergeMap((languages) => languages),
        distinct(),
      );

      languagesCombined.subscribe(languagesSubject);
    } else {
      const languages = languagesSource
        .filter((languages): languages is string[] => languages !== undefined)
        .flatMap((languages) => languages);
      languagesSubject.next([...new Set(languages)]);
    }
  } catch (e) {
    logger.error('parsing languages or processing error', e);
    throw e;
  }
  return languagesSubject.asObservable();
}
