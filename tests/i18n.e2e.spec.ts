import { Test } from '@nestjs/testing';
import * as path from 'path';
import * as request from 'supertest';
import * as fs from 'fs';
import { I18nModule, QueryResolver} from '../lib';
import { INestApplication } from '@nestjs/common';
import { HelloController } from './controllers/hello.controller';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('i18n module e2e', () => {
  let appExpress: INestApplication;
  let appFastify: NestFastifyApplication;

  beforeAll(async () => {
    const createTestModule = async () => {
      return await Test.createTestingModule({
        imports: [
          I18nModule.forRoot({
            path: path.join(__dirname, '/i18n/'),
            fallbackLanguage: 'en',
            resolvers: [new QueryResolver(['lang', 'locale', 'l'])],
          }),
        ],
        controllers: [HelloController],
      }).compile();
    };

    appExpress = (await createTestModule()).createNestApplication();
    appFastify = (await createTestModule()).createNestApplication(new FastifyAdapter(
      {
        http2: true,
        https: {
          allowHTTP1: true, // fallback support for HTTP1
          key: fs.readFileSync(path.join(__dirname, '/certs/server.key')),
          cert: fs.readFileSync(path.join(__dirname, '/certs/server.crt')),
          enableTrace: true,
        },
      },
    ));

    await appExpress.init();
    await appFastify.init();
  });
  describe('Express APP',()=> {
    it(`/GET hello should return translation`, async () => {
      await request(appExpress.getHttpServer())
        .get('/hello')
        .expect(200)
        .expect('Hello');
    });

    it(`/GET hello should return right language when using query resolver`, async () => {
      await request(appExpress.getHttpServer())
        .get('/hello?lang=nl')
        .expect(200)
        .expect('Hallo');

      await request(appExpress.getHttpServer())
        .get('/hello?l=nl')
        .expect(200)
        .expect('Hallo');
    });
  });

  describe('Fastify APP', () => {
    it(`/GET hello should return translation`, async () => {
      expect((await appFastify
        .inject({
          method: 'GET',
          url: '/hello',
        })).payload).toBe('Hello');
    });

    it(`/GET hello should return right language when using query resolver`, async () => {
      expect((await appFastify
        .inject({
          method: 'GET',
          url: '/hello',
          query: {
            lang: 'nl',
          },
        })).payload).toBe('Hallo');

      expect((await appFastify
        .inject({
          method: 'GET',
          url: '/hello?l=nl',
        })).payload).toBe('Hallo');
    });
  });

  afterAll(async () => {
    await appExpress.close();
    await appFastify.close();
  });
});
