import { Test } from '@nestjs/testing';
import * as path from 'path';
import {
  CookieResolver,
  HeaderResolver,
  I18nModule,
  GraphQLWebsocketResolver,
  AcceptLanguageResolver,
  I18nValidationPipe,
} from '../src';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HelloController } from './app/controllers/hello.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CatModule } from './app/cats/cat.module';
import { createClient } from 'graphql-ws';
import ApolloClient from 'apollo-client';
import * as WebSocket from 'ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';

describe('i18n module e2e graphql', () => {
  let app: INestApplication;

  let apollo: ApolloClient<NormalizedCacheObject>;
  let apolloOldWebsocket: ApolloClient<NormalizedCacheObject>;
  let oldSubscriptionClient: SubscriptionClient;
  let subscriptionClient: ReturnType<typeof createClient>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          fallbacks: {
            'en-CA': 'fr',
            'en-*': 'en',
            'fr-*': 'fr',
            pt: 'pt-BR',
          },
          resolvers: [
            new GraphQLWebsocketResolver(),
            new HeaderResolver(['x-custom-lang']),
            new AcceptLanguageResolver(),
            new CookieResolver(),
          ],
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          subscriptions: {
            'graphql-ws': true,
            'subscriptions-transport-ws': {
              onConnect: (params) => ({ connectionParams: params }),
              path: '/graphql',
            },
          },
          typePaths: ['*/**/*.graphql'],
          context: (ctx) => ctx,
          path: '/graphql',
        }),
        CatModule,
      ],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(new I18nValidationPipe());

    await app.listen(3000);

    subscriptionClient = createClient({
      url: 'ws://localhost:3000/graphql',
      webSocketImpl: WebSocket,
      connectionParams: { lang: 'fr' },
    });
    oldSubscriptionClient = new SubscriptionClient(
      'ws://localhost:3000/graphql',
      {
        reconnect: true,
        connectionParams: { lang: 'fr' },
      },
      WebSocket,
    );
    apollo = new ApolloClient({
      link: new GraphQLWsLink(subscriptionClient) as any,
      cache: new InMemoryCache(),
    });
    apolloOldWebsocket = new ApolloClient({
      link: new WebSocketLink(oldSubscriptionClient) as any,
      cache: new InMemoryCache(),
    });
  });

  it(`should subscribe to catAdded and return cat name with "fr" placeholder`, async () => {
    var count = 0;
    apollo
      .subscribe({
        query: gql`
          subscription catAdded {
            catAdded
          }
        `,
      })
      .subscribe({
        next: (catText) => {
          count++;
          expect(catText).toEqual({ data: { catAdded: 'Chat: Haya' } });
        },
        error: (error) => {
          throw error;
        },
      });

    apolloOldWebsocket
      .subscribe({
        query: gql`
          subscription catAdded {
            catAdded
          }
        `,
      })
      .subscribe({
        next: (catText) => {
          count++;
          expect(catText).toEqual({ data: { catAdded: 'Chat: Haya' } });
        },
        error: (error) => {
          throw error;
        },
      });

    // wait for subscription
    await new Promise<void>((resolve) => setTimeout(resolve, 500));

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query:
          'mutation {  createCat(createCatInput: {name: "Haya", age: 10})  { name, age }  }',
      })
      .expect(200, {
        data: {
          createCat: {
            name: 'Haya',
            age: 10,
          },
        },
      });

    return new Promise<void>((resolve) =>
      setTimeout(() => {
        expect(count).toEqual(2);
        resolve();
      }, 500),
    );
  });

  it(`should query a particular cat in NL`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'nl')
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

  it(`should query a particular cat (using @I18nContext) in NL`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'nl')
      .send({
        operationName: null,
        variables: {},
        query: '{catUsingContext(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          catUsingContext: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Kat',
          },
        },
      });
  });

  it(`should query a particular cat in EN with cookie`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Cookie', ['lang=en'])
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

  it(`should query a particular cat in NL with cookie`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Cookie', ['lang=nl'])
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

  it(`should query a particular cat in EN when not providing x-custom-lang`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
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

  it(`should query a particular cat in EN`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'en')
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

  it(`should query a particular cat in EN when sending "en-US" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'en-US')
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

  it(`should query a particular cat in FR when sending "en-CA" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'en-CA')
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
            description: 'Chat',
          },
        },
      });
  });

  it(`should query a particular cat in FR`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'fr')
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
            description: 'Chat',
          },
        },
      });
  });

  it(`should query a particular cat in FR when sending "fr-BE" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'fr-BE')
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
            description: 'Chat',
          },
        },
      });
  });

  it(`should query a particular cat in PT-BR`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'pt-BR')
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
            description: 'Gato',
          },
        },
      });
  });

  it(`should query a particular cat in PT-BR when sending "pt" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'pt')
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
            description: 'Gato',
          },
        },
      });
  });

  it(`graphl validation`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query:
          'mutation {  validation(createCatInput: {name: "Haya", age: 2})  { name, age }  }',
      })
      .expect(200, {
        errors: [
          {
            message: 'Bad Request',
            locations: [
              {
                line: 1,
                column: 13,
              },
            ],
            path: ['validation'],
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              exception: {
                response: 'Bad Request',
                status: 400,
                message: 'Bad Request',
                name: 'I18nValidationException',
                errors: [
                  {
                    property: 'age',
                    value: 2,
                    children: [],
                    target: { name: 'Haya', age: 2 },
                    constraints: {
                      min: 'age with value: "2" needs to be at least 10, ow and COOL',
                    },
                  },
                ],
              },
            },
          },
        ],
        data: {
          validation: null,
        },
      });
  });

  afterAll(async () => {
    apollo.stop();
    await subscriptionClient.dispose();
    await oldSubscriptionClient.close(true);
    await app.close();
  });
});
