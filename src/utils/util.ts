import { I18nOptionResolver } from '../interfaces/i18n-options.interface';
import { ValidationArguments, ValidationError } from 'class-validator';
import {
  I18nValidationError,
  I18nValidationException,
} from '../interfaces/i18n-validation-error.interface';
import { I18nService, TranslateOptions } from '../services/i18n.service';
import { HttpStatus, MiddlewareConsumer } from '@nestjs/common';
import { NestMiddlewareConsumer, Path } from '../types';

export function shouldResolve(e: I18nOptionResolver) {
  return typeof e === 'function' || e['use'];
}

function validationErrorToI18n(e: ValidationError): I18nValidationError {
  return {
    property: e.property,
    children: e?.children?.map(validationErrorToI18n),
    constraints: !!e.constraints
      ? Object.keys(e.constraints).reduce((result, key) => {
          result[key] = e.constraints[key];
          return result;
        }, {})
      : {},
  };
}

export function i18nValidationErrorFactory(
  status: HttpStatus = HttpStatus.BAD_REQUEST,
): (errors: ValidationError[]) => I18nValidationException {
  return (errors: ValidationError[]): I18nValidationException => {
    return new I18nValidationException(
      errors.map((e) => validationErrorToI18n(e)),
      status,
    );
  };
}

export function i18n<K = Record<string, unknown>>(key: Path<K>, args?: any) {
  return (a: ValidationArguments) => {
    const { constraints } = a;
    let { value } = a;
    if (typeof value === 'string') {
      value = value.replace(/\|/g, '');
    }
    return `${key}|${JSON.stringify({ value, constraints, ...args })}`;
  };
}

/**
 * utility function just for type safety
 * */
export function i18nString<K = Record<string, unknown>>(key: Path<K>): string {
  return key;
}

export function formatI18nErrors<K = Record<string, unknown>>(
  errors: I18nValidationError[],
  i18n: I18nService<K>,
  options?: TranslateOptions,
): I18nValidationError[] {
  return errors.map((error) => {
    error.children = formatI18nErrors(error.children ?? [], i18n, options);
    error.constraints = Object.keys(error.constraints).reduce((result, key) => {
      const [translationKey, argsString] = error.constraints[key].split('|');
      const args = !!argsString ? JSON.parse(argsString) : {};
      result[key] = i18n.translate(translationKey as Path<K>, {
        ...options,
        args: { property: error.property, ...args },
      });
      return result;
    }, {});
    return error;
  });
}

export const isNestMiddleware = (
  consumer: MiddlewareConsumer,
): consumer is NestMiddlewareConsumer => {
  return typeof (consumer as any).httpAdapter === 'object';
};

export const usingFastify = (consumer: NestMiddlewareConsumer) => {
  return consumer.httpAdapter.constructor.name
    .toLowerCase()
    .startsWith('fastify');
};
