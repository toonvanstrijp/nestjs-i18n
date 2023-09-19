import {
  I18nOptionResolver,
  I18nValidationError,
  I18nValidationException,
} from '../interfaces';
import {
  getMetadataStorage,
  ValidationArguments,
  ValidationError,
} from 'class-validator';
import { I18nService, TranslateOptions } from '../services/i18n.service';
import { MiddlewareConsumer } from '@nestjs/common';
import { NestMiddlewareConsumer, Path } from '../types';

export function shouldResolve(e: I18nOptionResolver) {
  return typeof e === 'function' || e['use'];
}

function validationErrorToI18n(e: ValidationError): I18nValidationError {
  return {
    property: e.property,
    value: e.value,
    target: e.target,
    contexts: e.contexts,
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
  errors: ValidationError[],
): I18nValidationException {
  return new I18nValidationException(
    errors.map((e) => {
      return validationErrorToI18n(e);
    }),
  );
}

export function i18nValidationMessage<K = Record<string, unknown>>(
  key: Path<K>,
  args?: any,
) {
  return (a: ValidationArguments) => {
    const { constraints } = a;
    let { value } = a;
    if (typeof value === 'string') {
      value = value.replace(/\|/g, '');
    }
    return `${key}|${JSON.stringify({ value, constraints, ...args })}`;
  };
}

export function formatI18nErrors<K = Record<string, unknown>>(
  errors: I18nValidationError[],
  i18n: I18nService<K>,
  options?: TranslateOptions,
): I18nValidationError[] {
  return errors.map((error) => {
    const limits = getMetadataStorage()
      .getTargetValidationMetadatas(
        error.target.constructor,
        error.target.constructor.name,
        true,
        false,
      )
      .find(
        (meta) =>
          meta.target === error.target.constructor &&
          meta.propertyName === error.property,
      );
    const constraints = Object.assign({}, limits?.constraints);
    error.children = formatI18nErrors(error.children ?? [], i18n, options);
    error.constraints = Object.keys(error.constraints).reduce((result, key) => {
      const [translationKey, argsString] = error.constraints[key].split('|');
      const args = !!argsString ? JSON.parse(argsString) : {};
      result[key] = i18n.translate(translationKey as Path<K>, {
        ...options,
        args: {
          property: error.property,
          value: error.value,
          target: error.target,
          contexts: error.contexts,
          constraints: constraints,
          ...args,
        },
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
