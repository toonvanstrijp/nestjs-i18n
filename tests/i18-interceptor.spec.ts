import { ModuleRef } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import path from 'path';
import {
  I18nContext,
  I18nModule,
  I18nService,
  I18nLanguageInterceptor,
  I18N_OPTIONS,
  I18N_RESOLVERS,
} from '../src';
import { I18nMessageFormat } from '../src/utils';
import { firstValueFrom, of } from 'rxjs';

describe('i18n interceptor', () => {
  let i18nService: I18nService;
  let i18nInterceptor: I18nLanguageInterceptor;
  let moduleRef: ModuleRef;
  let i18nOptions: any;
  let messageFormat: I18nMessageFormat;

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
    messageFormat = module.get(I18nMessageFormat);
    i18nInterceptor = new I18nLanguageInterceptor(
      i18nOptions,
      module.get(I18N_RESOLVERS),
      i18nService,
      messageFormat,
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
      messageFormat,
      moduleRef,
    );

    await interceptor.intercept(ctx as any, next as any);

    expect(response.locals.i18nLang).toBe('nl');
  });

  it('stores language on websocket client and provides I18nContext.current() in handler execution', async () => {
    const client: any = {
      handshake: {
        headers: {
          'x-custom-lang': 'nl',
        },
      },
    };

    const wsContext = {
      getType: () => 'ws',
      switchToWs: () => ({
        getClient: () => client,
      }),
    };

    const next = {
      handle: jest.fn(() => of(I18nContext.current()?.lang)),
    };

    const interceptor = new I18nLanguageInterceptor(
      {
        ...i18nOptions,
        skipAsyncHook: false,
      },
      [
        {
          resolve: () => 'nl',
        },
      ] as any,
      i18nService,
      messageFormat,
      moduleRef,
    );

    const result$ = await interceptor.intercept(wsContext as any, next as any);
    const langFromContext = await firstValueFrom(result$);

    expect(client.i18nLang).toBe('nl');
    expect(langFromContext).toBe('nl');
  });
});
