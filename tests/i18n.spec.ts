import { Test } from '@nestjs/testing';
import path from 'path';
import fs from 'fs';
import {
  i18nValidationMessage,
  I18N_LOADERS,
  I18nJsonLoader,
  I18nLoader,
  I18nModule,
  I18nService,
} from '../src';
import { I18nTranslations } from './generated/i18n.generated';
import { I18nAbstractFileLoaderOptions } from '../src/loaders/i18n.abstract-file.loader';

describe('i18n module', () => {
  let i18nService: I18nService<I18nTranslations>;
  let i18nLoader: I18nLoader<I18nAbstractFileLoaderOptions>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaders: [
            new I18nJsonLoader({
              path: path.join(__dirname, '/i18n/'),
            }),
            new I18nJsonLoader({
              path: path.join(__dirname, '/i18n-second/'),
            }),
          ],
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
    const loaders = module.get(I18N_LOADERS);
    i18nLoader = loaders[0];
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'en' })).toBe('Hello');
    expect(i18nService.translate('test.HELLO', { lang: 'nl' })).toBe('Hallo');
  });

  it('i18n service should fallback to the fallback language if none is provided', () => {
    expect(i18nService.translate('test.HELLO')).toBe('Hello');
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

    expect(
      i18nService.translate('test.PRODUCT.NEW', {
        lang: 'nl',
        args: { name: 'Test' },
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

  it('i18n service should return fallback translation', () => {
    expect(i18nService.translate('test.ENGLISH', { lang: 'nl' })).toBe(
      'English',
    );
  });

  it('i18n service should return fallback translation if language not registered', () => {
    expect(i18nService.translate('test.ENGLISH', { lang: 'es' })).toBe(
      'English',
    );
  });

  it('i18n service should fallback to base lang if language is not registered', () => {
    expect(i18nService.translate('test.ENGLISH', { lang: 'de-AT' })).toBe(
      'Englisch',
    );
  });

  it('i18n service should fallback to base lang if translation does not exist', () => {
    expect(i18nService.translate('test.ENGLISH', { lang: 'de-DE' })).toBe(
      'Englisch',
    );
  });

  it('i18n service should fallback to base sub region if translation does not exist', () => {
    expect(
      i18nService.translate('test.CURRENT_LANGUAGE', {
        lang: 'de-DE-bavarian',
      }),
    ).toBe('de-DE');
  });

  it('i18n service should not load the custom file', () => {
    expect(i18nService.translate<any>('test.custom', { lang: 'en' })).toBe(
      'test.custom',
    );
  });

  it('i18n service should return supported languages', () => {
    expect(i18nService.getSupportedLanguages()).toEqual([
      'de',
      'de-DE',
      'en',
      'fr',
      'nl',
      'pt-BR',
      'zh-CN',
      'zh-TW',
      'uk',
    ]);
  });

  it('i18n service should return translations', () => {
    expect(Object.keys(i18nService.getTranslations())).toEqual([
      'de',
      'de-DE',
      'en',
      'fr',
      'nl',
      'pt-BR',
      'zh-CN',
      'zh-TW',
      'uk',
    ]);
  });

  it('i18n service should return key if lang is debug', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'debug' })).toBe(
      'test.HELLO',
    );
  });

  it('i18n service should use defaultValue if translation is missing', () => {
    expect(
      i18nService.translate<any>('test.missing', {
        lang: 'bla',
        defaultValue:
          'the translation is missing, nested: $t(test.HELLO), arg: {hello}',
        args: { hello: 'world' },
      }),
    ).toBe('the translation is missing, nested: Hello, arg: world');
  });

  it('i18n service should use defaultValue if translation is missing for nested keys', () => {
    const result = i18nService.translate<any>('test.missing.nested.keys', {
      defaultValue:
        'the translation is missing, nested: $t(test.HELLO), arg: {hello}',
      args: { hello: 'world' },
    });
    expect(result).toBe(
      'the translation is missing, nested: Hello, arg: world',
    );
  });

  it('i18n service should NOT return translation from subfolders by default', () => {
    expect(i18nService.translate<any>('subfolder.sub-test.HELLO')).toBe(
      'subfolder.sub-test.HELLO',
    );
  });

});

describe('i18n module without trailing slash in path', () => {
  let i18nService: I18nService<I18nTranslations>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaders: [
            new I18nJsonLoader({
              path: path.join(__dirname, '/i18n/'),
            }),
          ],
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'en' })).toBe('Hello');
    expect(i18nService.translate('test.HELLO', { lang: 'nl' })).toBe('Hallo');
  });

  it('i18n service should return key if translation is not found', () => {
    expect(i18nService.translate<any>('NOT_EXISTING_KEY', { lang: 'en' })).toBe(
      'NOT_EXISTING_KEY',
    );
  });
});

