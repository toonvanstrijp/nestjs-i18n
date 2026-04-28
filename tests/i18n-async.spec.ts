import path from 'path';

import { Global, Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';

import {
  HeaderResolver,
  I18nLanguageInterceptor,
  I18nModule,
  I18nService,
  I18N_OPTIONS,
  I18N_RESOLVERS,
} from '../src';
import { I18nMessageFormat } from '../src/utils';

describe('i18n async module', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRootAsync({
          useFactory: () => {
            return {
              fallbackLanguage: 'en',
              loaderOptions: {
                path: path.join(__dirname, '/i18n/'),
              },
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
    expect(i18nService.translate('test.HELLO', { lang: 'en' })).toBe('Hello');
    expect(i18nService.translate('test.HELLO', { lang: 'nl' })).toBe('Hallo');
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
              loaderOptions: {
                path: path.join(__dirname, '/i18n'),
              },
            };
          },
        }),
      ],
    }).compile();

    i18nService = await module.get(I18nService);
  });

  it('i18n service should be defined', () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', () => {
    expect(i18nService.translate('test.HELLO', { lang: 'en' })).toBe('Hello');
    expect(i18nService.translate('test.HELLO', { lang: 'nl' })).toBe('Hallo');
  });
});

@Global()
@Module({
  providers: [
    {
      provide: 'FALLBACK_LANGUAGE',
      useValue: 'en',
    },
  ],
  exports: ['FALLBACK_LANGUAGE'],
})
export class TestModule {}

describe('i18n async module with fallbacks', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRootAsync({
          imports: [TestModule],
          inject: ['FALLBACK_LANGUAGE'],
          useFactory: (fallbackLanguage: any) => {
            return {
              fallbackLanguage: fallbackLanguage,
              fallbacks: {
                'en-CA': 'fr',
                'en-*': 'en',
                'fr-*': 'fr',
                pt: 'pt-BR',
              },
              loaderOptions: {
                path: path.join(__dirname, '/i18n/'),
              },
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

  it('i18n service should return correct translation', () => {
    expect(i18nService.translate('test.HELLO')).toBe('Hello');
    expect(i18nService.translate('test.HELLO', { lang: 'en' })).toBe('Hello');
    expect(i18nService.translate('test.HELLO', { lang: 'en-US' })).toBe('Hello');
    expect(i18nService.translate('test.HELLO', { lang: 'en-CA' })).toBe('Bonjour');
    expect(i18nService.translate('test.HELLO', { lang: 'nl' })).toBe('Hallo');
    expect(i18nService.translate('test.HELLO', { lang: 'fr' })).toBe('Bonjour');
    expect(i18nService.translate('test.HELLO', { lang: 'fr-BE' })).toBe('Bonjour');
    expect(i18nService.translate('test.HELLO', { lang: 'pt' })).toBe('Olá');
    expect(i18nService.translate('test.HELLO', { lang: 'pt-BR' })).toBe('Olá');
  });
});

describe('i18n async module resolvers', () => {
  let interceptor: I18nLanguageInterceptor;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRootAsync({
          resolvers: [new HeaderResolver(['lang'])],
          useFactory: () => {
            return {
              fallbackLanguage: 'en',
              loaderOptions: {
                path: path.join(__dirname, '/i18n/'),
              },
            };
          },
        }),
      ],
    }).compile();

    interceptor = new I18nLanguageInterceptor(
      module.get(I18N_OPTIONS),
      module.get(I18N_RESOLVERS),
      module.get(I18nService),
      module.get(I18nMessageFormat),
      module.get(ModuleRef),
    );
  });

  it('uses resolvers configured in forRootAsync to resolve request language', async () => {
    const response: any = { locals: {} };
    const request: any = { headers: { lang: 'nl' } };
    const ctx = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    };
    const next = { handle: jest.fn(() => of(true)) };

    await interceptor.intercept(ctx as any, next as any);

    expect(response.locals.i18nLang).toBe('nl');
  });
});
