import { Test } from '@nestjs/testing';
import * as path from 'path';
import { I18nLoader, I18nModule, I18nService } from '../src';

describe('i18n module including deep folders', () => {
  let i18nService: I18nService;
  let i18nLoader: I18nLoader;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
            includeDeepFolders: true,
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

  it('i18n service should return translation from deep folder for default language', () => {
    expect(i18nService.translate('deep-folder.deep-test.HELLO')).toBe(
      'Hello Deep Folder',
    );
  });

  it('i18n service should return translation from deep folder for French', () => {
    expect(
      i18nService.translate('deep-folder.deep-test.HELLO', { lang: 'fr' }),
    ).toBe('Bonjour dossier profond');
  });
});
