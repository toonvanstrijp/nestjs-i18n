import { Test } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import { I18nModule, I18nService } from '../src/lib';

describe('i18n module missing files', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const basePath = path.join(__dirname, 'i18n');

    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          path: basePath,
          fallbackLanguage: 'en',
          saveMissings: true,
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
  });

  afterAll(async () => {
    const basePath = path.join(__dirname, 'i18n');

    // remove the json.missing file from the i18n/LANG directory!
    const languages = ['en', 'nl'];
    for (const language of languages) {
      if (fs.existsSync(path.join(basePath, language, 'domain.missing'))) {
        fs.unlinkSync(path.join(basePath, language, 'domain.missing'));
      }
    }
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('should report missing translations', async () => {
    // this will create the missing file
    i18nService.translate('domain.unknown.key', { lang: 'en' });

    expect(
      fs.existsSync(path.join(__dirname, 'i18n', 'en', 'domain.missing')),
    ).toBeTruthy();
  });

  it('should report missing translations for various languages', async () => {
    // this will create the missing file
    i18nService.translate('domain.another.key', { lang: 'nl' });

    expect(
      fs.existsSync(path.join(__dirname, 'i18n', 'nl', 'domain.missing')),
    ).toBeTruthy();
    expect(
      fs.existsSync(path.join(__dirname, 'i18n', 'en', 'domain.missing')),
    ).toBeTruthy();
  });
});
