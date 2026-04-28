import path from 'path';

import {
  ArgumentsHost,
  Body,
  Catch,
  Controller,
  ExceptionFilter,
  Module,
  Post,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { IsNotEmpty } from 'class-validator';
import request from 'supertest';

import {
  I18nModule,
  I18nValidationException,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
  QueryResolver,
  i18nValidationMessage,
} from '../src';

class Issue702Dto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  email!: string;
}

@Controller('issue-702')
class Issue702Controller {
  @Post()
  create(@Body() _dto: Issue702Dto) {
    return { ok: true };
  }
}

@Catch()
class CatchEverythingFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<any>();

    if (exception instanceof I18nValidationException) {
      return response.status(exception.getStatus()).send({
        statusCode: exception.getStatus(),
        message: exception.errors,
      });
    }

    return response.status(500).send({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      resolvers: [{ use: QueryResolver, options: ['lang', 'locale', 'l'] }],
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
    }),
  ],
  controllers: [Issue702Controller],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_FILTER,
      useValue: new I18nValidationExceptionFilter(),
    },
  ],
})
class Issue702Module {}

describe('issue #702 i18n validation with multiple APP_FILTER registrations', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Issue702Module],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();
    app.useGlobalPipes(
      new I18nValidationPipe({
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('returns translated validation errors even when a catch-all APP_FILTER handles the exception', async () => {
    await request(app.getHttpServer())
      .post('/issue-702?l=nl')
      .send({ email: '' })
      .expect(400)
      .expect((res) => {
        const message = res.body.message;
        const translated = message?.[0]?.constraints?.isNotEmpty;

        expect(typeof translated).toBe('string');
        expect(translated).not.toContain('validation.NOT_EMPTY');
        expect(translated).not.toContain('|{');
      });
  });
});
