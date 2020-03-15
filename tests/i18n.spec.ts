import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import * as fs from 'fs';
import {
  I18nModule,
  I18nService,
  I18nJsonParser,
  I18nParser,
} from '../src/lib';

describe('i18n module', () => {
  let i18nService: I18nService;
  let i18nParser: I18nParser;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          parser: {
            class: I18nJsonParser,
            options: {
              path: path.join(__dirname, '/i18n/'),
            },
          },
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
    i18nParser = module.get(I18nParser);
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', async () => {
    expect(await i18nService.translate('test.HELLO', { lang: 'en' })).toBe(
      'Hello',
    );
    expect(await i18nService.translate('test.HELLO', { lang: 'nl' })).toBe(
      'Hallo',
    );
  });

  it('i18n service should fallback to the fallback language if none is provided', async () => {
    expect(await i18nService.translate('test.HELLO')).toBe('Hello');
  });

  it('i18n service should return nested translation', async () => {
    expect(
      await i18nService.translate('test.PRODUCT.NEW', {
        lang: 'en',
        args: [{ name: 'Test' }],
      }),
    ).toBe('New Product: Test');
    expect(
      await i18nService.translate('test.PRODUCT.NEW', {
        lang: 'nl',
        args: [{ name: 'Test' }],
      }),
    ).toBe('Nieuw Product: Test');

    expect(
      await i18nService.translate('test.PRODUCT.NEW', {
        lang: 'nl',
        args: { name: 'Test' },
      }),
    ).toBe('Nieuw Product: Test');
  });

  it('i18n service should return array translation', async () => {
    expect(await i18nService.translate('test.ARRAY.0', { lang: 'en' })).toBe(
      'ONE',
    );
    expect(await i18nService.translate('test.ARRAY.1', { lang: 'en' })).toBe(
      'TWO',
    );
    expect(await i18nService.translate('test.ARRAY.2', { lang: 'en' })).toBe(
      'THREE',
    );

    expect(await i18nService.translate('test.ARRAY.0', { lang: 'nl' })).toBe(
      'EEN',
    );
    expect(await i18nService.translate('test.ARRAY.1', { lang: 'nl' })).toBe(
      'TWEE',
    );
    expect(await i18nService.translate('test.ARRAY.2', { lang: 'nl' })).toBe(
      'DRIE',
    );
  });

  it('i18n service should return fallback translation', async () => {
    expect(await i18nService.translate('test.ENGLISH', { lang: 'nl' })).toBe(
      'English',
    );
  });

  it('i18n service should return fallback translation if language not registed', async () => {
    expect(await i18nService.translate('test.ENGLISH', { lang: 'es' })).toBe(
      'English',
    );
  });

  it('i18n service should not load the custom file', async () => {
    expect(await i18nService.translate('test.custom', { lang: 'en' })).toBe(
      'test.custom',
    );
  });

  it('i18n service should return supported languages', async () => {
    expect(await i18nService.getSupportedLanguages()).toEqual(['en', 'nl']);
  });

  describe('i18n should refresh manually', () => {
    const newTranslationPath = path.join(__dirname, '/i18n/nl/test2.json');
    const newLanguagePath = path.join(__dirname, '/i18n/de/');

    afterAll(async () => {
      fs.unlinkSync(newTranslationPath);
      fs.rmdirSync(newLanguagePath);
    });

    it('i18n should refresh translations and languages', async () => {
      const parseSpy = jest.spyOn(i18nParser, 'parse');
      const languagesSpy = jest.spyOn(i18nParser, 'languages');
      await i18nService.refresh();
      expect(parseSpy).toHaveBeenCalled();
      expect(languagesSpy).toHaveBeenCalled();
    });

    it('i18n should load new translations', async () => {
      fs.writeFileSync(
        newTranslationPath,
        JSON.stringify({ WORLD: 'wereld' }),
        'utf8',
      );
      await i18nService.refresh();
      const translation = await i18nService.translate('test2.WORLD', {
        lang: 'nl',
      });
      expect(translation).toEqual('wereld');
    });

    it('i18n should load new languages', async () => {
      fs.mkdirSync(newLanguagePath);
      await i18nService.refresh();
      const languages = await i18nService.getSupportedLanguages();
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
          parser: {
            class: I18nJsonParser,
            options: {
              path: path.join(__dirname, '/i18n/'),
            },
          },
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
  });

  it('i18n service should be defined', async () => {
    expect(await i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', async () => {
    expect(await i18nService.translate('test.HELLO', { lang: 'en' })).toBe(
      'Hello',
    );
    expect(await i18nService.translate('test.HELLO', { lang: 'nl' })).toBe(
      'Hallo',
    );
  });

  it('i18n service should return key if translation is not found', async () => {
    expect(
      await i18nService.translate('NOT_EXISTING_KEY', { lang: 'en' }),
    ).toBe('NOT_EXISTING_KEY');
  });
});

describe('i18n module loads custom files', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          parser: {
            class: I18nJsonParser,
            options: {
              path: path.join(__dirname, '/i18n/'),
              filePattern: '*.custom',
            },
          },
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', async () => {
    expect(await i18nService.translate('test.custom', { lang: 'en' })).toBe(
      'my custom text',
    );
  });

  it('i18n service should not load the custom file', async () => {
    expect(await i18nService.translate('test.HELLO', { lang: 'en' })).toBe(
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
          parser: {
            class: I18nJsonParser,
            options: {
              path: path.join(__dirname, '/i18n/'),
              filePattern: 'custom',
            },
          },
        }),
      ],
    }).compile();
    i18nService = module.get(I18nService);
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', async () => {
    expect(await i18nService.translate('test.custom', { lang: 'en' })).toBe(
      'my custom text',
    );
  });

  it('i18n service should not load the custom file', async () => {
    expect(await i18nService.translate('test.HELLO', { lang: 'en' })).toBe(
      'test.HELLO',
    );
  });
});

describe('i18n module with parser watch', () => {
  let i18nService: I18nService;
  let i18nParser: I18nParser;

  const newTranslationPath = path.join(__dirname, '/i18n/nl/test2.json');
  const newLanguagePath = path.join(__dirname, '/i18n/de/');
  let i18nModule: TestingModule;
  beforeAll(async () => {
    i18nModule = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          parser: {
            class: I18nJsonParser,
            options: {
              path: path.join(__dirname, '/i18n/'),
              watch: true,
            },
          },
        }),
      ],
    }).compile();

    i18nService = i18nModule.get(I18nService);
    i18nParser = i18nModule.get(I18nParser);
  });

  afterAll(async () => {
    await i18nModule.close();
    fs.unlinkSync(newTranslationPath);
    fs.rmdirSync(newLanguagePath);
  });

  it('i18n should load new translations', async () => {
    fs.writeFileSync(
      newTranslationPath,
      JSON.stringify({ WORLD: 'wereld' }),
      'utf8',
    );
    await new Promise(resolve => setTimeout(resolve, 1000));
    const translation = await i18nService.translate('test2.WORLD', {
      lang: 'nl',
    });
    expect(translation).toEqual('wereld');
  });

  it('i18n should load new languages', async () => {
    fs.mkdirSync(newLanguagePath);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const languages = await i18nService.getSupportedLanguages();
    expect(languages).toContain('de');
  });
});
