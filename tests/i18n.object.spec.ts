import path from 'path';

import { Test } from '@nestjs/testing';

import { I18nModule, I18nService, I18nLoader, I18nObjectLoader } from '../src';

describe('i18n object module', () => {
  let i18nService: I18nService;
  let i18nLoader: I18nLoader;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/i18n-object/'),
            filePattern: '*.ts',
          },
          loader: I18nObjectLoader,
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
    i18nLoader = module.get(I18nLoader);
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'en' })).toBe('Hello');
    expect(i18nService.translate('test.HELLO', { lang: 'nl' })).toBe('Hallo');
  });

  it('i18n service should return nested translation', () => {
    expect(
      i18nService.translate('test.PRODUCT.NEW', {
        lang: 'en',
        args: [{ name: 'Test' }],
      }),
    ).toBe('New Product: Test');
    expect(
      i18nService.translate('test.PRODUCT.NEW', {
        lang: 'nl',
        args: [{ name: 'Test' }],
      }),
    ).toBe('Nieuw Product: Test');
  });

  it('i18n service should return array translation', () => {
    expect(i18nService.translate('test.ARRAY.0', { lang: 'en' })).toBe('ONE');
    expect(i18nService.translate('test.ARRAY.1', { lang: 'en' })).toBe('TWO');
    expect(i18nService.translate('test.ARRAY.2', { lang: 'en' })).toBe('THREE');

    expect(i18nService.translate('test.ARRAY.0', { lang: 'nl' })).toBe('EEN');
    expect(i18nService.translate('test.ARRAY.1', { lang: 'nl' })).toBe('TWEE');
    expect(i18nService.translate('test.ARRAY.2', { lang: 'nl' })).toBe('DRIE');
  });

  it('i18n service should return fallback translation if language not registered', () => {
    expect(i18nService.translate('test.ENGLISH', { lang: 'es' })).toBe('English');
  });

  it('i18n service should return supported languages', () => {
    expect(i18nService.getSupportedLanguages()).toEqual(['en', 'nl']);
  });
});
