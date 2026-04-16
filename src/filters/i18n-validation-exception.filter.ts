import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';
import iterate from 'iterare';
import { I18nContext, logger } from '..';
import {
  I18nValidationError,
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption,
  I18nValidationException,
} from '../interfaces';
import { mapChildrenToValidationErrors, formatI18nErrors } from '../utils';
import { I18nError } from '../i18n.error';

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
    const i18n = I18nContext.current(host);

    if (i18n == undefined) {
      if (!i18n) {
        logger.error(
          'I18n context not found! Is this function triggered by a processor or cronjob? Please use the I18nService',
        );
      }
      throw new I18nError('I18n context undefined');
    }

    const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });

    const normalizedErrors = this.normalizeValidationErrors(errors);

    switch (host.getType() as string) {
      case 'http':
        const response = host.switchToHttp().getResponse();
        const responseBody = this.buildResponseBody(
          host,
          exception,
          normalizedErrors,
        );
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

  protected normalizeValidationErrors(
    validationErrors: ValidationError[],
  ): string[] | I18nValidationError[] | object {
    if (
      this.isWithErrorFormatter(this.options) &&
      !('detailedErrors' in this.options) &&
      this.options.errorFormatter
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
  protected buildResponseBody(
    host: ArgumentsHost,
    exc: I18nValidationException,
    error: string[] | I18nValidationError[] | object,
  ) {
    if (
      'responseBodyFormatter' in this.options &&
      this.options.responseBodyFormatter
    ) {
      return this.options.responseBodyFormatter(host, exc, error);
    }
    return {
      statusCode:
        this.options.errorHttpStatusCode === undefined
          ? exc.getStatus()
          : this.options.errorHttpStatusCode,
      message: error,
      error: exc.getResponse(),
    };
  }
}
