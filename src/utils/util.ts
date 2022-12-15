import { I18nOptionResolver } from '../interfaces/i18n-options.interface';
import { ValidationArguments, ValidationError } from 'class-validator';
import {
  I18nValidationError,
  I18nValidationException,
} from '../interfaces/i18n-validation-error.interface';
import { I18nService, TranslateOptions } from '../services/i18n.service';
import { MiddlewareConsumer } from '@nestjs/common';
import { NestMiddlewareConsumer, Path } from '../types';
import * as ts from 'typescript';
import { factory } from 'typescript';

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

export const convertObjectToTypeDefinition = (
  object: any,
): ts.TypeElement[] => {
  switch (typeof object) {
    case 'object':
      return Object.keys(object).map((key) => {
        if (typeof object[key] === 'string') {
          return factory.createPropertySignature(
            undefined,
            factory.createStringLiteral(key),
            undefined,
            factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          );
        }
        if (Array.isArray(object[key])) {
          return factory.createPropertySignature(
            undefined,
            factory.createStringLiteral(key),
            undefined,
            factory.createTupleTypeNode(
              Array(object[key].length).fill(
                factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
              ),
            ),
          );
        }
        return factory.createPropertySignature(
          undefined,
          factory.createStringLiteral(key),
          undefined,
          factory.createTypeLiteralNode(
            convertObjectToTypeDefinition(object[key]),
          ),
        );
      });
  }

  return [];
};

const printer = ts.createPrinter();

export const createTypesFile = (object: any) => {
  const sourceFile = ts.createSourceFile(
    'placeholder.ts',
    '',
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TS,
  );

  const i18nTranslationsType = factory.createTypeAliasDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier('I18nTranslations'),
    undefined,
    factory.createTypeLiteralNode(convertObjectToTypeDefinition(object)),
  );

  const nodes = factory.createNodeArray([
    factory.createImportDeclaration(
      undefined,
      factory.createImportClause(
        false,
        undefined,
        factory.createNamedImports([
          factory.createImportSpecifier(
            false,
            undefined,
            factory.createIdentifier('Path'),
          ),
        ]),
      ),
      factory.createStringLiteral('nestjs-i18n'),
      undefined,
    ),
    i18nTranslationsType,
    factory.createTypeAliasDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier('I18nPath'),
      undefined,
      factory.createTypeReferenceNode(factory.createIdentifier('Path'), [
        factory.createTypeReferenceNode(
          factory.createIdentifier('I18nTranslations'),
          undefined,
        ),
      ]),
    ),
  ]);

  return printer.printList(ts.ListFormat.MultiLine, nodes, sourceFile);
};

export const annotateSourceCode = (code: string) => {
  return `/* DO NOT EDIT, file generated by nestjs-i18n */

${code}`;
};
