import { I18nModule } from '../src/i18n.module';

describe('i18n module configure', () => {
  const createModule = (disableMiddleware = false) => {
    const module = Object.create(I18nModule.prototype) as any;
    module.i18nOptions = { disableMiddleware };
    return module as any;
  };

  it('uses Fastify-safe wildcard route when adapter is Fastify', () => {
    const module = createModule();
    const forRoutes = jest.fn();
    const addHook = jest.fn();

    const consumer = {
      apply: jest.fn().mockReturnValue({ forRoutes }),
      httpAdapter: {
        constructor: { name: 'FastifyAdapter' },
        getInstance: () => ({ addHook }),
      },
    } as any;

    module.configure(consumer);

    expect(forRoutes).toHaveBeenCalledWith('*');
    expect(addHook).toHaveBeenCalledWith('preHandler', expect.any(Function));
  });

  it('uses Express v5-compatible wildcard route when adapter is not Fastify', () => {
    const module = createModule();
    const forRoutes = jest.fn();

    const consumer = {
      apply: jest.fn().mockReturnValue({ forRoutes }),
      httpAdapter: {
        constructor: { name: 'ExpressAdapter' },
        getInstance: () => ({ addHook: jest.fn() }),
      },
    } as any;

    module.configure(consumer);

    expect(forRoutes).toHaveBeenCalledWith('*path');
  });

  it('skips middleware configuration when disableMiddleware is true', () => {
    const module = createModule(true);
    const consumer = {
      apply: jest.fn(),
      httpAdapter: {
        constructor: { name: 'FastifyAdapter' },
        getInstance: () => ({ addHook: jest.fn() }),
      },
    } as any;

    module.configure(consumer);

    expect(consumer.apply).not.toHaveBeenCalled();
  });

  it('sets the resolved language on reply locals for Fastify', async () => {
    const module = createModule();
    module.i18nOptions = { disableMiddleware: false, viewEngine: 'ejs' };
    module.i18n = { t: jest.fn() };

    let preHandler: ((request: any, reply: any) => Promise<void>) | undefined;

    const consumer = {
      apply: jest.fn().mockReturnValue({ forRoutes: jest.fn() }),
      httpAdapter: {
        constructor: { name: 'FastifyAdapter' },
        getInstance: () => ({
          addHook: jest.fn((hook: string, handler: (request: any, reply: any) => Promise<void>) => {
            if (hook === 'preHandler') {
              preHandler = handler;
            }
          }),
        }),
      },
    } as any;

    module.configure(consumer);

    const reply = { locals: {} };
    await preHandler?.({ raw: { i18nLang: 'nl' } }, reply);

    expect(reply.locals).toMatchObject({
      i18nLang: 'nl',
      t: expect.any(Function),
    });
  });
});
