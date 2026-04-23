import { Observable, combineLatest, of, shareReplay } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { I18nLoader } from '../loaders/i18n.loader';
import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import { mergeDeep } from './merge';

interface TranslationMergeCache {
  previousMerged: I18nTranslation | null;
  previousResults: I18nTranslation[];
  prefixMerges: I18nTranslation[];
}

const hasSameReferences = (left: readonly unknown[], right: readonly unknown[]) => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
};

const hasSameLanguageValues = (left: string[], right: string[]) => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
};

const cloneTranslation = (translation: I18nTranslation): I18nTranslation =>
  mergeDeep({} as I18nTranslation, translation);

const mergeTranslationResults = (
  results: I18nTranslation[],
  cache: TranslationMergeCache,
) => {
  if (cache.previousMerged && hasSameReferences(cache.previousResults, results)) {
    return cache.previousMerged;
  }

  let firstChangedIndex = 0;
  while (
    firstChangedIndex < cache.previousResults.length &&
    cache.previousResults[firstChangedIndex] === results[firstChangedIndex]
  ) {
    firstChangedIndex++;
  }

  const prefixMerges = cache.prefixMerges.slice(0, firstChangedIndex + 1);
  let merged =
    firstChangedIndex === 0
      ? ({} as I18nTranslation)
      : cache.prefixMerges[firstChangedIndex];

  for (let index = firstChangedIndex; index < results.length; index++) {
    merged = mergeDeep(cloneTranslation(merged), results[index]);
    prefixMerges[index + 1] = merged;
  }

  cache.previousResults = [...results];
  cache.prefixMerges = prefixMerges;
  cache.previousMerged = merged;

  return merged;
};

export async function processTranslations(
  loaders: I18nLoader[],
): Promise<I18nTranslation | Observable<I18nTranslation>> {
  const rawResults = await Promise.all(loaders.map((l) => l.load()));

  const hasObservable = rawResults.some((r) => r instanceof Observable);

  if (!hasObservable) {
    return (rawResults as I18nTranslation[]).reduce(
      (acc, curr) => mergeDeep(acc, curr),
      {} as I18nTranslation,
    );
  }

  const observables = rawResults.map((result) =>
    result instanceof Observable
      ? result
      : of(result as I18nTranslation),
  );

  const cache: TranslationMergeCache = {
    previousMerged: null,
    previousResults: [],
    prefixMerges: [{} as I18nTranslation],
  };

  return combineLatest(observables).pipe(
    map((results) => mergeTranslationResults(results, cache)),
    distinctUntilChanged((left, right) => left === right),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}

export async function processLanguages(
  loaders: I18nLoader[],
): Promise<string[] | Observable<string[]>> {
  const rawResults = await Promise.all(loaders.map((l) => l.languages()));

  const hasObservable = rawResults.some((r) => r instanceof Observable);

  if (!hasObservable) {
    const allLangs = (rawResults as string[][]).flat();
    return [...new Set(allLangs)];
  }

  const observables = rawResults.map((result) =>
    result instanceof Observable
      ? result
      : of(result as string[]),
  );

  return combineLatest(observables).pipe(
    map((results) => [...new Set(results.flat())]),
    distinctUntilChanged((left, right) => hasSameLanguageValues(left, right)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
