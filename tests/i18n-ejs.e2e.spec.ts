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
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'OPTIONS',
      useValue: ['lang', 'locale', 'l'],
    },
  ],
  exports: ['OPTIONS'],
})
export class OptionsModule { }

describe('i18n module e2e ejs', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        OptionsModule,
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
            {
              use: QueryResolver,
              useFactory: (options) => {
                return options;
              },
              inject: ['OPTIONS'],
            },
            new HeaderResolver(['x-custom-lang']),
            new CookieResolver(),
            AcceptLanguageResolver,
          ],
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
          viewEngine: 'ejs',
        }),
      ],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();

    app.setBaseViewsDir(join(__dirname, 'app', 'views/ejs'));
    app.setViewEngine('ejs');

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

  it(`should render page showing invalid key`, async () => {
    await request(app.getHttpServer())
      .get('/hello/index3')
      .expect(200)
      .expect('test.HI');

    await request(app.getHttpServer())
      .get('/hello/index3?l=pt')
      .expect(200)
      .expect('test.HI');

    return request(app.getHttpServer())
      .get('/hello/index3?l=pt-br')
      .expect(200)
      .expect('test.HI');
  });

  afterAll(async () => {
    await app.close();
  });
});
