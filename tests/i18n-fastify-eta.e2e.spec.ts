import { Test } from '@nestjs/testing';
import path from 'path';
import {
  CookieResolver,
  HeaderResolver,
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
} from '../src';
import request from 'supertest';
import { HelloController } from './app/controllers/hello.controller';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { join } from 'path';
import { Eta } from 'eta';

describe('i18n module e2e fastify eta', () => {
  let app: NestFastifyApplication;

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

    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    app.setViewEngine({
      engine: {
        eta: new Eta(),
      },
      templates: join(__dirname, 'app', 'views/eta'),
      viewExt: 'eta',
    });

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('should render translated page', async () => {
    await request(app.getHttpServer()).get('/hello/index').expect(200).expect('Every day');

    await request(app.getHttpServer()).get('/hello/index?l=nl').expect(200).expect('Iedere dag');

    await request(app.getHttpServer()).get('/hello/index2').expect(200).expect('Hello');

    return request(app.getHttpServer()).get('/hello/index2?l=nl').expect(200).expect('Hallo');
  });

  it('should render page showing invalid key', async () => {
    await request(app.getHttpServer()).get('/hello/index3').expect(200).expect('test.HI');

    await request(app.getHttpServer()).get('/hello/index3?l=pt').expect(200).expect('test.HI');

    return request(app.getHttpServer()).get('/hello/index3?l=pt-br').expect(200).expect('test.HI');
  });

  afterAll(async () => {
    await app.close();
  });
});
