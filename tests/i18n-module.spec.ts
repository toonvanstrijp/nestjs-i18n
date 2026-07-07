import path from 'node:path';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { I18N_LOADERS } from '../src/i18n.constants';
import { I18nModule } from '../src/i18n.module';
import { logger } from '../src/utils';

describe('i18n module', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs an info-level message when no resolvers are provided', () => {
    const logSpy = jest.spyOn(logger, 'log').mockImplementation();
    const errorSpy = jest.spyOn(logger, 'error').mockImplementation();

    (I18nModule as any).createResolverProviders();

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('No resolvers provided.'));
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('registers the view helper on Express locals only', async () => {
    const refresh = jest.fn();
    const expressApp = { locals: {} as Record<string, unknown> };
    const getInstance = jest.fn().mockReturnValue(expressApp);
    const module = Object.create(I18nModule.prototype) as any;

    module.i18n = { refresh, t: jest.fn() };
    module.i18nOptions = { viewEngine: 'ejs' };
    module.adapter = {
      httpAdapter: {
        getInstance,
        constructor: { name: 'ExpressAdapter' },
      },
    };
    module.translations = { pipe: jest.fn() };

    await module.onModuleInit();

    expect(refresh).toHaveBeenCalled();
    expect(expressApp.locals.t).toEqual(expect.any(Function));
  });

  it('does not register the view helper on Fastify app locals', async () => {
    const refresh = jest.fn();
    const getInstance = jest.fn();
    const module = Object.create(I18nModule.prototype) as any;

    module.i18n = { refresh, t: jest.fn() };
    module.i18nOptions = { viewEngine: 'ejs' };
    module.adapter = {
      httpAdapter: {
        getInstance,
        constructor: { name: 'FastifyAdapter' },
      },
    };
    module.translations = { pipe: jest.fn() };

    await module.onModuleInit();

    expect(refresh).toHaveBeenCalled();
    expect(getInstance).not.toHaveBeenCalled();
  });

  it('emits unsubscribe notifier on module destroy', async () => {
    const module = Object.create(I18nModule.prototype) as any;
    module.unsubscribe = {
      next: jest.fn(),
      complete: jest.fn(),
    };
    module.loaders = [];

    await module.onModuleDestroy();

    expect(module.unsubscribe.next).toHaveBeenCalledTimes(1);
    expect(module.unsubscribe.complete).toHaveBeenCalledTimes(1);
  });

  describe('when initialized with forRoot', () => {
    let app: INestApplication;
    let loader: any;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [
          I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: { path: path.join(__dirname, 'i18n'), watch: true },
          }),
        ],
      }).compile();

      app = module.createNestApplication();
      await app.init();

      loader = app.get(I18N_LOADERS)[0];
    });

    afterEach(async () => {
      // Manually call onModuleDestroy to avoid Jest open handle error.
      loader.onModuleDestroy();
    });

    it('closes loaders on application close', async () => {
      const spy = jest.spyOn(loader, 'onModuleDestroy');

      await app.close();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('when initialized with forRootAsync', () => {
    let app: INestApplication;
    let loader: any;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [
          I18nModule.forRootAsync({
            useFactory: () => ({
              fallbackLanguage: 'en',
              loaderOptions: {
                path: path.join(__dirname, 'i18n'),
                watch: true,
              },
            }),
            resolvers: [],
          }),
        ],
      }).compile();

      app = module.createNestApplication();
      await app.init();

      loader = app.get(I18N_LOADERS)[0];
    });

    afterEach(async () => {
      // Manually call onModuleDestroy to avoid Jest open handle error.
      loader.onModuleDestroy();
    });

    it('closes loaders on application close', async () => {
      const spy = jest.spyOn(loader, 'onModuleDestroy');

      await app.close();

      expect(spy).toHaveBeenCalled();
    });
  });
});
