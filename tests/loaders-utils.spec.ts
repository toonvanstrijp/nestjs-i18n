import { I18nLoader } from '../src/loaders/i18n.loader';
import { I18nTranslation } from '../src/interfaces/i18n-translation.interface';
import { processTranslations, processLanguages } from '../src/utils/loaders-utils';
import { BehaviorSubject, Observable } from 'rxjs';

describe('loaders-utils', () => {
  describe('processTranslations', () => {
    it('should merge translations from multiple loaders', async () => {
      const loader1 = new MockI18nLoader(
        { en: { greeting: 'Hello', core: { name: 'Core' } }, nl: { greeting: 'Hallo' } },
        ['en', 'nl'],
      );
      const loader2 = new MockI18nLoader(
        { en: { feature: 'Feature', core: { version: '1.0' } }, fr: { feature: 'Caractéristique' } },
        ['en', 'fr'],
      );

      const result = await processTranslations([loader1, loader2]);

      expect(result).toEqual({
        en: {
          greeting: 'Hello',
          core: { name: 'Core', version: '1.0' },
          feature: 'Feature',
        },
        nl: { greeting: 'Hallo' },
        fr: { feature: 'Caractéristique' },
      });
    });

    it('should handle empty loaders array', async () => {
      const result = await processTranslations([]);
      expect(result).toEqual({});
    });

    it('should handle single loader', async () => {
      const loader = new MockI18nLoader(
        { en: { greeting: 'Hello' } },
        ['en'],
      );

      const result = await processTranslations([loader]);

      expect(result).toEqual({ en: { greeting: 'Hello' } });
    });

    it('should deeply merge nested objects', async () => {
      const loader1 = new MockI18nLoader(
        {
          en: {
            common: { yes: 'Yes', no: 'No', nested: { a: 'A' } },
          },
        },
        ['en'],
      );
      const loader2 = new MockI18nLoader(
        {
          en: {
            common: { cancel: 'Cancel', nested: { b: 'B' } },
          },
        },
        ['en'],
      );

      const result = await processTranslations([loader1, loader2]);

      expect(((result as I18nTranslation).en as I18nTranslation).common).toEqual({
        yes: 'Yes',
        no: 'No',
        cancel: 'Cancel',
        nested: { a: 'A', b: 'B' },
      });
    });

    it('should handle Observable results from loaders', async () => {
      const translations1 = { en: { greeting: 'Hello' } };
      const translations2 = { en: { feature: 'Feature' } };

      const loader1 = new MockI18nLoaderWithObservable(
        new BehaviorSubject(translations1),
        ['en'],
      );
      const loader2 = new MockI18nLoaderWithObservable(
        new BehaviorSubject(translations2),
        ['en'],
      );

      const result = await processTranslations([loader1, loader2]);

      expect(result instanceof Observable).toBe(true);

      // Subscribe to get actual value
      await new Promise((resolve) => {
        (result as Observable<I18nTranslation>).subscribe((translations) => {
          expect(translations).toEqual({
            en: { greeting: 'Hello', feature: 'Feature' },
          });
          resolve(null);
        });
      });
    });
  });

  describe('processLanguages', () => {
    it('should combine languages from multiple loaders', async () => {
      const loader1 = new MockI18nLoader({}, ['en', 'nl']);
      const loader2 = new MockI18nLoader({}, ['en', 'fr']);

      const result = await processLanguages([loader1, loader2]);

      expect(result).toEqual(expect.arrayContaining(['en', 'nl', 'fr']));
      expect(result).toHaveLength(3);
    });

    it('should deduplicate languages', async () => {
      const loader1 = new MockI18nLoader({}, ['en', 'nl']);
      const loader2 = new MockI18nLoader({}, ['en', 'nl', 'fr']);

      const result = await processLanguages([loader1, loader2]);

      expect(result).toEqual(expect.arrayContaining(['en', 'nl', 'fr']));
      expect(result).toHaveLength(3);
    });

    it('should handle empty loaders array', async () => {
      const result = await processLanguages([]);
      expect(result).toEqual([]);
    });

    it('should handle single loader', async () => {
      const loader = new MockI18nLoader({}, ['en', 'nl']);
      const result = await processLanguages([loader]);

      expect(result).toEqual(expect.arrayContaining(['en', 'nl']));
    });

    it('should handle Observable results from loaders', async () => {
      const loader1 = new MockI18nLoaderWithObservable(
        new BehaviorSubject({}),
        new BehaviorSubject(['en', 'nl']),
      );
      const loader2 = new MockI18nLoaderWithObservable(
        new BehaviorSubject({}),
        new BehaviorSubject(['fr']),
      );

      const result = await processLanguages([loader1, loader2]);

      expect(result instanceof Observable).toBe(true);

      // Subscribe to get actual value
      await new Promise((resolve) => {
        (result as Observable<string[]>).subscribe((languages) => {
          expect(languages).toEqual(
            expect.arrayContaining(['en', 'nl', 'fr']),
          );
          resolve(null);
        });
      });
    });
  });
});

// Mock loaders for testing
class MockI18nLoader extends I18nLoader {
  constructor(
    private translations: I18nTranslation,
    private langs: string[],
  ) {
    super();
  }

  async languages(): Promise<string[]> {
    return this.langs;
  }

  async load(): Promise<I18nTranslation> {
    return this.translations;
  }
}

class MockI18nLoaderWithObservable extends I18nLoader {
  constructor(
    private translations: BehaviorSubject<I18nTranslation> | Observable<I18nTranslation>,
    private langs: BehaviorSubject<string[]> | Observable<string[]> | string[],
  ) {
    super();
  }

  async languages(): Promise<Observable<string[]> | string[]> {
    return this.langs;
  }

  async load(): Promise<Observable<I18nTranslation> | I18nTranslation> {
    return this.translations;
  }
}
