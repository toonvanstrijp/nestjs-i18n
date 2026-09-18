import path from 'path';

import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { I18nJsonLoader, I18nLoader, I18nModule, I18nService } from '../src';

// Regression test for #785: subclasses must be able to declare/replace the
// loader logger without a "separate declarations of a private property" error.
class CustomLoggerLoader extends I18nJsonLoader {
  protected logger = new Logger(CustomLoggerLoader.name);
}

describe('i18n loader with custom logger', () => {
  let i18nService: I18nService;
  let i18nLoader: I18nLoader;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loader: CustomLoggerLoader,
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
    i18nLoader = module.get(I18nLoader);
  });

  it('should use the subclassed loader', () => {
    expect(i18nLoader).toBeInstanceOf(CustomLoggerLoader);
  });

  it('should still load translations', () => {
    expect(i18nService.translate('test.HELLO')).toBe('Hello');
  });
});
