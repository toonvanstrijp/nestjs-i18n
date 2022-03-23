import { Test } from '@nestjs/testing';
import * as path from 'path';
import {
  CookieResolver,
  HeaderResolver,
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
  I18nJsonParser,
  I18nService,
} from '../src';
import * as request from 'supertest';
import { HelloController } from './app/controllers/hello.controller';
import {
  NestExpressApplication,
} from '@nestjs/platform-express';
import { join } from 'path';
import * as Handlebars from 'hbs';

describe('i18n module e2e hbs', () => {
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
            'fr': 'fr-FR',
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

    app = module.createNestApplication<NestExpressApplication>();

    var i18nService = app.get(I18nService);
    Handlebars.registerHelper('i18n', function (object, propertyName, options) {
      return i18nService.t(propertyName);
    });

    app.setBaseViewsDir(join(__dirname, 'app', 'views'));
    app.setViewEngine('hbs');

    await app.init();
  });

  it(`should render translated page`, async () => {
    return request(app.getHttpServer())
      .get('/hello/index')
      .expect(200)
      .expect('Hello');
  })
  
  afterAll(async () => {
    await app.close();
  });
});
