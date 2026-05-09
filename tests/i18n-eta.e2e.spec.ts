import path from 'path';
import { join } from 'path';

import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { Eta } from 'eta';
import request from 'supertest';

import {
  CookieResolver,
  HeaderResolver,
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
} from '../src';
import { HelloController } from './app/controllers/hello.controller';

describe('i18n module e2e eta', () => {
  let app: NestExpressApplication;

  function buildEtaEngine(eta: Eta) {
    return (filePath: string, data: object, cb: (err: Error | null, str?: string) => void) => {
      try {
        const fileContent = eta.readFile(filePath);
        const renderedTemplate = eta.renderString(fileContent, data);
        cb(null, renderedTemplate);
      } catch (error) {
        cb(error as Error);
      }
    };
  }

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
          viewEngine: 'eta',
        }),
      ],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();

    const viewsDir = join(__dirname, 'app', 'views/eta');
    const eta = new Eta({ views: viewsDir });

    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.engine('eta', buildEtaEngine(eta));
    expressApp.set('view engine', 'eta');
    expressApp.set('views', viewsDir);

    await app.init();
  });

  it(`should render translated page`, async () => {
    await request(app.getHttpServer()).get('/hello/index').expect(200).expect('Every day');

    await request(app.getHttpServer()).get('/hello/index?l=nl').expect(200).expect('Iedere dag');

    await request(app.getHttpServer()).get('/hello/index2').expect(200).expect('Hello');

    return request(app.getHttpServer()).get('/hello/index2?l=nl').expect(200).expect('Hallo');
  });

  afterAll(async () => {
    await app.close();
  });
});
