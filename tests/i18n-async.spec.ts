import { Test } from '@nestjs/testing';
import * as path from 'path';
import { I18nModule, I18nService } from '../lib';

describe('i18n module', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRootAsync({
          useFactory: () => {
            return {
              path: path.join(__dirname, '/i18n/'),
              fallbackLanguage: 'en',
            };
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
    expect(i18nService.translate('en', 'HELLO')).toBe('Hello');
    expect(i18nService.translate('nl', 'HELLO')).toBe('Hallo');
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
              path: path.join(__dirname, '/i18n'),
              fallbackLanguage: 'en',
            };
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
    expect(i18nService.translate('en', 'HELLO')).toBe('Hello');
    expect(i18nService.translate('nl', 'HELLO')).toBe('Hallo');
  });
});
