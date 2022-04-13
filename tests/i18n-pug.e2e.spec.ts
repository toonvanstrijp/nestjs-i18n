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
import { join } from 'path';

describe('i18n module e2e pug', () => {
  let app: NestExpressApplication;

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
            new QueryResolver(['lang', 'l']),
            new HeaderResolver(['x-custom-lang']),
            new CookieResolver(),
            AcceptLanguageResolver,
          ],
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
          viewEngine: 'pug',
        }),
      ],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();

    app.setBaseViewsDir(join(__dirname, 'app', 'views/pug'));
    app.setViewEngine('pug');

    await app.init();
  });

  it(`should render translated page`, async () => {
    await request(app.getHttpServer())
      .get('/hello/index')
      .expect(200)
      .expect('Every day');

    await request(app.getHttpServer())
      .get('/hello/index?l=nl')
      .expect(200)
      .expect('Iedere dag');

    await request(app.getHttpServer())
      .get('/hello/index2')
      .expect(200)
      .expect('Hello');

    return request(app.getHttpServer())
      .get('/hello/index2?l=nl')
      .expect(200)
      .expect('Hallo');
  });

  afterAll(async () => {
    await app.close();
  });
});
