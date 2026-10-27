import fs from 'fs';
import path from 'path';

import { concatMap, Observable, of } from 'rxjs';

import { I18nError } from './i18n.error';
import { I18nTranslation } from './interfaces';
import {
  GenerateI18nTypesOptions,
  GenerateI18nTypesResult,
} from './interfaces/types-generator.interface';
import { I18nJsonLoader, I18nYamlLoader } from './loaders';
import { mergeDeep } from './utils';

function createLoader(options: GenerateI18nTypesOptions) {
  return options.format === 'yaml' ? new I18nYamlLoader(options) : new I18nJsonLoader(options);
}

async function writeI18nTypes(
  translations: I18nTranslation,
  output: string,
): Promise<GenerateI18nTypesResult> {
  const object = Object.keys(translations).reduce(
    (result, key) => mergeDeep(result, translations[key]),
    {} as I18nTranslation,
  );

  const ts = await import('./utils/typescript');
  const rawContent = await ts.createTypesFile(object);
  if (!rawContent) {
    throw new I18nError('Failed to generate types file content');
  }

  const outputFile = ts.annotateSourceCode(rawContent);
  fs.mkdirSync(path.dirname(output), { recursive: true });

  let currentFileContent: string | null = null;
  try {
    currentFileContent = fs.readFileSync(output, 'utf8');
  } catch {
    currentFileContent = null;
  }

  if (currentFileContent === outputFile) {
    return {
      output,
      written: false,
    };
  }

  fs.writeFileSync(output, outputFile);
  return {
    output,
    written: true,
  };
}

export async function generateI18nTypes(
  options: GenerateI18nTypesOptions,
): Promise<GenerateI18nTypesResult> {
  const loader = createLoader(options);

  const loaded = await loader.load();
  const translations: I18nTranslation =
    loaded && typeof (loaded as any).subscribe === 'function'
      ? await new Promise((resolve) => {
          (loaded as any).subscribe((value: I18nTranslation) => {
            resolve(value);
          });
        })
      : (loaded as I18nTranslation);

  try {
    return await writeI18nTypes(translations, options.output);
  } finally {
    if (typeof (loader as any).onModuleDestroy === 'function') {
      await (loader as any).onModuleDestroy();
    }
  }
}

/**
 * Generates the types file and regenerates it whenever the translation files
 * change. `onResult` is called after every generation and `onError` when a
 * generation fails; watching continues in both cases. Resolves once the types
 * have been generated for the first time, with a function that stops watching.
 */
export async function watchI18nTypes(
  options: Omit<GenerateI18nTypesOptions, 'watch'>,
  onResult: (result: GenerateI18nTypesResult) => void,
  onError: (error: unknown) => void,
): Promise<() => Promise<void>> {
  const loader = createLoader({ ...options, watch: true });

  let loaded: I18nTranslation | Observable<I18nTranslation>;
  try {
    loaded = await loader.load();
  } catch (error) {
    await loader.onModuleDestroy();
    throw error;
  }

  let initialGenerationDone!: () => void;
  const initialGeneration = new Promise<void>((resolve) => {
    initialGenerationDone = resolve;
  });

  const subscription = (loaded instanceof Observable ? loaded : of(loaded))
    .pipe(
      concatMap(async (translations) => {
        try {
          onResult(await writeI18nTypes(translations, options.output));
        } catch (error) {
          onError(error);
        }
        initialGenerationDone();
      }),
    )
    .subscribe();

  await initialGeneration;

  return async () => {
    subscription.unsubscribe();
    await loader.onModuleDestroy();
  };
}
