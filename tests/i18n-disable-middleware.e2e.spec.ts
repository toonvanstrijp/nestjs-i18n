import { Test } from '@nestjs/testing';
import path from 'path';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver,
} from '../src';
import request from 'supertest';
import { HelloController } from './app/controllers/hello.controller';
import { NestExpressApplication } from '@nestjs/platform-express';

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
          loaders: [
            new I18nJsonLoader({
              path: path.join(__dirname, '/i18n/'),
            }),
          ],
          disableMiddleware: true,
        }),
      ],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();

    await app.init();
  });

  it(`should use interceptor`, async () => {
    await request(app.getHttpServer()).get('/hello/guard?lang=nl').expect(500);
  });

  it(`/GET hello/request-scope/additional-interceptor should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope/additional-interceptor')
      .set('accept-language', 'fr-FR')
      .expect(200)
      .expect('Bonjour');
  });

  afterAll(async () => {
    await app.close();
  });
});
