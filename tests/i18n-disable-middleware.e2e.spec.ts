import path from 'path';

import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import {
  CookieResolver,
  HeaderResolver,
  AcceptLanguageResolver,
  I18nModule,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
  QueryResolver,
} from '../src';
import { HelloController } from './app/controllers/hello.controller';

describe('i18n module e2e no middleware', () => {
  let app: NestExpressApplication;

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
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
          disableMiddleware: true,
        }),
      ],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();

    app.useGlobalPipes(new I18nValidationPipe({ transform: true }));
    app.useGlobalFilters(new I18nValidationExceptionFilter());

    await app.init();
  });

  it(`guard should run before interceptor context`, async () => {
    await request(app.getHttpServer())
      .get('/hello/guard?lang=nl')
      .expect(200)
      .expect((res) => expect(res.headers['x-test']).toBe(''));
  });

  it(`/GET hello/request-scope/additional-interceptor should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope/additional-interceptor')
      .set('accept-language', 'fr-FR')
      .expect(200)
      .expect('Bonjour');
  });

  // #528: I18nContext.current() must be available without the middleware
  it(`/GET hello/request-scope should resolve context without middleware`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope?lang=nl')
      .expect(200)
      .expect('Hallo');
  });

  // #606: I18nValidationExceptionFilter must find the i18n context without the middleware
  it(`/POST hello/validation should translate validation errors without middleware`, () => {
    return request(app.getHttpServer())
      .post('/hello/validation?l=nl')
      .send({
        email: '',
        password: '',
        extra: { subscribeToEmail: '', min: 1, max: 100 },
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect((res) => {
        expect(res.body.statusCode).toBe(400);
        expect(res.body.message).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              property: 'email',
              constraints: {
                isEmail: 'email is ongeldig',
                isNotEmpty: 'e-mail adres mag niet leeg zijn',
              },
            }),
            expect.objectContaining({
              property: 'password',
              constraints: { isNotEmpty: 'wachtwoord mag niet leeg zijn' },
            }),
          ]),
        );
      });
  });

  it(`/POST hello/custom-validation should translate errors via i18n.validate without middleware`, () => {
    return request(app.getHttpServer())
      .post('/hello/custom-validation?l=nl')
      .send({})
      .set('Accept', 'application/json')
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              property: 'email',
              constraints: {
                isEmail: 'email is ongeldig',
                isNotEmpty: 'e-mail adres mag niet leeg zijn',
              },
            }),
          ]),
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
