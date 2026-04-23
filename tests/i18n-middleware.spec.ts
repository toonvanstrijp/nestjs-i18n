import { ModuleRef } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as path from 'path';
import { I18nMiddleware, I18nModule, I18N_OPTIONS, I18N_RESOLVERS, I18nService } from '../src';

describe('i18n middleware', () => {
  let middleware: I18nMiddleware;
  let i18nService: I18nService;
  let moduleRef: ModuleRef;
  let i18nOptions: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          skipAsyncHook: true,
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
    moduleRef = module.get(ModuleRef);
    i18nOptions = module.get(I18N_OPTIONS);

    middleware = new I18nMiddleware(
      i18nOptions,
      module.get(I18N_RESOLVERS),
      i18nService,
      moduleRef,
    );
  });

  it('stores the resolved language on response locals instead of app locals', async () => {
    const next = jest.fn();
    const req: any = { app: { locals: {} } };
    const res: any = { locals: {} };

    await middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.locals).toMatchObject({ i18nLang: 'en' });
    expect(req.app.locals.i18nLang).toBeUndefined();
  });

  it('normalizes resolver array result to a single language string', async () => {
    const next = jest.fn();
    const req: any = { app: { locals: {} } };
    const res: any = { locals: {} };

    const middlewareWithArrayResolver = new I18nMiddleware(
      i18nOptions,
      [
        {
          resolve: () => ['nl', 'en'],
        },
      ] as any,
      i18nService,
      moduleRef,
    );

    await middlewareWithArrayResolver.use(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.i18nLang).toBe('nl');
    expect(res.locals.i18nLang).toBe('nl');
  });
});
