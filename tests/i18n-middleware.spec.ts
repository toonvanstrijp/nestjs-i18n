import { ModuleRef } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as path from 'path';
import { I18nMiddleware, I18nModule, I18N_OPTIONS, I18N_RESOLVERS, I18nService } from '../src';

describe('i18n middleware', () => {
  let middleware: I18nMiddleware;

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

    middleware = new I18nMiddleware(
      module.get(I18N_OPTIONS),
      module.get(I18N_RESOLVERS),
      module.get(I18nService),
      module.get(ModuleRef),
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
});
