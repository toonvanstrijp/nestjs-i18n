import * as ts from 'typescript';

export const convertObjectToTypeDefinition = async (
  object: any,
): Promise<ts.TypeElement[]> => {
  switch (typeof object) {
    case 'object':
      return Promise.all(
        Object.keys(object).map(async (key) => {
          if (typeof object[key] === 'string') {
            return ts.factory.createPropertySignature(
              undefined,
              ts.factory.createStringLiteral(key),
              undefined,
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            );
          }
          if (Array.isArray(object[key])) {
            return ts.factory.createPropertySignature(
              undefined,
              ts.factory.createStringLiteral(key),
              undefined,
              ts.factory.createTupleTypeNode(
                Array(object[key].length).fill(
                  ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                ),
              ),
            );
          }
          return ts.factory.createPropertySignature(
            undefined,
            ts.factory.createStringLiteral(key),
            undefined,
            ts.factory.createTypeLiteralNode(
              await convertObjectToTypeDefinition(object[key]),
            ),
          );
        }),
      );
  }

  return [];
};

const printer = ts.createPrinter();

export const createTypesFile = async (object: any) => {
  const sourceFile = ts.createSourceFile(
    'placeholder.ts',
    '',
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TS,
  );

  const i18nTranslationsType = ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('I18nTranslations'),
    undefined,
    ts.factory.createTypeLiteralNode(
      await convertObjectToTypeDefinition(object),
    ),
  );

  const nodes = ts.factory.createNodeArray([
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(
            false,
            undefined,
            ts.factory.createIdentifier('Path'),
          ),
        ]),
      ),
      ts.factory.createStringLiteral('nestjs-i18n'),
      undefined,
    ),
    i18nTranslationsType,
    ts.factory.createTypeAliasDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier('I18nPath'),
      undefined,
      ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Path'), [
        ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier('I18nTranslations'),
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
