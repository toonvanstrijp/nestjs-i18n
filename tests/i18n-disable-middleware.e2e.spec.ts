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

    await app.init();
  });

  it(`should use interceptor`, async () => {
    await request(app.getHttpServer()).get('/hello/guard?lang=nl').expect(500);
  });

  afterAll(async () => {
    await app.close();
  });
});
