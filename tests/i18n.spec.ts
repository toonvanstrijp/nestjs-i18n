import { Test } from '@nestjs/testing';
import * as path from 'path';
import { I18nModule, I18nService } from '../lib';

describe('i18n module', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          path: path.join(__dirname, '/i18n/'),
          fallbackLanguage: 'en',
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

  it('i18n service should return nested translation', async () => {
    expect(i18nService.translate('en', 'PRODUCT.NEW', [{ name: 'Test' }])).toBe(
      'New Product: Test',
    );
    expect(i18nService.translate('nl', 'PRODUCT.NEW', [{ name: 'Test' }])).toBe(
      'Nieuw Product: Test',
    );

    expect(i18nService.translate('nl', 'PRODUCT.NEW', { name: 'Test' })).toBe(
      'Nieuw Product: Test',
    );
  });

  it('i18n service should return array translation', async () => {
    expect(i18nService.translate('en', 'ARRAY.0')).toBe('ONE');
    expect(i18nService.translate('en', 'ARRAY.1')).toBe('TWO');
    expect(i18nService.translate('en', 'ARRAY.2')).toBe('THREE');

    expect(i18nService.translate('nl', 'ARRAY.0')).toBe('EEN');
    expect(i18nService.translate('nl', 'ARRAY.1')).toBe('TWEE');
    expect(i18nService.translate('nl', 'ARRAY.2')).toBe('DRIE');
  });

  it('i18n service should return fallback translation', async () => {
    expect(i18nService.translate('nl', 'ENGLISH')).toBe('English');
  });

  it('i18n service should return global translation in each language', async () => {
    expect(i18nService.translate('en', 'APP_NAME')).toBe('Nest-I18N');
    expect(i18nService.translate('nl', 'APP_NAME')).toBe('Nest-I18N');
  });

  it('i18n service should return overwritten global translation', async () => {
    expect(i18nService.translate('en', 'COMPANY')).toBe('Toon');
    expect(i18nService.translate('nl', 'COMPANY')).toBe('Wim');
  });
});
