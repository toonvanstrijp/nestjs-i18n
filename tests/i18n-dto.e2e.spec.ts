import { Test } from '@nestjs/testing';
import * as path from 'path';
import {
  CookieResolver,
  HeaderResolver,
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
} from '../src';
import * as request from 'supertest';
import { HelloController } from './app/controllers/hello.controller';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { i18nValidationErrorFactory } from '../src/utils/util';

describe('i18n module e2e dto', () => {
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
        }),
      ],
      providers: [],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: i18nValidationErrorFactory,
      }),
    );

    await app.init();
  });

  it(`should translate validation messages`, async () => {
    await request(app.getHttpServer())
      .post('/hello/validation')
      .send({
        email: '',
        password: '',
        extra: { subscribeToEmail: '', min: 1, max: 100 },
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect((res) => {
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Bad Request',
          errors: [
            'email is invalid',
            'email cannot be empty',
            'password cannot be empty',
            'extra.subscribeToEmail is not a boolean',
            'extra.min with value: "1" needs to be at least 5, ow and COOL',
            'extra.max with value: "100" needs to be less than 10, ow and SUPER',
          ],
        });
      });

    await request(app.getHttpServer())
      .post('/hello/validation')
      .send({
        test: 'test',
        email: '',
        password: '',
        extra: { subscribeToEmail: '', min: 1, max: 100 },
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect((res) => {
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Bad Request',
          errors: [
            'property test should not exist',
            'email is invalid',
            'email cannot be empty',
            'password cannot be empty',
            'extra.subscribeToEmail is not a boolean',
            'extra.min with value: "1" needs to be at least 5, ow and COOL',
            'extra.max with value: "100" needs to be less than 10, ow and SUPER',
          ],
        });
      });

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
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Bad Request',
          errors: [
            'email is ongeldig',
            'e-mail adres mag niet leeg zijn',
            'wachtwoord mag niet leeg zijn',
            'extra.subscribeToEmail is geen boolean',
            'extra.min met waarde: "1" moet hoger zijn dan 5, ow en COOL',
            'extra.max met waarde: "100" moet lager zijn dan 10, ow en SUPER',
          ],
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
