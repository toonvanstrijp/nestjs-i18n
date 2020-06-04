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
import * as request from 'supertest';

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
    await app.getHttpAdapter().getInstance().ready();
  });

  it(`/GET hello should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET short should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello/short')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello should return right language when using query resolver`, () => {
    return request(app.getHttpServer())
      .get('/hello?lang=nl')
      .expect(200)
      .expect('Hallo')
      .then(() =>
        request(app.getHttpServer())
          .get('/hello?l=nl')
          .expect(200)
          .expect('Hallo'),
      );
  });

  it(`/GET hello should return translation when providing x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello')
      .set('x-custom-lang', 'nl')
      .expect(200)
      .expect('Hallo');
  });
  it(`/GET hello should return translation when providing accept-language`, () => {
    return request(app.getHttpServer())
      .get('/hello')
      .set('accept-language', 'nl-NL,nl;q=0.5')
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello should return translation when providing cookie`, () => {
    return request(app.getHttpServer())
      .get('/hello')
      .set('Cookie', ['lang=nl'])
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello/context should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/short/context should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/context')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/context should return right language when using query resolver`, () => {
    return request(app.getHttpServer())
      .get('/hello/context?lang=nl')
      .expect(200)
      .expect('Hallo')
      .then(() =>
        request(app.getHttpServer())
          .get('/hello/context?l=nl')
          .expect(200)
          .expect('Hallo'),
      );
  });

  it(`/GET hello/context should return translation when providing x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .set('x-custom-lang', 'nl')
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello/context should return translation when providing accept-language`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .set('accept-language', 'nl-NL,nl;q=0.5')
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello/context should return translation when providing cookie`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .set('Cookie', ['lang=nl'])
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello/request-scope should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/short/request-scope should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/request-scope')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/request-scope should return right language when using query resolver`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope?lang=nl')
      .expect(200)
      .expect('Hallo')
      .then(() =>
        request(app.getHttpServer())
          .get('/hello/request-scope?l=nl')
          .expect(200)
          .expect('Hallo'),
      );
  });

  it(`/GET hello/request-scope should return translation when providing x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('x-custom-lang', 'nl')
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello/request-scope should return translation when providing accept-language`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('accept-language', 'nl-NL,nl;q=0.5')
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello/request-scope should return translation when providing cookie`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('Cookie', ['lang=nl'])
      .expect(200)
      .expect('Hallo');
  });
  afterAll(async () => {
    await app.close();
  });
});
