import { I18nOptionResolver } from '../interfaces/i18n-options.interface';
import { ValidationArguments, ValidationError } from 'class-validator';
import {
  I18nValidationError,
  I18nValidationException,
} from '../interfaces/i18n-validation-error.interface';
import { I18nService, TranslateOptions } from '../services/i18n.service';
import { MiddlewareConsumer } from '@nestjs/common';
import { NestMiddlewareConsumer, Path } from '../types';
import type * as ts from 'typescript';

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

let t: typeof ts | undefined;

const loadTypescript = async (): Promise<boolean> => {
  if (t == undefined) {
    try {
      t = await import('typescript');
      return true;
    } catch (_) {
      // no typescript found
      return false;
    }
  }
}

export const convertObjectToTypeDefinition = async (
  object: any,
): Promise<ts.TypeElement[]> => {
  if(!(await loadTypescript())) {
    return;
  }

  switch (typeof object) {
    case 'object':
      return Promise.all(Object.keys(object).map(async (key) => {
        if (typeof object[key] === 'string') {
          return t.factory.createPropertySignature(
            undefined,
            t.factory.createStringLiteral(key),
            undefined,
            t.factory.createKeywordTypeNode(t.SyntaxKind.StringKeyword),
          );
        }
        if (Array.isArray(object[key])) {
          return t.factory.createPropertySignature(
            undefined,
            t.factory.createStringLiteral(key),
            undefined,
            t.factory.createTupleTypeNode(
              Array(object[key].length).fill(
                t.factory.createKeywordTypeNode(t.SyntaxKind.StringKeyword),
              ),
            ),
          );
        }
        return t.factory.createPropertySignature(
          undefined,
          t.factory.createStringLiteral(key),
          undefined,
          t.factory.createTypeLiteralNode(
            await convertObjectToTypeDefinition(object[key]),
          ),
        );
      }));
  }

  return [];
};


export const createTypesFile = async (object: any) => {
  if(!(await loadTypescript())) {
    return;
  }
  
  const printer = t.createPrinter();

  const sourceFile = t.createSourceFile(
    'placeholder.ts',
    '',
    t.ScriptTarget.ESNext,
    true,
    t.ScriptKind.TS,
  );

  const i18nTranslationsType = t.factory.createTypeAliasDeclaration(
    [t.factory.createModifier(t.SyntaxKind.ExportKeyword)],
    t.factory.createIdentifier('I18nTranslations'),
    undefined,
    t.factory.createTypeLiteralNode(await convertObjectToTypeDefinition(object)),
  );

  const nodes = t.factory.createNodeArray([
    t.factory.createImportDeclaration(
      undefined,
      t.factory.createImportClause(
        false,
        undefined,
        t.factory.createNamedImports([
          t.factory.createImportSpecifier(
            false,
            undefined,
            t.factory.createIdentifier('Path'),
          ),
        ]),
      ),
      t.factory.createStringLiteral('nestjs-i18n'),
      undefined,
    ),
    i18nTranslationsType,
    t.factory.createTypeAliasDeclaration(
      [t.factory.createModifier(t.SyntaxKind.ExportKeyword)],
      t.factory.createIdentifier('I18nPath'),
      undefined,
      t.factory.createTypeReferenceNode(t.factory.createIdentifier('Path'), [
        t.factory.createTypeReferenceNode(
          t.factory.createIdentifier('I18nTranslations'),
          undefined,
        ),
      ]),
    ),
  ]);

  return printer.printList(t.ListFormat.MultiLine, nodes, sourceFile);
};

export const annotateSourceCode = (code: string) => {
  return `/* DO NOT EDIT, file generated by nestjs-i18n */

${code}`;
};
