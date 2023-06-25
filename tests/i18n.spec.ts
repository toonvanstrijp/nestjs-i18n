import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import * as fs from 'fs';
import {
  I18nModule,
  I18nService,
  I18nLoader,
  i18nValidationMessage,
} from '../src';
import { I18nTranslations } from './generated/i18n.generated';

describe('i18n module', () => {
  let i18nService: I18nService<I18nTranslations>;
  let i18nLoader: I18nLoader;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
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
      'ru',
      'uk',
      'zh-CN',
      'zh-TW',
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
      'ru',
      'uk',
      'zh-CN',
      'zh-TW',
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

  describe('i18n should refresh manually', () => {
    const newTranslationPath = path.join(__dirname, '/i18n/nl/test2.json');
    const newLanguagePath = path.join(__dirname, '/i18n/es/');

    afterAll(async () => {
      fs.unlinkSync(newTranslationPath);
      fs.rmdirSync(newLanguagePath);
    });

    it('i18n should refresh translations and languages', async () => {
      const loadSpy = jest.spyOn(i18nLoader, 'load');
      const languagesSpy = jest.spyOn(i18nLoader, 'languages');
      await i18nService.refresh();
      expect(loadSpy).toHaveBeenCalled();
      expect(languagesSpy).toHaveBeenCalled();
    });

    it('i18n should load new translations', async () => {
      fs.writeFileSync(
        newTranslationPath,
        JSON.stringify({ WORLD: 'wereld' }),
        'utf8',
      );
      await i18nService.refresh();
      const translation = i18nService.translate<any>('test2.WORLD', {
        lang: 'nl',
      });
      expect(translation).toEqual('wereld');
    });

    it('i18n should load new languages', async () => {
      try {
        fs.mkdirSync(newLanguagePath);
      } catch (e) {
        // ignore
      }
      await i18nService.refresh();
      const languages = i18nService.getSupportedLanguages();
      expect(languages).toContain('es');
      const translations = i18nService.getTranslations();
      expect(Object.keys(translations)).toContain('es');
    });
  });
});

describe('i18n module without trailing slash in path', () => {
  let i18nService: I18nService<I18nTranslations>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
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
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
            filePattern: '*.custom',
          },
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
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
            filePattern: 'custom',
          },
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

describe('i18n module with loader watch', () => {
  let i18nService: I18nService<I18nTranslations>;
  let i18nLoader: I18nLoader;

  const newTranslationPath = path.join(__dirname, '/i18n/nl/test2.json');
  const newLanguagePath = path.join(__dirname, '/i18n/de/');
  let i18nModule: TestingModule;
  beforeAll(async () => {
    i18nModule = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
            watch: true,
          },
        }),
      ],
    }).compile();

    i18nService = i18nModule.get(I18nService);
    i18nLoader = i18nModule.get(I18nLoader);
  });

  afterAll(async () => {
    await i18nModule.close();
    try {
      fs.unlinkSync(newTranslationPath);
    } catch (e) {
      // ignore
    }
    try {
      fs.rmdirSync(newLanguagePath);
    } catch (e) {
      // ignore
    }
  });

  it('i18n should load before init finished', async () => {
    const translation = i18nService.translate('test.HELLO', {
      lang: 'nl',
    });
    expect(translation).toEqual('Hallo');
  });

  it('i18n should load new translations', async () => {
    fs.writeFileSync(
      newTranslationPath,
      JSON.stringify({ WORLD: 'wereld' }),
      'utf8',
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    const translation = i18nService.translate<any>('test2.WORLD', {
      lang: 'nl',
    });
    expect(translation).toEqual('wereld');
  });

  it('i18n should load new languages', async () => {
    try {
      fs.mkdirSync(newLanguagePath);
    } catch (e) {
      // ignore
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    const languages = i18nService.getSupportedLanguages();
    expect(languages).toContain('de');
    const translations = i18nService.getTranslations();
    expect(Object.keys(translations)).toContain('de');
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
            'fr_*': 'fr',
            pt: 'pt-BR',
          },
          loaderOptions: {
            path: path.join(__dirname, '/i18n'),
          },
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
        lang: 'ru',
        args: { count: 1 },
      }),
    ).toBe('1 день');

    expect(
      await i18nService.translate('test.day_interval', {
        lang: 'ru',
        args: { count: 3 },
      }),
    ).toBe('3 дня');

    expect(
      await i18nService.translate('test.day_interval', {
        lang: 'ru',
        args: { count: 7 },
      }),
    ).toBe('7 дней');

    expect(
      await i18nService.translate('test.day_interval', {
        lang: 'ru',
        args: { count: 25 },
      }),
    ).toBe('25 дней');

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
