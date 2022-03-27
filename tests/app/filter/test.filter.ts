import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { getI18nContextFromArgumentsHost } from "../../../src/utils/util";

@Catch()
export class TestExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);
    const response = host.switchToHttp().getResponse<any>();

    response
      .status(500)
      .send({
        lang: i18n.lang,
      });
  }
}