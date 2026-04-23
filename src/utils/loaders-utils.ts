import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18nLoader } from '../loaders/i18n.loader';
import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import { mergeDeep } from './merge';

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
      : new BehaviorSubject<I18nTranslation>(result as I18nTranslation),
  );

  return combineLatest(observables).pipe(
    map((results) =>
      results.reduce((acc, curr) => mergeDeep({ ...acc }, curr), {}),
    ),
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
      : new BehaviorSubject<string[]>(result as string[]),
  );

  return combineLatest(observables).pipe(
    map((results) => [...new Set(results.flat())]),
  );
}
