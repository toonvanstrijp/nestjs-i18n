import { I18nModule, logger } from '../src/i18n.module';

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

  it('emits unsubscribe notifier on module destroy', () => {
    const module = Object.create(I18nModule.prototype) as any;
    module.unsubscribe = {
      next: jest.fn(),
      complete: jest.fn(),
    };

    module.onModuleDestroy();

    expect(module.unsubscribe.next).toHaveBeenCalledTimes(1);
    expect(module.unsubscribe.complete).toHaveBeenCalledTimes(1);
  });
});
