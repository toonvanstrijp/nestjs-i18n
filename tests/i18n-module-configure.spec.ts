import { I18nModule } from '../src/i18n.module';

describe('i18n module configure', () => {
  const createModule = (disableMiddleware = false) => {
    const module = Object.create(I18nModule.prototype) as any;
    module.i18nOptions = { disableMiddleware };
    return module as { configure: (consumer: any) => void };
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
});
