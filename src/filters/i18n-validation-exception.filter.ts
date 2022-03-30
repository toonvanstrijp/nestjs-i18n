import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { I18nContext } from '../i18n.context';
import {
  I18nValidationError,
  I18nValidationException,
} from '../interfaces/i18n-validation-error.interface';
import { getI18nContextFromArgumentsHost } from '../utils/util';

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);
    const response = host.switchToHttp().getResponse<any>();

    const errors = this.translateErrors(exception.errors, i18n);

    response
      .status(exception.getStatus())
      .send({ statusCode: exception.getStatus(), errors });
  }

  private translateErrors(
    errors: I18nValidationError[],
    i18n: I18nContext,
  ): I18nValidationError[] {
    return errors.map((error) => {
      error.children = this.translateErrors(error.children, i18n);
      error.constraints = Object.keys(error.constraints).reduce(
        (result, key) => {
          const [translationKey, argsString] =
            error.constraints[key].split('|');
          const args = !!argsString ? JSON.parse(argsString) : {};
          result[key] = i18n.t(translationKey, {
            args: { property: error.property, ...args },
          });
          return result;
        },
        {},
      );
      return error;
    });
  }
}
