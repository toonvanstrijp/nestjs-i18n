import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';
import iterate from 'iterare';
import {
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption,
} from '../interfaces/i18n-validation-exception-filter.interface';
import { Either } from '../types/either.type';
import { mapChildrenToValidationErrors } from '../utils/format';
import { I18nContext } from '../i18n.context';
import {
  I18nValidationError,
  I18nValidationException,
} from '../interfaces/i18n-validation-error.interface';
import { getI18nContextFromArgumentsHost } from '../utils/util';

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

    const errors = this.translateErrors(exception.errors ?? [], i18n);

    switch (host.getType() as string) {
      case 'http':
        const response = host.switchToHttp().getResponse();
        response.status(exception.getStatus()).send({
          statusCode: exception.getStatus(),
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

  private translateErrors(
    errors: I18nValidationError[],
    i18n: I18nContext,
  ): I18nValidationError[] {
    return errors.map((error) => {
      error.children = this.translateErrors(error.children ?? [], i18n);
      error.constraints = Object.keys(error.constraints).reduce(
        (result, key) => {
          // separate translation key and args
          const [translationKey, argsString] =
            error.constraints[key].split('|');

          // jsonify args
          const args = !!argsString ? JSON.parse(argsString) : {};

          result[key] = i18n.t(translationKey, {
            args: { property: error.property, ...args },
          });

          // replace error.property with translated property
          const errorPropertyInString = (result[key] as string).match(
            error.property,
          );
          let replacementKey = error.property;
          if (errorPropertyInString) {
            const baseKey = translationKey.split('.')[0];
            const replacementKeySub = i18n.t(
              baseKey + '.' + errorPropertyInString[0],
            ) as string;
            if (!replacementKeySub.includes(baseKey)) {
              replacementKey = replacementKeySub;
            }
          }

          result[key] = result[key].replace(error.property, replacementKey);

          return result;
        },
        {},
      );
      return error;
    });
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
