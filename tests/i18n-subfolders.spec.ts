import path from 'path';

import { Test } from '@nestjs/testing';

import { I18nLoader, I18nModule, I18nService } from '../src';

describe('i18n module including subfolders', () => {
  let i18nService: I18nService;
  let i18nLoader: I18nLoader;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
            includeSubfolders: true,
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

  it('i18n service should return translation from subfolder for default language', () => {
    expect(i18nService.translate('subfolder.sub-test.HELLO')).toBe('Hello Subfolder');
  });

  it('i18n service should return translation from subfolder for French', () => {
    expect(i18nService.translate('subfolder.sub-test.HELLO', { lang: 'fr' })).toBe(
      'Bonjour sous-dossier',
    );
  });

  it('i18n service should return translation from global files', () => {
    expect(i18nService.translate('APP_NAME', { lang: 'fr' })).toBe('BLA');
  });

  it('i18n loader should parse each translation file only once', async () => {
    const parseFileSpy = jest.spyOn(i18nLoader as any, 'parseFile');

    try {
      await i18nLoader.load();

      const parsedFiles = parseFileSpy.mock.calls.map(([file]) => file);
      expect(parsedFiles).toContain(path.join(__dirname, '/i18n/global.json'));
      expect(parsedFiles).toContain(path.join(__dirname, '/i18n/en/subfolder/sub-test.json'));
      expect(new Set(parsedFiles).size).toBe(parsedFiles.length);
    } finally {
      parseFileSpy.mockRestore();
    }
  });
});
