import * as fs from 'fs';
import * as path from 'path';
import { I18nJsonLoader, I18nYamlLoader } from './loaders';
import { I18nTranslation } from './interfaces';
import { mergeDeep } from './utils';
import { I18nError } from './i18n.error';

type LoaderFormat = 'json' | 'yaml';

type LoaderOptions = {
  path: string;
  includeSubfolders?: boolean;
  filePattern?: string;
  watch?: boolean;
};

export interface GenerateI18nTypesOptions extends LoaderOptions {
  outputPath: string;
  format?: LoaderFormat;
}

export interface GenerateI18nTypesResult {
  outputPath: string;
  written: boolean;
}

export async function generateI18nTypes(
  options: GenerateI18nTypesOptions,
): Promise<GenerateI18nTypesResult> {
  const loader =
    options.format === 'yaml'
      ? new I18nYamlLoader(options)
      : new I18nJsonLoader(options);

  const loaded = await loader.load();
  const translations: I18nTranslation =
    loaded && typeof (loaded as any).subscribe === 'function'
      ? await new Promise((resolve) => {
          (loaded as any).subscribe((value: I18nTranslation) => {
            resolve(value);
          });
        })
      : (loaded as I18nTranslation);

  const object = Object.keys(translations).reduce(
    (result, key) => mergeDeep(result, translations[key]),
    {} as I18nTranslation,
  );

  let rawContent: string | undefined;
  try {
    const ts = await import('./utils/typescript');
    rawContent = await ts.createTypesFile(object);
    if (!rawContent) {
      throw new I18nError('Failed to generate types file content');
    }

    const outputFile = ts.annotateSourceCode(rawContent);
    fs.mkdirSync(path.dirname(options.outputPath), { recursive: true });

    let currentFileContent: string | null = null;
    try {
      currentFileContent = fs.readFileSync(options.outputPath, 'utf8');
    } catch (_) {
      currentFileContent = null;
    }

    if (currentFileContent === outputFile) {
      return {
        outputPath: options.outputPath,
        written: false,
      };
    }

    fs.writeFileSync(options.outputPath, outputFile);
    return {
      outputPath: options.outputPath,
      written: true,
    };
  } finally {
    if (typeof (loader as any).onModuleDestroy === 'function') {
      await (loader as any).onModuleDestroy();
    }
  }
}
