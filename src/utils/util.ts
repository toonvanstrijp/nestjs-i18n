import {
  I18nOptionResolver,
  I18nValidationError,
  I18nValidationException,
} from '../interfaces';
import { ValidationArguments, ValidationError } from 'class-validator';
import { I18nService, TranslateOptions } from '../services/i18n.service';
import { HttpStatus, Logger, MiddlewareConsumer } from '@nestjs/common';
import { NestMiddlewareConsumer, Path } from '../types';

type NoInfer<T> = [T][T extends any ? 0 : never];



export const logger = new Logger('I18nService');

export function shouldResolve(e: I18nOptionResolver) {
  return typeof e === 'function' || 'use' in e;
}

export function httpStatusToMessage(status: HttpStatus): string {
  const key = HttpStatus[status];

  return key
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function validationErrorToI18n(e: ValidationError): I18nValidationError {
  return {
    property: e.property,
    value: e.value,
    target: e.target,
    contexts: e.contexts,
    children: e?.children?.map(validationErrorToI18n),
    constraints: e.constraints
      ? Object.keys(e.constraints).reduce((result, key) => {
          result[key] = e.constraints![key];
          return result;
        }, {} as Record<string, string>)
      : {},
  };
}

export function i18nValidationErrorFactory(
  errors: ValidationError[],
): I18nValidationException {
  const normalizedErrors = errors.map((e) => {
    return validationErrorToI18n(e);
  });

  const { I18nContext } = require('../i18n.context') as typeof import('../i18n.context');
  const i18n = I18nContext.current();

  if (!i18n) {
    return new I18nValidationException(normalizedErrors);
  }

  return new I18nValidationException(
    formatI18nErrors(normalizedErrors, i18n.service, {
      lang: i18n.lang,
    }),
    undefined,
    true,
  );
}

export function i18nValidationMessage<K = Record<string, unknown>>(
  key: Path<NoInfer<K>>,
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
    error.children = formatI18nErrors(error.children ?? [], i18n, options);
    error.constraints = Object.keys(error.constraints ?? {}).reduce(
      (result, key) => {
        const rawConstraint = error.constraints![key];
        const separatorIndex = rawConstraint.indexOf('|');
        const translationKey =
          separatorIndex === -1
            ? rawConstraint
            : rawConstraint.slice(0, separatorIndex);
        const argsString =
          separatorIndex === -1 ? '' : rawConstraint.slice(separatorIndex + 1);
        let args: Record<string, any> = {};
        if (argsString) {
          try {
            args = JSON.parse(argsString);
          } catch {
            args = {};
          }
        }
        const constraints = args.constraints
          ? args.constraints.reduce((acc: Record<string, string>, cur: any, index: number) => {
              acc[index.toString()] = cur;
              return acc;
            }, {} as Record<string, string>)
          : error.constraints;
        result[key] = i18n.translate(translationKey as Path<K>, {
          ...options,
          args: {
            property: error.property,
            value: error.value,
            target: error.target,
            contexts: error.contexts,
            ...args,
            constraints,
          },
        });
        return result;
      },
      {} as Record<string, string>,
    );
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
