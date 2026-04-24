import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';
import iterate from 'iterare';
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
    const i18n = getI18nContextOrThrow(
      I18nContext.current(host) ?? I18nContext.current(),
    );

    let errors = exception.errors ?? [];
    if ((this.options as any).autoTranslate) {
      errors = this.translateValidationErrors(errors, i18n);
    }
    errors = formatI18nErrors(errors, i18n.service, {
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
    return iterate(validationErrors)
      .map((error) => mapChildrenToValidationErrors(error))
      .flatten()
      .filter((item) => !!item.constraints)
      .map((item) => Object.values(item.constraints ?? {}))
      .flatten()
      .toArray();
  }

  protected translateValidationErrors(
    errors: ValidationError[],
    i18n: I18nContext,
  ): ValidationError[] {
    if (!(this.options as any).autoTranslate) {
      return errors;
    }

    return errors.map((error) => {
      const translatedError = { ...error };

      if (error.constraints) {
        translatedError.constraints = {};
        for (const [constraintName, defaultMessage] of Object.entries(error.constraints)) {
          const translationKey = `validation.${constraintName.toUpperCase()}`;
          
          try {
            translatedError.constraints[constraintName] = i18n.service.translate(translationKey, {
              lang: i18n.lang,
              args: {
                property: error.property,
                value: error.value,
                constraints: error.constraints,
                target: error.target,
              },
            });
          } catch {
            translatedError.constraints[constraintName] = defaultMessage;
          }
        }
      }

      if (error.children && error.children.length > 0) {
        translatedError.children = this.translateValidationErrors(error.children, i18n);
      }

      return translatedError;
    });
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
