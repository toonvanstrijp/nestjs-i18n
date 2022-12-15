import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { I18nContext } from '../../../src';
import { I18nTranslations } from '../../generated/i18n.generated';

export class TestException extends HttpException {
  constructor() {
    super('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Catch(TestException)
export class TestExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const i18n = I18nContext.current<I18nTranslations>(host);
    const response = host.switchToHttp().getResponse<any>();

    response.status(500).send({
      lang: i18n.lang,
    });
  }
}
