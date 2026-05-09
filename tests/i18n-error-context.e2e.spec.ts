import path from 'path';

import {
  ArgumentsHost,
  Catch,
  Controller,
  ExceptionFilter,
  INestApplication,
  Module,
  Post,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { I18nContext, I18nModule } from '../src';

@Catch()
class ContextEchoExceptionFilter implements ExceptionFilter {
  catch(_: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<any>();
    const i18n = I18nContext.current(host);

    res.status(400).send({
      hasContext: Boolean(i18n),
      lang: i18n?.lang,
    });
  }
}

@Controller('issue-590')
class Issue590Controller {
  @Post()
  create() {
    return { ok: true };
  }
}

@Module({
  controllers: [Issue590Controller],
})
class Issue590Module {}

describe('issue #590 malformed json keeps i18n context for exception filters', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
        }),
        Issue590Module,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new ContextEchoExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should provide i18n context in exception filter for malformed json body', async () => {
    await request(app.getHttpServer())
      .post('/issue-590')
      .set('content-type', 'application/json')
      .send('{"broken":}')
      .expect(400)
      .expect({
        hasContext: true,
        lang: 'en',
      });
  });
});
