import { Test, TestingModule } from '@nestjs/testing';
import { EMPTY, EmptyError, of, Subject, throwError } from 'rxjs';

import { I18nModule, I18nService, I18nLoader } from '../src';
import { I18nTranslation } from '../src/interfaces';

class RefreshLoader extends I18nLoader {
  translations: I18nTranslation = { en: { greeting: 'Before refresh' } };
  supportedLanguages = ['en'];
  translationFailure?: Error;
  languageFailure?: Error;

  async load() {
    if (this.translationFailure) {
      throw this.translationFailure;
    }
    return this.translations;
  }

  async languages() {
    if (this.languageFailure) {
      throw this.languageFailure;
    }
    return this.supportedLanguages;
  }
}

describe('i18n refresh state', () => {
  let module: TestingModule;
  let service: I18nService;
  let loader: RefreshLoader;
  let previousTranslations: I18nTranslation;
  let previousLanguages: string[];

  const nextTranslations = { en: { greeting: 'After refresh' }, fr: { greeting: 'Bonjour' } };
  const nextLanguages = ['en', 'fr'];

  beforeEach(async () => {
    loader = new RefreshLoader();
    module = await Test.createTestingModule({
      imports: [I18nModule.forRoot({ fallbackLanguage: 'en', loaders: [loader] })],
    }).compile();
    await module.init();
    service = module.get(I18nService);
    previousTranslations = service.getTranslations();
    previousLanguages = service.getSupportedLanguages();
  });

  afterEach(async () => {
    await module.close();
  });

  const expectPreviousState = () => {
    expect(service.getTranslations()).toBe(previousTranslations);
    expect(service.getSupportedLanguages()).toBe(previousLanguages);
    expect(service.translate('greeting', { lang: 'en' })).toBe('Before refresh');
  };

  it('keeps the previous state when loading languages fails after loading translations', async () => {
    const failure = new Error('Language catalog is unavailable');
    loader.translations = nextTranslations;
    loader.supportedLanguages = nextLanguages;
    loader.languageFailure = failure;

    await expect(service.refresh()).rejects.toBe(failure);
    expectPreviousState();

    loader.languageFailure = undefined;
    await service.refresh();
    expect(service.getTranslations()).toEqual(nextTranslations);
    expect(service.getSupportedLanguages()).toEqual(nextLanguages);
  });

  it('keeps the previous state when loading translations fails', async () => {
    const failure = new Error('Translation catalog is unavailable');
    loader.translationFailure = failure;
    loader.supportedLanguages = nextLanguages;

    await expect(service.refresh()).rejects.toBe(failure);
    expectPreviousState();
  });

  it('keeps the previous state when the supplied language observable fails', async () => {
    const failure = new Error('Language stream failed');

    await expect(
      service.refresh(
        nextTranslations,
        throwError(() => failure),
      ),
    ).rejects.toBe(failure);
    expectPreviousState();
  });

  it('keeps the previous state when the language observable completes without a value', async () => {
    await expect(service.refresh(nextTranslations, EMPTY)).rejects.toBeInstanceOf(EmptyError);
    expectPreviousState();
  });

  it('keeps the previous state when the supplied translation observable fails', async () => {
    const failure = new Error('Translation stream failed');

    await expect(
      service.refresh(
        throwError(() => failure),
        nextLanguages,
      ),
    ).rejects.toBe(failure);
    expectPreviousState();
  });

  it('waits for the first language value before publishing either result', async () => {
    const languages = new Subject<string[]>();
    const refreshing = service.refresh(nextTranslations, languages);

    try {
      expectPreviousState();
      expect(languages.observed).toBe(true);
      languages.next(nextLanguages);
      await refreshing;

      expect(service.getTranslations()).toBe(nextTranslations);
      expect(service.getSupportedLanguages()).toBe(nextLanguages);
      expect(languages.observed).toBe(false);
      languages.next(['ignored']);
      expect(service.getSupportedLanguages()).toBe(nextLanguages);
    } finally {
      languages.next(nextLanguages);
      languages.complete();
      await refreshing;
    }
  });

  it('continues accepting explicit translation and language values', async () => {
    await service.refresh(nextTranslations, nextLanguages);

    expect(service.getTranslations()).toBe(nextTranslations);
    expect(service.getSupportedLanguages()).toBe(nextLanguages);
    expect(service.translate('greeting', { lang: 'fr' })).toBe('Bonjour');
  });

  it('continues taking only the first value from each supplied observable', async () => {
    await service.refresh(
      of(nextTranslations, { en: { greeting: 'Ignored' } }),
      of(nextLanguages, ['ignored']),
    );

    expect(service.getTranslations()).toBe(nextTranslations);
    expect(service.getSupportedLanguages()).toBe(nextLanguages);
  });
});