describe('i18n module loads custom files', () => {
  let i18nService: I18nService<I18nTranslations>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaders: [
            new I18nJsonLoader({
              path: path.join(__dirname, '/i18n/'),
              filePattern: '*.custom',
            }),
          ],
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
  });

  it('i18n service should be defined', () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', () => {
    expect(i18nService.translate<any>('test.custom', { lang: 'en' })).toBe(
      'my custom text',
    );
  });

  it('i18n service should not load the custom file', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'en' })).toBe(
      'test.HELLO',
    );
  });
});

describe('i18n module loads custom files with wrong file pattern', () => {
  let i18nService: I18nService<I18nTranslations>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaders: [
            new I18nJsonLoader({
              filePattern: 'custom',
              path: path.join(__dirname, '/i18n/'),
            }),
          ],
        }),
      ],
    }).compile();
    i18nService = module.get(I18nService);
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', () => {
    expect(i18nService.translate<any>('test.custom', { lang: 'en' })).toBe(
      'my custom text',
    );
  });

  it('i18n service should not load the custom file', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'en' })).toBe(
      'test.HELLO',
    );
  });
});

describe('i18n module with fallbacks', () => {
  let i18nService: I18nService<I18nTranslations>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          fallbacks: {
            'en-CA': 'fr',
            'en-*': 'en',
            'fr-*': 'fr',
            'en_*': 'en',
            ua: 'ua',
            'fr_*': 'fr',
            pt: 'pt-BR',
          },
          loaders: [
            new I18nJsonLoader({
              path: path.join(__dirname, '/i18n/'),
            }),
            new I18nJsonLoader({
              path: path.join(__dirname, '/i18n-second/'),
            }),
          ],
          typesOutputPath: path.join(__dirname, '/generated/i18n.generated.ts'),
        }),
      ],
    }).compile();

    const app = module.createNestApplication();
    await app.init();

    i18nService = module.get(I18nService);
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return english translation', () => {
    expect(i18nService.translate('test.HELLO')).toBe('Hello');
    expect(i18nService.translate('test.HELLO', { lang: 'en' })).toBe('Hello');
    expect(i18nService.translate('test.HELLO', { lang: 'en-US' })).toBe(
      'Hello',
    );
    expect(i18nService.translate('test.HELLO', { lang: 'en_US' })).toBe(
      'Hello',
    );
  });

  it('i18n service should return dutch translation', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'nl' })).toBe('Hallo');
  });

  it('i18n service should return french translation', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'fr' })).toBe('Bonjour');
    expect(i18nService.translate('test.HELLO', { lang: 'fr-BE' })).toBe(
      'Bonjour',
    );
    expect(i18nService.translate('test.HELLO', { lang: 'fr_BE' })).toBe(
      'Bonjour',
    );
    expect(i18nService.translate('test.HELLO', { lang: 'en-CA' })).toBe(
      'Bonjour',
    );
  });

  it('i18n service should return portuguese-brazil translation', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'pt' })).toBe('Olá');
    expect(i18nService.translate('test.HELLO', { lang: 'pt-BR' })).toBe('Olá');
  });

  it('i18n service should return translation with . in key', () => {
    expect(i18nService.translate('test.dot.test')).toBe('test');
  });

  it('should santize values from pipe caharacters', () => {
    expect(
      i18nValidationMessage<I18nTranslations>('test.HELLO')({
        value: 'example|||',
        constraints: [],
        targetName: 'string',
        property: 'string',
        object: {},
      }),
    ).toBe('test.HELLO|{"value":"example","constraints":[]}');
  });

  it('i18n service should return correct plural form', async () => {
    expect(
      await i18nService.translate('test.day_interval', {
        lang: 'en',
        args: { count: 0 },
      }),
    ).toBe('Never');

    expect(
      await i18nService.translate('test.day_interval', {
        lang: 'en',
        args: { count: 1 },
      }),
    ).toBe('Every day');

    expect(
      await i18nService.translate('test.day_interval', {
        lang: 'en',
        args: { count: 5 },
      }),
    ).toBe('Every 5 days');

    expect(
      await i18nService.translate('test.day_interval', {
        lang: 'uk',
        args: { count: 1 },
      }),
    ).toBe('1 день');

    expect(
      await i18nService.translate('test.day_interval', {
        lang: 'uk',
        args: { count: 2 },
      }),
    ).toBe('2 дні');

    expect(
      await i18nService.translate('test.day_interval', {
        lang: 'uk',
        args: { count: 9 },
      }),
    ).toBe('9 днів');

    expect(
      await i18nService.translate('test.day_interval', {
        lang: 'uk',
        args: { count: 22 },
      }),
    ).toBe('22 дні');

    expect(
      await i18nService.translate('test.day_interval', {
        lang: 'uk',
        args: { count: 1.5 },
      }),
    ).toBe('1.5 дня');
  });
});
