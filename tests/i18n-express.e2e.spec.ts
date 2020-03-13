import { Test } from '@nestjs/testing';
import * as path from 'path';
import {
  CookieResolver,
  HeaderResolver,
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
  I18nJsonParser,
  I18nJsonParserOptions,
} from '../src/lib';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HelloController } from './app/controllers/hello.controller';

describe('i18n module e2e express', () => {
  let app: INestApplication;

  beforeAll(async () => {
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
          parser: {
            class: I18nJsonParser,
            options: {
              path: path.join(__dirname, '/i18n/'),
            },
          },
        }),
      ],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`/GET hello should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello')
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
