import { ModuleRef } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as path from 'path';
import {
  I18nModule,
  I18nService,
  I18nLanguageInterceptor,
  I18N_OPTIONS,
  I18N_RESOLVERS,
} from '../src';

describe('i18n interceptor', () => {
  let i18nService: I18nService;
  let i18nInterceptor: I18nLanguageInterceptor;
  let moduleRef: ModuleRef;
  let i18nOptions: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
    moduleRef = module.get(ModuleRef);
    i18nOptions = module.get(I18N_OPTIONS);
    i18nInterceptor = new I18nLanguageInterceptor(
      i18nOptions,
      module.get(I18N_RESOLVERS),
      i18nService,
      moduleRef,
    );
  });

  it('i18n interceptor should be defined', async () => {
    expect(i18nInterceptor).toBeTruthy();
  });

  it('i18n interceptor should skip if context is not supported', async () => {
    const ctx = {
      getType: () => 'unsupported',
    };
    const next = { handle: () => Promise.resolve(true) };
    const result = await i18nInterceptor.intercept(ctx as any, next as any);
    expect(result).toBeTruthy();
  });

  it('stores the resolved language on response locals instead of app locals', async () => {
    const response: any = { locals: {}, app: { locals: {} } };
    const request = { app: response.app };
    const ctx = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    };
    const next = { handle: () => ({ handle: () => true }) };

    await i18nInterceptor.intercept(ctx as any, next as any);

    expect(response.locals).toMatchObject({ i18nLang: 'en' });
    expect(response.app.locals.i18nLang).toBeUndefined();
  });

  it('normalizes resolver array result to a single language string', async () => {
    const response: any = { locals: {}, app: { locals: {} } };
    const request = { app: response.app };
    const ctx = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    };
    const next = { handle: jest.fn(() => ({ handle: () => true })) };

    const interceptor = new I18nLanguageInterceptor(
      {
        ...i18nOptions,
        skipAsyncHook: true,
      },
      [
        {
          resolve: () => ['nl', 'en'],
        },
      ] as any,
      i18nService,
      moduleRef,
    );

    await interceptor.intercept(ctx as any, next as any);

    expect(response.locals.i18nLang).toBe('nl');
  });
});
