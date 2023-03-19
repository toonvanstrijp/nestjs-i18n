import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import * as path from 'path';
import * as request from 'supertest';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
  I18nValidationPipe,
} from '../src';
import { HelloController } from './app/controllers/hello.controller';

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
      new I18nValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validateCustomDecorators: true,
      }),
    );

    await app.init();
  });

  it(`should translate validation messages in a custom format if specified`, async () => {
    await request(app.getHttpServer())
      .post('/hello/validation-custom-formatter')
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
          message: {
            error: 'Bad Request',
            message: [
              {
                children: [],
                constraints: {
                  isEmail: 'email is invalid',
                  isNotEmpty: 'email cannot be empty',
                },
                property: 'email',
              },
              {
                children: [],
                constraints: {
                  isNotEmpty: 'password cannot be empty',
                },
                property: 'password',
              },
              {
                children: [
                  {
                    children: [],
                    constraints: {
                      isBoolean: 'subscribeToEmail is not a boolean',
                    },
                    property: 'subscribeToEmail',
                  },
                  {
                    children: [],
                    constraints: {
                      min: 'min with value: "1" needs to be at least 5, ow and COOL',
                    },
                    property: 'min',
                  },
                  {
                    children: [],
                    constraints: {
                      max: 'max with value: "100" needs to be less than 10, ow and SUPER',
                    },
                    property: 'max',
                  },
                ],
                constraints: {},
                property: 'extra',
              },
            ],
            statusCode: 400,
          },
          errors: {
            email: ['email is invalid', 'email cannot be empty'],
            password: ['password cannot be empty'],
            subscribeToEmail: ['extra.subscribeToEmail is not a boolean'],
            min: [
              'extra.min with value: "1" needs to be at least 5, ow and COOL',
            ],
            max: [
              'extra.max with value: "100" needs to be less than 10, ow and SUPER',
            ],
          },
        });
      });

    await request(app.getHttpServer())
      .post('/hello/validation-custom-formatter')
      .send({
        test: '',
        email: '',
        password: '',
        extra: { subscribeToEmail: '', min: 1, max: 100 },
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect((res) => {
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: {
            error: 'Bad Request',
            message: [
              {
                children: [],
                constraints: {
                  whitelistValidation: 'property test should not exist',
                },
                property: 'test',
              },
              {
                children: [],
                constraints: {
                  isEmail: 'email is invalid',
                  isNotEmpty: 'email cannot be empty',
                },
                property: 'email',
              },
              {
                children: [],
                constraints: {
                  isNotEmpty: 'password cannot be empty',
                },
                property: 'password',
              },
              {
                children: [
                  {
                    children: [],
                    constraints: {
                      isBoolean: 'subscribeToEmail is not a boolean',
                    },
                    property: 'subscribeToEmail',
                  },
                  {
                    children: [],
                    constraints: {
                      min: 'min with value: "1" needs to be at least 5, ow and COOL',
                    },
                    property: 'min',
                  },
                  {
                    children: [],
                    constraints: {
                      max: 'max with value: "100" needs to be less than 10, ow and SUPER',
                    },
                    property: 'max',
                  },
                ],
                constraints: {},
                property: 'extra',
              },
            ],
            statusCode: 400,
          },
          errors: {
            test: ['property test should not exist'],
            email: ['email is invalid', 'email cannot be empty'],
            password: ['password cannot be empty'],
            subscribeToEmail: ['extra.subscribeToEmail is not a boolean'],
            min: [
              'extra.min with value: "1" needs to be at least 5, ow and COOL',
            ],
            max: [
              'extra.max with value: "100" needs to be less than 10, ow and SUPER',
            ],
          },
        });
      });

    return request(app.getHttpServer())
      .post('/hello/validation-custom-formatter?l=nl')
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
          message: {
            error: 'Bad Request',
            message: [
              {
                children: [],
                constraints: {
                  isEmail: 'email is ongeldig',
                  isNotEmpty: 'e-mail adres mag niet leeg zijn',
                },
                property: 'email',
              },
              {
                children: [],
                constraints: {
                  isNotEmpty: 'wachtwoord mag niet leeg zijn',
                },
                property: 'password',
              },
              {
                children: [
                  {
                    children: [],
                    constraints: {
                      isBoolean: 'subscribeToEmail is geen boolean',
                    },
                    property: 'subscribeToEmail',
                  },
                  {
                    children: [],
                    constraints: {
                      min: 'min met waarde: "1" moet hoger zijn dan 5, ow en COOL',
                    },
                    property: 'min',
                  },
                  {
                    children: [],
                    constraints: {
                      max: 'max met waarde: "100" moet lager zijn dan 10, ow en SUPER',
                    },
                    property: 'max',
                  },
                ],
                constraints: {},
                property: 'extra',
              },
            ],
            statusCode: 400,
          },
          errors: {
            email: ['email is ongeldig', 'e-mail adres mag niet leeg zijn'],
            password: ['wachtwoord mag niet leeg zijn'],
            subscribeToEmail: ['extra.subscribeToEmail is geen boolean'],
            min: [
              'extra.min met waarde: "1" moet hoger zijn dan 5, ow en COOL',
            ],
            max: [
              'extra.max met waarde: "100" moet lager zijn dan 10, ow en SUPER',
            ],
          },
        });
      });
  });

  it(`should translate validation messages without detailed errors`, async () => {
    await request(app.getHttpServer())
      .post('/hello/validation-without-details')
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
          message: {
            error: 'Bad Request',
            message: [
              {
                children: [],
                constraints: {
                  isEmail: 'email is invalid',
                  isNotEmpty: 'email cannot be empty',
                },
                property: 'email',
              },
              {
                children: [],
                constraints: {
                  isNotEmpty: 'password cannot be empty',
                },
                property: 'password',
              },
              {
                children: [
                  {
                    children: [],
                    constraints: {
                      isBoolean: 'subscribeToEmail is not a boolean',
                    },
                    property: 'subscribeToEmail',
                  },
                  {
                    children: [],
                    constraints: {
                      min: 'min with value: "1" needs to be at least 5, ow and COOL',
                    },
                    property: 'min',
                  },
                  {
                    children: [],
                    constraints: {
                      max: 'max with value: "100" needs to be less than 10, ow and SUPER',
                    },
                    property: 'max',
                  },
                ],
                constraints: {},
                property: 'extra',
              },
            ],
            statusCode: 400,
          },
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
      .post('/hello/validation-without-details')
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
          message: {
            error: 'Bad Request',
            message: [
              {
                children: [],
                constraints: {
                  whitelistValidation: 'property test should not exist',
                },
                property: 'test',
              },
              {
                children: [],
                constraints: {
                  isEmail: 'email is invalid',
                  isNotEmpty: 'email cannot be empty',
                },
                property: 'email',
              },
              {
                children: [],
                constraints: {
                  isNotEmpty: 'password cannot be empty',
                },
                property: 'password',
              },
              {
                children: [
                  {
                    children: [],
                    constraints: {
                      isBoolean: 'subscribeToEmail is not a boolean',
                    },
                    property: 'subscribeToEmail',
                  },
                  {
                    children: [],
                    constraints: {
                      min: 'min with value: "1" needs to be at least 5, ow and COOL',
                    },
                    property: 'min',
                  },
                  {
                    children: [],
                    constraints: {
                      max: 'max with value: "100" needs to be less than 10, ow and SUPER',
                    },
                    property: 'max',
                  },
                ],
                constraints: {},
                property: 'extra',
              },
            ],
          },
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
      .post('/hello/validation-without-details?l=nl')
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
          message: {
            error: 'Bad Request',
            message: [
              {
                children: [],
                constraints: {
                  isEmail: 'email is ongeldig',
                  isNotEmpty: 'e-mail adres mag niet leeg zijn',
                },
                property: 'email',
              },
              {
                children: [],
                constraints: {
                  isNotEmpty: 'wachtwoord mag niet leeg zijn',
                },
                property: 'password',
              },
              {
                children: [
                  {
                    children: [],
                    constraints: {
                      isBoolean: 'subscribeToEmail is geen boolean',
                    },
                    property: 'subscribeToEmail',
                  },
                  {
                    children: [],
                    constraints: {
                      min: 'min met waarde: "1" moet hoger zijn dan 5, ow en COOL',
                    },
                    property: 'min',
                  },
                  {
                    children: [],
                    constraints: {
                      max: 'max met waarde: "100" moet lager zijn dan 10, ow en SUPER',
                    },
                    property: 'max',
                  },
                ],
                constraints: {},
                property: 'extra',
              },
            ],
          },
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

  it(`should translate validation messages with detailed error`, async () => {
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
          errors: [
            {
              children: [],
              constraints: {
                whitelistValidation: 'property test should not exist',
              },
              property: 'test',
            },
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

  it('should accept input with pipe characters', async () => {
    await request(app.getHttpServer())
      .post('/hello/validation-without-details')
      .send({
        email: 'example|||',
        password: '',
        extra: { subscribeToEmail: '', min: 1, max: 100 },
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect((res) => {
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: {
            error: 'Bad Request',
            message: [
              {
                children: [],
                constraints: {
                  isEmail: 'email is invalid',
                },
                property: 'email',
              },
              {
                children: [],
                constraints: {
                  isNotEmpty: 'password cannot be empty',
                },
                property: 'password',
              },
              {
                children: [
                  {
                    children: [],
                    constraints: {
                      isBoolean: 'subscribeToEmail is not a boolean',
                    },
                    property: 'subscribeToEmail',
                  },
                  {
                    children: [],
                    constraints: {
                      min: 'min with value: "1" needs to be at least 5, ow and COOL',
                    },
                    property: 'min',
                  },
                  {
                    children: [],
                    constraints: {
                      max: 'max with value: "100" needs to be less than 10, ow and SUPER',
                    },
                    property: 'max',
                  },
                ],
                constraints: {},
                property: 'extra',
              },
            ],
            statusCode: 400,
          },
          errors: [
            'email is invalid',
            'password cannot be empty',
            'extra.subscribeToEmail is not a boolean',
            'extra.min with value: "1" needs to be at least 5, ow and COOL',
            'extra.max with value: "100" needs to be less than 10, ow and SUPER',
          ],
        });
      });
  });

  it(`should translate validation messages with custom http code`, async () => {
    await request(app.getHttpServer())
      .post('/hello/validation-with-custom-http-code')
      .send({
        email: '',
        password: '',
        extra: { subscribeToEmail: '', min: 1, max: 100 },
      })
      .set('Accept', 'application/json')
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({
          statusCode: 422,
          message: {
            error: 'Bad Request',
            message: [
              {
                children: [],
                constraints: {
                  isEmail: 'email is invalid',
                  isNotEmpty: 'email cannot be empty',
                },
                property: 'email',
              },
              {
                children: [],
                constraints: {
                  isNotEmpty: 'password cannot be empty',
                },
                property: 'password',
              },
              {
                children: [
                  {
                    children: [],
                    constraints: {
                      isBoolean: 'subscribeToEmail is not a boolean',
                    },
                    property: 'subscribeToEmail',
                  },
                  {
                    children: [],
                    constraints: {
                      min: 'min with value: "1" needs to be at least 5, ow and COOL',
                    },
                    property: 'min',
                  },
                  {
                    children: [],
                    constraints: {
                      max: 'max with value: "100" needs to be less than 10, ow and SUPER',
                    },
                    property: 'max',
                  },
                ],
                constraints: {},
                property: 'extra',
              },
            ],
            statusCode: 400,
          },
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
  });

  it(`should translate validation messages when doing a manual validation`, async () => {
    await request(app.getHttpServer())
      .post('/hello/custom-validation')
      .send({
        email: '',
        password: '',
        extra: { subscribeToEmail: '', min: 1, max: 100 },
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject([
          {
            target: {},
            property: 'email',
            children: [],
            constraints: {
              isEmail: 'email is invalid',
              isNotEmpty: 'email cannot be empty',
            },
          },
          {
            target: {},
            property: 'password',
            children: [],
            constraints: { isNotEmpty: 'password cannot be empty' },
          },
          {
            target: {},
            property: 'extra',
            children: [],
            constraints: { isDefined: 'extra should not be null or undefined' },
          },
        ]);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
