import { Test } from '@nestjs/testing';
import * as path from 'path';
import {
  CookieResolver,
  HeaderResolver,
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
  I18nValidationPipe,
  I18nValidationExceptionFilter,
} from '../src';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HelloController } from './app/controllers/hello.controller';
import { CatController } from './app/cats/cat.controller';

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
            fr: 'fr-FR',
            pt: 'pt-BR',
          },
          resolvers: [
            { use: QueryResolver, options: ['lang', 'locale', 'l'] },
            new HeaderResolver(['x-custom-lang']),
            new CookieResolver(),
            AcceptLanguageResolver,
          ],
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
        }),
      ],
      controllers: [HelloController, CatController],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new I18nValidationPipe());
    app.useGlobalFilters(new I18nValidationExceptionFilter());
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

  it(`/GET hello should return translation when providing accept-language with exact match`, () => {
    return request(app.getHttpServer())
      .get('/hello')
      .set('accept-language', 'zh-TW')
      .expect(200)
      .expect('你們好');
  });

  it(`/GET hello should return translation when providing accept-language with loose match`, () => {
    return request(app.getHttpServer())
      .get('/hello')
      .set('accept-language', 'zh-hans')
      .expect(200)
      .expect('你们好');
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

  it(`/GET hello/request-scope should return translation when providing wildcard accept-language`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('accept-language', 'fr-FR')
      .expect(200)
      .expect('Bonjour');
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
      .expect((res) => expect(res.body).toEqual(['ONE', 'TWO', 'THREE']));
  });

  it('/GET hello/plurarization should return correct plural', async () => {
    await request(app.getHttpServer())
      .get('/hello/plurarization?count=0')
      .expect(200)
      .expect('Never');
    await request(app.getHttpServer())
      .get('/hello/plurarization?count=1')
      .expect(200)
      .expect('Every day');
    await request(app.getHttpServer())
      .get('/hello/plurarization?count=2')
      .expect(200)
      .expect('Every 2 days');
    await request(app.getHttpServer())
      .get('/hello/plurarization?count=0')
      .set('x-custom-lang', 'nl')
      .expect(200)
      .expect('Nooit');

    await request(app.getHttpServer())
      .get('/hello/plurarization?count=1')
      .set('x-custom-lang', 'nl')
      .expect(200)
      .expect('Iedere dag');
    await request(app.getHttpServer())
      .get('/hello/plurarization?count=2')
      .set('x-custom-lang', 'nl')
      .expect(200)
      .expect('Iedere 2 dagen');
  });

  it('/GET hello/nested should return correct translation', async () => {
    await request(app.getHttpServer())
      .get('/hello/nested?username=test')
      .expect(200)
      .expect('Message: Hello, test');
    await request(app.getHttpServer())
      .get('/hello/nested?username=test')
      .set('x-custom-lang', 'nl')
      .expect(200)
      .expect('Bericht: Hello, test');
  });

  it('/GET hello/nested-no-args should return the template', async () => {
    await request(app.getHttpServer())
      .get('/hello/nested-no-args')
      .expect(200)
      .expect('We go shopping: $t(test.dot.test)');
    await request(app.getHttpServer())
      .get('/hello/nested-no-args')
      .set('x-custom-lang', 'nl')
      .expect(200)
      .expect('Wij gaan winkelen: $t(test.dot.test)');
  });

  it('/GET hello/deeply-nested should return correct translation', async () => {
    await request(app.getHttpServer())
      .get('/hello/deeply-nested?count=2')
      .expect(200)
      .expect('We go shopping: Every 2 days');
    await request(app.getHttpServer())
      .get('/hello/deeply-nested?count=2')
      .set('x-custom-lang', 'nl')
      .expect(200)
      .expect('Wij gaan winkelen: Iedere 2 dagen');
  });

  it('/GET hello/guard should return correct translation', async () => {
    await request(app.getHttpServer())
      .get('/hello/guard')
      .expect(200)
      .expect((res) =>
        expect(res.headers['x-test']).toBe('Current language: en'),
      );
    await request(app.getHttpServer())
      .get('/hello/guard')
      .set('x-custom-lang', 'nl')
      .expect(200)
      .expect((res) => expect(res.headers['x-test']).toBe('Huidige taal: nl'));
  });

  it('/GET hello/exception should return correct lang', async () => {
    await request(app.getHttpServer())
      .get('/hello/exception')
      .expect(500)
      .expect({ lang: 'en' });
    await request(app.getHttpServer())
      .get('/hello/exception')
      .set('x-custom-lang', 'nl')
      .expect(500)
      .expect({ lang: 'nl' });
  });

  it('/POST cats with age 2 should error', async () => {
    await request(app.getHttpServer())
      .post('/cats')
      .send({ age: 2, name: 'Felix' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Bad Request',
        errors: [
          {
            property: 'age',
            value: 2,
            target: { age: 2, name: 'Felix' },
            children: [],
            constraints: {
              min: 'age with value: "2" needs to be at least 10, ow and COOL',
            },
          },
        ],
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
