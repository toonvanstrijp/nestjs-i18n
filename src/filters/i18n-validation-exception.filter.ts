import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';

import { I18nContext } from '..';
import {
  I18nValidationError,
  I18nValidationException,
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption,
} from '../interfaces';
import {
  formatI18nErrors,
  getI18nContextOrThrow,
  mapChildrenToValidationErrors,
} from '../utils';
import { ExecutionContextType } from '../i18n.constants';

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
    const errors =
      exception.errorsAlreadyTranslated && exception.errors
        ? exception.errors
        : formatI18nErrors(
            exception.errors ?? [],
            getI18nContextOrThrow(
              I18nContext.current(host) ?? I18nContext.current(),
            ).service,
            {
              lang: (I18nContext.current(host) ?? I18nContext.current())?.lang,
            },
          );

    const normalizedErrors = this.normalizeValidationErrors(errors);

    switch (host.getType() as string) {
      case ExecutionContextType.HTTP:
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
      case ExecutionContextType.GRAPHQL:
        return this.createGraphQLError(exception, normalizedErrors);
    }
  }

  private async createGraphQLError(
    exception: I18nValidationException,
    errors: string[] | I18nValidationError[] | object,
  ) {
    const status = this.options.errorHttpStatusCode || exception.getStatus();

    try {
      // Load lazily so non-GraphQL consumers don't need the graphql package.

      const { GraphQLError } = await import('graphql');

      return new GraphQLError(exception.message, {
        extensions: {
          code: 'BAD_USER_INPUT',
          status,
          errors,
        },
      });
    } catch {
      exception.errors = errors as I18nValidationError[];
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
    return validationErrors
      .map((error) => mapChildrenToValidationErrors(error))
      .flat()
      .filter((item) => !!item.constraints)
      .map((item) => Object.values(item.constraints ?? {}))
      .flat();
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
