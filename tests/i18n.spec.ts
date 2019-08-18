import { Test } from '@nestjs/testing';
import * as path from 'path';
import { I18nModule, I18nService } from '../lib';
import { HelloController } from './controllers/hello.controller';

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
    expect(i18nService.translate('test.HELLO', 'en')).toBe('Hello');
    expect(i18nService.translate('test.HELLO', 'nl')).toBe('Hallo');
  });

  it('i18n service should return nested translation', async () => {
    expect(
      i18nService.translate('test.PRODUCT.NEW', 'en', [{ name: 'Test' }]),
    ).toBe('New Product: Test');
    expect(
      i18nService.translate('test.PRODUCT.NEW', 'nl', [{ name: 'Test' }]),
    ).toBe('Nieuw Product: Test');

    expect(
      i18nService.translate('test.PRODUCT.NEW', 'nl', { name: 'Test' }),
    ).toBe('Nieuw Product: Test');
  });

  it('i18n service should return array translation', async () => {
    expect(i18nService.translate('test.ARRAY.0', 'en')).toBe('ONE');
    expect(i18nService.translate('test.ARRAY.1', 'en')).toBe('TWO');
    expect(i18nService.translate('test.ARRAY.2', 'en')).toBe('THREE');

    expect(i18nService.translate('test.ARRAY.0', 'nl')).toBe('EEN');
    expect(i18nService.translate('test.ARRAY.1', 'nl')).toBe('TWEE');
    expect(i18nService.translate('test.ARRAY.2', 'nl')).toBe('DRIE');
  });

  it('i18n service should return fallback translation', async () => {
    expect(i18nService.translate('test.ENGLISH', 'nl')).toBe('English');
  });

  it('i18n service should return fallback translation if language not registed', async () => {
    expect(i18nService.translate('test.ENGLISH', 'es')).toBe('English');
  });

  it('i18n service should not load the custom file', async () => {
    expect(i18nService.translate('test.custom', 'en')).toBe('test.custom');
  });
});

describe('i18n module without trailing slash in path', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          path: path.join(__dirname, '/i18n'),
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
    expect(i18nService.translate('test.HELLO', 'en')).toBe('Hello');
    expect(i18nService.translate('test.HELLO', 'nl')).toBe('Hallo');
  });

  it('i18n service should return key if translation is not found', async () => {
    expect(i18nService.translate('NOT_EXISTING_KEY', 'en')).toBe(
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
          path: path.join(__dirname, '/i18n/'),
          filePattern: '*.custom',
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
    expect(i18nService.translate('test.custom', 'en')).toBe('my custom text');
  });

  it('i18n service should not load the custom file', async () => {
    expect(i18nService.translate('test.HELLO', 'en')).toBe('test.HELLO');
  });
});

describe('i18n module loads custom files with wrong file pattern', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          path: path.join(__dirname, '/i18n/'),
          filePattern: 'custom',
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
    expect(i18nService.translate('test.custom', 'en')).toBe('my custom text');
  });

  it('i18n service should not load the custom file', async () => {
    expect(i18nService.translate('test.HELLO', 'en')).toBe('test.HELLO');
  });
});
