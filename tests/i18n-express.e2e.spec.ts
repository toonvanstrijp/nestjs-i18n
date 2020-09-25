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
} from '../src';
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
          fallbacks: {
            'en-CA': 'fr',
            'en-*': 'en',
            'fr-*': 'fr',
            pt: 'pt-BR',
          },
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

    app = module.createNestApplication();
    await app.init();
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

  it(`/GET hello/short should return english translation when sending "en" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short')
      .set('x-custom-lang', 'en')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/short should return english translation when sending "en-US" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short')
      .set('x-custom-lang', 'en-US')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/short should return french translation when sending "en-CA" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short')
      .set('x-custom-lang', 'en-CA')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/short should return french translation when sending "fr" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short')
      .set('x-custom-lang', 'fr')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/short should return french translation when sending "fr-BE" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short')
      .set('x-custom-lang', 'fr-BE')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/short should return portuguese-brazil translation when sending "pt" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short')
      .set('x-custom-lang', 'pt')
      .expect(200)
      .expect('Olá');
  });

  it(`/GET hello/short should return portuguese-brazil translation when sending "pt-BR" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short')
      .set('x-custom-lang', 'pt-BR')
      .expect(200)
      .expect('Olá');
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

  it(`/GET hello/short/context should return english translation when sending "en" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/context')
      .set('x-custom-lang', 'en')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/short/context should return english translation when sending "en-US" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/context')
      .set('x-custom-lang', 'en-US')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/short/context should return french translation when sending "en-CA" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/context')
      .set('x-custom-lang', 'en-CA')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/short/context should return french translation when sending "fr" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/context')
      .set('x-custom-lang', 'fr')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/short/context should return french translation when sending "fr-BE" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/context')
      .set('x-custom-lang', 'fr-BE')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/short/context should return portuguese-brazil translation when sending "pt" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/context')
      .set('x-custom-lang', 'pt')
      .expect(200)
      .expect('Olá');
  });

  it(`/GET hello/short/context should return portuguese-brazil translation when sending "pt-BR" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/context')
      .set('x-custom-lang', 'pt-BR')
      .expect(200)
      .expect('Olá');
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

  it(`/GET hello/context should return english translation when sending "en" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .set('x-custom-lang', 'en')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/context should return english translation when sending "en-US" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .set('x-custom-lang', 'en-US')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/context should return french translation when sending "en-CA" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .set('x-custom-lang', 'en-CA')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/context should return french translation when sending "fr" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .set('x-custom-lang', 'fr')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/context should return french translation when sending "fr-BE" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .set('x-custom-lang', 'fr-BE')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/context should return portuguese-brazil translation when sending "pt" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .set('x-custom-lang', 'pt')
      .expect(200)
      .expect('Olá');
  });

  it(`/GET hello/context should return portuguese-brazil translation when sending "pt-BR" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .set('x-custom-lang', 'pt-BR')
      .expect(200)
      .expect('Olá');
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

  it(`/GET hello/short/request-scope should return english translation when sending "en" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/request-scope')
      .set('x-custom-lang', 'en')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/short/request-scope should return english translation when sending "en-US" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/request-scope')
      .set('x-custom-lang', 'en-US')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/short/request-scope should return french translation when sending "en-CA" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/request-scope')
      .set('x-custom-lang', 'en-CA')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/short/request-scope should return french translation when sending "fr" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/request-scope')
      .set('x-custom-lang', 'fr')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/short/request-scope should return french translation when sending "fr-BE" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/request-scope')
      .set('x-custom-lang', 'fr-BE')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/short/request-scope should return portuguese-brazil translation when sending "pt" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/request-scope')
      .set('x-custom-lang', 'pt')
      .expect(200)
      .expect('Olá');
  });

  it(`/GET hello/short/request-scope should return portuguese-brazil translation when sending "pt-BR" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/short/request-scope')
      .set('x-custom-lang', 'pt-BR')
      .expect(200)
      .expect('Olá');
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

  it(`/GET hello/request-scope should return english translation when sending "en" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('x-custom-lang', 'en')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/request-scope should return english translation when sending "en-US" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('x-custom-lang', 'en-US')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/request-scope should return french translation when sending "en-CA" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('x-custom-lang', 'en-CA')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/request-scope should return french translation when sending "fr" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('x-custom-lang', 'fr')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/request-scope should return french translation when sending "fr-BE" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('x-custom-lang', 'fr-BE')
      .expect(200)
      .expect('Bonjour');
  });

  it(`/GET hello/request-scope should return portuguese-brazil translation when sending "pt" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('x-custom-lang', 'pt')
      .expect(200)
      .expect('Olá');
  });

  it(`/GET hello/request-scope should return portuguese-brazil translation when sending "pt-BR" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('x-custom-lang', 'pt-BR')
      .expect(200)
      .expect('Olá');
  });

  it('/GET hello/object should return translated object', () => {
    return request(app.getHttpServer())
      .get('/hello/object')
      .expect(200)
      .expect({
        heading: 'Hello, KirillCherkalov',
        title: 'Forgot password',
        followLink: 'Please follow the link to set up your password',
      });
  });

  it('/GET hello/array should return translated array', () => {
    return request(app.getHttpServer())
      .get('/hello/array')
      .expect(200)
      .expect(['ONE', 'TWO', 'THREE']);
  });

  afterAll(async () => {
    await app.close();
  });
});
