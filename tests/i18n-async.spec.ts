import { Test } from '@nestjs/testing';
import * as path from 'path';
import {
  I18nModule,
  I18nService,
  I18nJsonParser,
  I18nJsonParserOptions,
} from '../src/lib';

describe('i18n async module', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRootAsync({
          useFactory: () => {
            return {
              fallbackLanguage: 'en',
            };
          },
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
});

describe('i18n module without trailing slash in path', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRootAsync({
          useFactory: () => {
            return {
              fallbackLanguage: 'en',
            };
          },
          parser: {
            class: I18nJsonParser,
            options: {
              path: path.join(__dirname, '/i18n'),
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
});
