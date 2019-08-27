import { Test } from '@nestjs/testing';
import * as path from 'path';
import { HeaderResolver, I18nModule, QueryResolver } from '../src/lib';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HelloController } from './app/controllers/hello.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { CatModule } from './app/cats/cat.module';

describe('i18n module e2e graphql', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          path: path.join(__dirname, '/i18n/'),
          fallbackLanguage: 'en',
          saveMissing: false,
          resolvers: [new HeaderResolver()],
        }),
        GraphQLModule.forRoot({
          typePaths: ['*/**/*.graphql'],
          context: ({ req }) => ({ req }),
          path: '/graphql',
        }),
        CatModule,
      ],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`should query a particular cat in NL`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('accept-language', 'nl')
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Kat',
          },
        },
      });
  });

  it(`should query a particular cat in EN`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('accept-language', 'en')
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Cat',
          },
        },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
