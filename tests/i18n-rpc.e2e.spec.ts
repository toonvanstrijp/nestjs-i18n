import { Test } from '@nestjs/testing';
import * as path from 'path';
import { GrpcMetadataResolver, I18nModule } from '../src';
import { HelloController } from './app/controllers/hello.controller';
import {
  ClientGrpc,
  ClientsModule,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';
import { HeroService } from './app/interfaces/hero.interface';
import { Metadata } from '@grpc/grpc-js';

describe('i18n module e2e rpc', () => {
  let app: INestApplication;
  let client: ClientGrpc;
  let heroService: HeroService;

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
          resolvers: [new GrpcMetadataResolver(['lang'])],
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
        }),
        ClientsModule.register([
          {
            name: 'HERO_PACKAGE',
            transport: Transport.GRPC,
            options: {
              package: 'hero',
              protoPath: join(__dirname, 'app/hero.proto'),
            },
          },
        ]),
      ],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication();

    app.connectMicroservice<MicroserviceOptions>(
      {
        transport: Transport.GRPC,
        options: {
          package: 'hero',
          protoPath: join(__dirname, 'app/hero.proto'),
        },
      },
      { inheritAppConfig: true },
    );

    await app.startAllMicroservices();
    await app.init();

    client = app.get('HERO_PACKAGE');
    heroService = client.getService<HeroService>('HeroesService');
  });

  it(`should translate grpc call`, async () => {
    const meta = new Metadata();
    meta.set('lang', 'en');

    await new Promise<void>((resolve) => {
      heroService.findOne({ id: 1 }, meta).subscribe((hero) => {
        expect(hero).toEqual({ id: 1, name: 'Hello, John' });
        resolve();
      });
    });

    meta.set('lang', 'fr');
    await new Promise<void>((resolve) => {
      heroService.findOne({ id: 1 }, meta).subscribe((hero) => {
        expect(hero).toEqual({ id: 1, name: 'Bonjour, John' });
        resolve();
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
