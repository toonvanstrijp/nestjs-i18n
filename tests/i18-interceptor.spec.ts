import { ModuleRef } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import path from 'path';
import {
  I18N_OPTIONS,
  I18N_RESOLVERS,
  I18nJsonLoader,
  I18nLanguageInterceptor,
  I18nModule,
  I18nService,
} from '../src';

describe('i18n interceptor', () => {
  let i18nService: I18nService;
  let i18nInterceptor: I18nLanguageInterceptor;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaders: [
            new I18nJsonLoader({
              path: path.join(__dirname, '/i18n/'),
            }),
          ],
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
    i18nInterceptor = new I18nLanguageInterceptor(
      module.get(I18N_OPTIONS),
      module.get(I18N_RESOLVERS),
      i18nService,
      module.get(ModuleRef),
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
});
