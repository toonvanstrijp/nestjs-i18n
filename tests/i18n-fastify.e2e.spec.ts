import { Test } from '@nestjs/testing';
import * as path from 'path';
import { I18nModule } from '../lib';
import { INestApplication, Module } from '@nestjs/common';
import * as request from 'supertest';
import { HelloController } from './controllers/hello.controller';
import { QueryResolver } from '../lib/resolvers/query.resolver';
import { HeaderResolver } from '../lib/resolvers/header.resolver';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';

@Module({
  imports: [
    I18nModule.forRoot({
      path: path.join(__dirname, '/i18n/'),
      fallbackLanguage: 'en',
      resolvers: [
        new QueryResolver(['lang', 'locale', 'l']),
        new HeaderResolver(),
      ],
    }),
  ],
  controllers: [HelloController],
})
export class AppModule {}

describe('i18n module e2e', () => {
  let app: INestApplication;

  beforeAll(async done => {
    app = await NestFactory.create(AppModule, new FastifyAdapter());
    app.listen(3333, () => {
      done();
    });
  });

  it(`/GET hello should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello should return right language when using query resolver`, () => {
    return request(app.getHttpServer())
      .get('/hello?lang=nl')
      .expect(200)
      .expect('Hallo')
      .then(() =>
        request(app.getHttpServer())
          .get('/hello?l=nl')
          .expect(200)
          .expect('Hallo'),
      );
  });

  it(`/GET hello should return translation when providing accept-language`, () => {
    return request(app.getHttpServer())
      .get('/hello')
      .set('accept-language', 'nl')
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello should return translation when providing accept-language`, () => {
    return request(app.getHttpServer())
      .get('/hello')
      .set('accept-language', 'nl')
      .expect(200)
      .expect('Hallo');
  });

  afterAll(async () => {
    await app.close();
  });
});
