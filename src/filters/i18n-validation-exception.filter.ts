import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';
import iterate from 'iterare';
import {
  I18nValidationError,
  I18nValidationException,
} from '../interfaces/i18n-validation-error.interface';
import {
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption,
} from '../interfaces/i18n-validation-exception-filter.interface';
import { Either } from '../types/either.type';
import { mapChildrenToValidationErrors } from '../utils/format';
import {
  formatI18nErrors,
  getI18nContextFromArgumentsHost,
} from '../utils/util';

type I18nValidationExceptionFilterOptions = Either<
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption
>;

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: true,
    },
  ) {}
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);

    const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });

    switch (host.getType() as string) {
      case 'http':
        const response = host.switchToHttp().getResponse();
        response
          .status(this.options.errorHttpStatusCode || exception.getStatus())
          .send({
            statusCode:
              this.options.errorHttpStatusCode || exception.getStatus(),
            message: exception.getResponse(),
            errors: this.normalizeValidationErrors(errors),
          });
        break;
      case 'graphql':
        exception.errors = this.normalizeValidationErrors(
          errors,
        ) as I18nValidationError[];
        return exception;
    }
  }

  protected normalizeValidationErrors(
    validationErrors: ValidationError[],
  ): string[] | I18nValidationError[] | object {
    switch (true) {
      case !this.options.detailedErrors && !('errorFormatter' in this.options):
        return this.flattenValidationErrors(validationErrors);
      case !this.options.detailedErrors && 'errorFormatter' in this.options:
        return this.options.errorFormatter(validationErrors);
      default:
        return validationErrors;
    }
  }

  protected flattenValidationErrors(
    validationErrors: ValidationError[],
  ): string[] {
    return iterate(validationErrors)
      .map((error) => mapChildrenToValidationErrors(error))
      .flatten()
      .filter((item) => !!item.constraints)
      .map((item) => Object.values(item.constraints))
      .flatten()
      .toArray();
  }
}
