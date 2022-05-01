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
import { getI18nContextFromArgumentsHost } from '../utils/util';

interface I18nValidationExceptionFilterOptions {
  detailedErrors?: boolean;
}

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: true,
    },
  ) {}
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);
    const response = host.switchToHttp().getResponse<any>();

    let errors = this.translateErrors(exception.errors ?? [], i18n);

    response.status(exception.getStatus()).send({
      statusCode: exception.getStatus(),
      message: exception.getResponse(),
      errors: this.options.detailedErrors
        ? errors
        : this.flattenValidationErrors(errors),
    });
  }

  private translateErrors(
    errors: I18nValidationError[],
    i18n: I18nContext,
  ): I18nValidationError[] {
    return errors.map((error) => {
      error.children = this.translateErrors(error.children ?? [], i18n);
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

  protected flattenValidationErrors(
    validationErrors: ValidationError[],
  ): string[] {
    return iterate(validationErrors)
      .map((error) => this.mapChildrenToValidationErrors(error))
      .flatten()
      .filter((item) => !!item.constraints)
      .map((item) => Object.values(item.constraints))
      .flatten()
      .toArray();
  }

  protected mapChildrenToValidationErrors(
    error: ValidationError,
    parentPath?: string,
  ): ValidationError[] {
    if (!(error.children && error.children.length)) {
      return [error];
    }
    const validationErrors = [];
    parentPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    for (const item of error.children) {
      if (item.children && item.children.length) {
        validationErrors.push(
          ...this.mapChildrenToValidationErrors(item, parentPath),
        );
      }
      validationErrors.push(
        this.prependConstraintsWithParentProp(parentPath, item),
      );
    }
    return validationErrors;
  }

  protected prependConstraintsWithParentProp(
    parentPath: string,
    error: ValidationError,
  ): ValidationError {
    const constraints = {};
    for (const key in error.constraints) {
      constraints[key] = `${parentPath}.${error.constraints[key]}`;
    }
    return {
      ...error,
      constraints,
    };
  }
}
