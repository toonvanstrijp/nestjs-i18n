import { Test } from '@nestjs/testing';
import path from 'path';
import { I18nModule, I18nService, I18nYamlLoader } from '../src';

describe('i18n yaml module', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaders: [
            new I18nYamlLoader({
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
});
