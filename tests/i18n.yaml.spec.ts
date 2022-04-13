import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import * as fs from 'fs';
import { I18nModule, I18nService, I18nLoader, I18nYamlLoader } from '../src';

describe('i18n yaml module', () => {
  let i18nService: I18nService;
  let i18nLoader: I18nLoader;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
          loader: I18nYamlLoader,
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

  /*
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

  it('i18n service should not load the custom file', () => {
    expect(i18nService.translate('test.custom', { lang: 'en' })).toBe(
      'test.custom',
    );
  });

  it('i18n service should return supported languages', () => {
    expect(i18nService.getSupportedLanguages()).toEqual([
      'en',
      'fr',
      'nl',
      'pt-BR',
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
      i18nService.translate('test.missing', {
        lang: 'bla',
        defaultValue:
          'the translation is missing, nested: $t(test.HELLO), arg: {hello}',
        args: { hello: 'world' },
      }),
    ).toBe('the translation is missing, nested: Hello, arg: world');
  });

  describe('i18n should refresh manually', () => {
    const newTranslationPath = path.join(__dirname, '/i18n/nl/test2.json');
    const newLanguagePath = path.join(__dirname, '/i18n/de/');

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
      const translation = i18nService.translate('test2.WORLD', {
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
      expect(languages).toContain('de');
    });
  });
});

describe('i18n module without trailing slash in path', () => {
  let i18nService: I18nService;

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
    expect(i18nService.translate('NOT_EXISTING_KEY', { lang: 'en' })).toBe(
      'NOT_EXISTING_KEY',
    );
  });
});

describe('i18n module loads custom files', () => {
  let i18nService: I18nService;

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
    expect(i18nService.translate('test.custom', { lang: 'en' })).toBe(
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
  let i18nService: I18nService;

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
    expect(i18nService.translate('test.custom', { lang: 'en' })).toBe(
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
  let i18nService: I18nService;
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

  it('i18n should load new translations', async () => {
    fs.writeFileSync(
      newTranslationPath,
      JSON.stringify({ WORLD: 'wereld' }),
      'utf8',
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    const translation = i18nService.translate('test2.WORLD', {
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
  });
});

describe('i18n module with fallbacks', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          fallbacks: {
            'en-CA': 'fr',
            'en-*': 'en',
            'fr-*': 'fr',
            pt: 'pt-BR',
          },
          loaderOptions: {
            path: path.join(__dirname, '/i18n'),
          },
        }),
      ],
    }).compile();

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
  });

  it('i18n service should return dutch translation', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'nl' })).toBe('Hallo');
  });

  it('i18n service should return french translation', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'fr' })).toBe('Bonjour');
    expect(i18nService.translate('test.HELLO', { lang: 'fr-BE' })).toBe(
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
  */
});
