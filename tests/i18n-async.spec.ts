import { Test } from '@nestjs/testing';
import * as path from 'path';
import { I18nModule, I18nService, I18nJsonParser } from '../src';

describe('i18n async module', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRootAsync({
          useFactory: () => {
            return {
              fallbackLanguage: 'en',
              parserOptions: {
                path: path.join(__dirname, '/i18n/'),
              },
            };
          },
          parser: I18nJsonParser,
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', async () => {
    expect(i18nService.translate('test.HELLO', { lang: 'en' })).toBe(
      'Hello',
    );
    expect(i18nService.translate('test.HELLO', { lang: 'nl' })).toBe(
      'Hallo',
    );
  });
});

describe('i18n module without trailing slash in path', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRootAsync({
          useFactory: () => {
            return {
              fallbackLanguage: 'en',
              parserOptions: {
                path: path.join(__dirname, '/i18n'),
              },
            };
          },
          parser: I18nJsonParser,
        }),
      ],
    }).compile();

    i18nService = await module.get(I18nService);
  });

  it('i18n service should be defined', () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'en' })).toBe(
      'Hello',
    );
    expect(i18nService.translate('test.HELLO', { lang: 'nl' })).toBe(
      'Hallo',
    );
  });
});

describe('i18n async module with fallbacks', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRootAsync({
          useFactory: () => {
            return {
              fallbackLanguage: 'en',
              fallbacks: {
                'en-CA': 'fr',
                'en-*': 'en',
                'fr-*': 'fr',
                pt: 'pt-BR',
              },
              parserOptions: {
                path: path.join(__dirname, '/i18n/'),
              },
            };
          },
          parser: I18nJsonParser,
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', () => {
    expect(i18nService.translate('test.HELLO')).toBe('Hello');
    expect(i18nService.translate('test.HELLO', { lang: 'en' })).toBe(
      'Hello',
    );
    expect(i18nService.translate('test.HELLO', { lang: 'en-US' })).toBe(
      'Hello',
    );
    expect(i18nService.translate('test.HELLO', { lang: 'en-CA' })).toBe(
      'Bonjour',
    );
    expect(i18nService.translate('test.HELLO', { lang: 'nl' })).toBe(
      'Hallo',
    );
    expect(i18nService.translate('test.HELLO', { lang: 'fr' })).toBe(
      'Bonjour',
    );
    expect(i18nService.translate('test.HELLO', { lang: 'fr-BE' })).toBe(
      'Bonjour',
    );
    expect(i18nService.translate('test.HELLO', { lang: 'pt' })).toBe(
      'Olá',
    );
    expect(i18nService.translate('test.HELLO', { lang: 'pt-BR' })).toBe(
      'Olá',
    );
  });
});
