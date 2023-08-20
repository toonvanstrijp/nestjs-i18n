import { Test } from '@nestjs/testing';
import path from 'path';
import {
  I18N_LOADERS,
  I18nJsonLoader,
  I18nLoader,
  I18nModule,
  I18nService,
} from '../src';
import { I18nAbstractFileLoader } from '../src/loaders/i18n.abstract-file.loader';

describe('i18n module including subfolders', () => {
  let i18nService: I18nService;
  let i18nLoader: I18nLoader<I18nAbstractFileLoader>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaders: [
            new I18nJsonLoader({
              path: path.join(__dirname, '/i18n/'),
              includeSubfolders: true,
            }),
          ],
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
    i18nLoader = module.get(I18N_LOADERS)[0];
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return translation from subfolder for default language', () => {
    expect(i18nService.translate('subfolder.sub-test.HELLO')).toBe(
      'Hello Subfolder',
    );
  });

  it('i18n service should return translation from subfolder for French', () => {
    expect(
      i18nService.translate('subfolder.sub-test.HELLO', { lang: 'fr' }),
    ).toBe('Bonjour sous-dossier');
  });
});
