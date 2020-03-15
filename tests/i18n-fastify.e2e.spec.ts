import * as path from 'path';
import {
  CookieResolver,
  HeaderResolver,
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
  I18nJsonParser,
} from '../src/lib';
import { HelloController } from './app/controllers/hello.controller';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';

describe('i18n module e2e fastify', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const adapter = new FastifyAdapter();
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          resolvers: [
            { use: QueryResolver, options: ['lang', 'locale', 'l'] },
            new HeaderResolver(['x-custom-lang']),
            new CookieResolver(),
            AcceptLanguageResolver,
          ],
          parser: I18nJsonParser,
          parserOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
        }),
      ],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication<NestFastifyApplication>(adapter);

    await app.init();
  });

  it(`/GET hello should return translation`, () => {
    return app
      .inject({
        url: '/hello',
        method: 'GET',
      })
      .then(({ payload }) => expect(payload).toBe('Hello'));
  });

  it(`/GET hello should return right language when using query resolver`, () => {
    return app
      .inject({
        url: '/hello?lang=nl',
        method: 'GET',
        query: { lang: 'nl' },
      })
      .then(({ payload }) => {
        expect(payload).toBe('Hallo');
        return app
          .inject({
            url: '/hello?l=nl',
            method: 'GET',
          })
          .then(({ payload }) => expect(payload).toBe('Hallo'));
      });
  });

  it(`/GET hello should return translation when providing x-custom-lang`, () => {
    return app
      .inject({
        url: '/hello',
        method: 'GET',
        headers: {
          'x-custom-lang': 'nl',
        },
      })
      .then(({ payload }) => expect(payload).toBe('Hallo'));
  });

  it(`/GET hello should return translation when providing accept-language`, () => {
    return app
      .inject({
        url: '/hello',
        method: 'GET',
        headers: {
          'accept-language': 'nl-NL,nl;q=0.5',
        },
      })
      .then(({ payload }) => expect(payload).toBe('Hallo'));
  });

  it(`/GET hello should return translation when providing cookie`, () => {
    return app
      .inject({
        url: '/hello',
        method: 'GET',
        headers: {
          cookie: 'lang=nl',
        },
      })
      .then(({ payload }) => expect(payload).toBe('Hallo'));
  });

  it(`/GET hello/context should return translation`, () => {
    return app
      .inject({
        url: '/hello/context',
        method: 'GET',
      })
      .then(({ payload }) => expect(payload).toBe('Hello'));
  });

  it(`/GET hello/context should return right language when using query resolver`, () => {
    return app
      .inject({
        url: '/hello/context?lang=nl',
        method: 'GET',
        query: { lang: 'nl' },
      })
      .then(({ payload }) => {
        expect(payload).toBe('Hallo');
        return app
          .inject({
            url: '/hello/context?l=nl',
            method: 'GET',
          })
          .then(({ payload }) => expect(payload).toBe('Hallo'));
      });
  });

  it(`/GET hello/context should return translation when providing x-custom-lang`, () => {
    return app
      .inject({
        url: '/hello/context',
        method: 'GET',
        headers: {
          'x-custom-lang': 'nl',
        },
      })
      .then(({ payload }) => expect(payload).toBe('Hallo'));
  });
  it(`/GET hello/context should return translation when providing accept-language`, () => {
    return app
      .inject({
        url: '/hello/context',
        method: 'GET',
        headers: {
          'accept-language': 'nl-NL,nl;q=0.5',
        },
      })
      .then(({ payload }) => expect(payload).toBe('Hallo'));
  });

  it(`/GET hello/context should return translation when providing cookie`, () => {
    return app
      .inject({
        url: '/hello/context',
        method: 'GET',
        headers: {
          cookie: 'lang=nl',
        },
      })
      .then(({ payload }) => expect(payload).toBe('Hallo'));
  });

  it(`/GET hello/request-scope should return translation`, () => {
    return app
      .inject({
        url: '/hello/request-scope',
        method: 'GET',
      })
      .then(({ payload }) => expect(payload).toBe('Hello'));
  });

  it(`/GET hello/request-scope should return right language when using query resolver`, () => {
    return app
      .inject({
        url: '/hello/request-scope?lang=nl',
        method: 'GET',
        query: { lang: 'nl' },
      })
      .then(({ payload }) => {
        expect(payload).toBe('Hallo');
        return app
          .inject({
            url: '/hello/request-scope?l=nl',
            method: 'GET',
          })
          .then(({ payload }) => expect(payload).toBe('Hallo'));
      });
  });

  it(`/GET hello/request-scope should return translation when providing x-custom-lang`, () => {
    return app
      .inject({
        url: '/hello/request-scope',
        method: 'GET',
        headers: {
          'x-custom-lang': 'nl',
        },
      })
      .then(({ payload }) => expect(payload).toBe('Hallo'));
  });

  it(`/GET hello/request-scope should return translation when providing accept-language`, () => {
    return app
      .inject({
        url: '/hello/request-scope',
        method: 'GET',
        headers: {
          'accept-language': 'nl-NL,nl;q=0.5',
        },
      })
      .then(({ payload }) => expect(payload).toBe('Hallo'));
  });

  it(`/GET hello/request-scope should return translation when providing cookie`, () => {
    return app
      .inject({
        url: '/hello/request-scope',
        method: 'GET',
        headers: {
          cookie: 'lang=nl',
        },
      })
      .then(({ payload }) => expect(payload).toBe('Hallo'));
  });

  afterAll(async () => {
    await app.close();
  });
});
