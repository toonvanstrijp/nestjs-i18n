import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';
import iterate from 'iterare';
import { I18nContext } from '../i18n.context';
import {
  I18nValidationError,
  I18nValidationException,
} from '../interfaces/i18n-validation-error.interface';
import {
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption,
} from '../interfaces/i18n-validation-exception-filter.interface';
import { mapChildrenToValidationErrors } from '../utils/format';
import { formatI18nErrors } from '../utils/util';

type I18nValidationExceptionFilterOptions =
  | I18nValidationExceptionFilterDetailedErrorsOption
  | I18nValidationExceptionFilterErrorFormatterOption;

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: true,
    },
  ) {}
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = I18nContext.current();

    const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });

    const normalizedErrors = this.normalizeValidationErrors(
        errors,
    );

    switch (host.getType() as string) {
      case 'http':
        const response = host.switchToHttp().getResponse();

        const responseBody = this.buildResponseBody(exception, normalizedErrors);

        response
          .status(this.options.errorHttpStatusCode || exception.getStatus())
          .send(responseBody);
        break;
      case 'graphql':
        exception.errors = normalizedErrors as I18nValidationError[];
        return exception;
    }
  }

  private isWithErrorFormatter(
    options: I18nValidationExceptionFilterOptions,
  ): options is I18nValidationExceptionFilterErrorFormatterOption {
    return 'errorFormatter' in options;
  }


  protected buildResponseBody(
      exc: I18nValidationException,
      errors: string[] | I18nValidationError[] | object,
      ) {

    if('responseBodyFormatter' in this.options) {
        return this.options.responseBodyFormatter(exc, errors);
    } else {
      return {
        statusCode: exc.getStatus(),
        message: exc.getResponse(),
        errors,
      };
    }
  }


  protected normalizeValidationErrors(
    validationErrors: ValidationError[],
  ): string[] | I18nValidationError[] | object {
    if (
      this.isWithErrorFormatter(this.options) &&
      !('detailedErrors' in this.options)
    )
      return this.options.errorFormatter(validationErrors);

    if (
      !this.isWithErrorFormatter(this.options) &&
      !this.options.detailedErrors
    )
      return this.flattenValidationErrors(validationErrors);

    return validationErrors;
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
