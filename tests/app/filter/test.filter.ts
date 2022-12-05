import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RequestContext } from '../../../src/utils/context';

export class TestException extends HttpException {
  constructor() {
    super('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Catch(TestException)
export class TestExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const i18n = RequestContext.getI18nContext();
    const response = host.switchToHttp().getResponse<any>();

    response.status(500).send({
      lang: i18n.lang,
    });
  }
}
