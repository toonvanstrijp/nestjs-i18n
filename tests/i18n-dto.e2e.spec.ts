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
        exceptionFactory: i18nValidationErrorFactory,
      }),
    );

    await app.init();
  });
  var toon = {
    statusCode: 400,
    errors: [
      {
        property: 'email',
        children: [],
        constraints: {
          isEmail: 'email is invalid',
          isNotEmpty: 'email cannot be empty',
        },
      },
      {
        property: 'password',
        children: [],
        constraints: { isNotEmpty: 'password cannot be empty' },
      },
      {
        property: 'extra',
        children: [
          {
            property: 'subscribeToEmail',
            children: [],
            constraints: {
              isBoolean: 'subscribeToEmail is not a boolean',
            },
          },
          {
            property: 'min',
            children: [],
            constraints: {
              min: 'min with value: "1" needs to be at least 5, ow and COOL',
            },
          },
          {
            property: 'max',
            children: [],
            constraints: {
              max: 'max with value: "100" needs to be less than 10, ow and SUPER',
            },
          },
        ],
        constraints: {},
      },
    ],
  };
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
          errors: [
            {
              property: 'email',
              children: [],
              constraints: {
                isEmail: 'email is invalid',
                isNotEmpty: 'email cannot be empty',
              },
            },
            {
              property: 'password',
              children: [],
              constraints: { isNotEmpty: 'password cannot be empty' },
            },
            {
              property: 'extra',
              children: [
                {
                  property: 'subscribeToEmail',
                  children: [],
                  constraints: {
                    isBoolean: 'subscribeToEmail is not a boolean',
                  },
                },
                {
                  property: 'min',
                  children: [],
                  constraints: {
                    min: 'min with value: "1" needs to be at least 5, ow and COOL',
                  },
                },
                {
                  property: 'max',
                  children: [],
                  constraints: {
                    max: 'max with value: "100" needs to be less than 10, ow and SUPER',
                  },
                },
              ],
              constraints: {},
            },
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
          errors: [
            {
              property: 'email',
              children: [],
              constraints: {
                isEmail: 'email is ongeldig',
                isNotEmpty: 'e-mail adres mag niet leeg zijn',
              },
            },
            {
              property: 'password',
              children: [],
              constraints: { isNotEmpty: 'wachtwoord mag niet leeg zijn' },
            },
            {
              property: 'extra',
              children: [
                {
                  property: 'subscribeToEmail',
                  children: [],
                  constraints: {
                    isBoolean: 'subscribeToEmail is geen boolean',
                  },
                },
                {
                  property: 'min',
                  children: [],
                  constraints: {
                    min: 'min met waarde: "1" moet hoger zijn dan 5, ow en COOL',
                  },
                },
                {
                  property: 'max',
                  children: [],
                  constraints: {
                    max: 'max met waarde: "100" moet lager zijn dan 10, ow en SUPER',
                  },
                },
              ],
              constraints: {},
            },
          ],
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
