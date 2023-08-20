import yargs from 'yargs';
import { I18nJsonLoader } from '../loaders/i18n.json.loader';
import { I18nYamlLoader } from '../loaders/i18n.yaml.loader';
import chalk from 'chalk';
import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import { mergeDeep, mergeTranslations } from '../utils/merge';
import fs from 'fs';
import path from 'path';
import { logger } from '../i18n.module';
import process from 'process';
import chokidar from 'chokidar';
import { I18nLoader } from '../loaders/i18n.loader';
import { createTypesFile, annotateSourceCode } from '../utils/typescript';

export interface GenerateTypesArguments {
  typesOutputPath: string;
  watch: boolean;
  debounce: number;
  loaderType: string[];
  translationsPath: string[];
}

export class GenerateTypesCommand implements yargs.CommandModule {
  command = 'generate-types';
  describe = 'Generate types for translations. Supports json and yaml files.';

  builder(args: yargs.Argv<GenerateTypesArguments>) {
    return args
      .option('debounce', {
        alias: 'd',
        type: 'number',
        describe: 'Debounce time in ms',
        default: 200,
        demandOption: false,
      })
      .option('watch', {
        alias: 'w',
        type: 'boolean',
        describe: 'Watch for changes and generate types',
        default: false,
        demandOption: false,
      })
      .option('typesOutputPath', {
        alias: 'o',
        type: 'string',
        describe: 'Path to output types file',
        default: 'src/generated/i18n.generated.ts',
        demandOption: true,
      })
      .option('loaderType', {
        alias: 't',
        type: 'string',
        array: true,
        options: ['json', 'yaml'],
        describe: 'Loader type',
        demandOption: true,
      })
      .option('translationsPath', {
        alias: 'p',
        type: 'string',
        describe: 'Path to translations',
        array: true,
        demandOption: true,
      });
  }

  async handler(args: yargs.Arguments<GenerateTypesArguments>): Promise<void> {
    args.translationsPath = sanitizePaths(args.translationsPath);

    validateInputParams(args);
    validatePathsNotEmbeddedInEachOther(args.translationsPath);

    const loadersWithPaths = args.loaderType.map((loaderType, index) => {
      const path = args.translationsPath[index];
      validatePath(path, loaderType, index);
      return {
        path,
        loader: getLoaderByType(loaderType, path),
      };
    });

    const translationsWithPaths = await loadTranslations(loadersWithPaths);

    let hasError = false;

    const translationsMapped = translationsWithPaths.map(
      ({ translations, error, path }) => {
        if (error) {
          console.log(
            chalk.red(
              `Error while loading translations from ${path}: ${error.message}`,
            ),
          );
          hasError = true;
        }
        return translations;
      },
    );

    if (!hasError) {
      const mergedTranslations = reduceTranslations(translationsMapped);
      await generateAndSaveTypes(mergedTranslations, args);
    } else if (!args.watch) {
      process.exit(1);
    }

    if (args.watch) {
      console.log(
        chalk.green(
          `Listening for changes in ${args.translationsPath.join(', ')}...`,
        ),
      );
      await listenForChanges(loadersWithPaths, translationsWithPaths, args);
    } else {
      process.exit(0);
    }
  }
}

/**
 * we do not support nested paths, because listeners will be triggered multiple times
 * and it doesn't really make sense to have the same folder twice
 * */
function validatePathsNotEmbeddedInEachOther(paths: string[]) {
  for (let i = 0; i < paths.length; i++) {
    const pathToCheck = paths[i];
    for (let j = 0; j < paths.length; j++) {
      const pathToCompare = paths[j];
      if (j !== i && pathToCheck.startsWith(pathToCompare)) {
        console.log(
          chalk.red(
            `Path ${pathToCheck} is embedded in ${pathToCompare}. This is not supported.`,
          ),
        );
        process.exit(1);
      }
    }
  }
}

function listenForChanges(
  loadersWithPaths: {
    path: string;
    loader: I18nLoader<unknown>;
  }[],
  translationsWithPaths: { path: string; translations: I18nTranslation }[],
  args: GenerateTypesArguments,
) {
  const allPaths = loadersWithPaths.map(({ path }) => path);

  const loadersByPath = loadersWithPaths.reduce((acc, { path, loader }) => {
    acc[path] = loader;
    return acc;
  }, {} as { [key: string]: I18nLoader<unknown> });

  return new Promise((resolve, reject) => {
    chokidar
      .watch(allPaths, {
        ignoreInitial: true,
      })
      .on('ready', () => {
        resolve('ready');
      })
      .on('error', (error) => {
        console.log(chalk.red(`Error while watching files: ${error.message}`));
        reject(error);
      })
      .on(
        'all',
        customDebounce(
          handleFileChangeEvents(
            allPaths,
            loadersByPath,
            translationsWithPaths,
            args,
          ),
          args.debounce,
        ),
      );
  });
}

function sanitizePaths(paths: string[]) {
  return paths.map((path) => {
    // adding trailing slash
    const newPath = path.endsWith('/') ? path : `${path}/`;
    // removing starting slash
    return newPath.startsWith('./') ? newPath.slice(2) : newPath;
  });
}

function handleFileChangeEvents(
  listenToPaths: string[],
  loadersByPath: {
    [key: string]: I18nLoader<unknown>;
  },
  translationsWithPaths: { path: string; translations: I18nTranslation }[],
  args: GenerateTypesArguments,
) {
  return async (events: string[], paths: string[]) => {
    console.log(chalk.blue(`Change detected`));
    console.log(
      chalk.green(
        `${events.map((e, idx) => `\t${e} - ${paths[idx]}`).join('\n')}`,
      ),
    );
    console.log(chalk.blue(`Re-generating types...`));

    const uniquePaths = new Set<string>();

    for (const changePath of paths) {
      const foundPath = listenToPaths.find((path) =>
        changePath.startsWith(path),
      );
      uniquePaths.add(foundPath);
      if (uniquePaths.size === paths.length) {
        break;
      }
    }
    let hasError = false;

    for (const path of uniquePaths) {
      const loader = loadersByPath[path];
      try {
        const translation = (await loader.load()) as I18nTranslation;

        translationsWithPaths.forEach((translationWithPath) => {
          if (translationWithPath.path === path) {
            translationWithPath.translations = translation;
          }
        });
      } catch (e) {
        hasError = true;
        console.log(
          chalk.red(
            `Error while loading translations from ${path}. Error: ${e.message}`,
          ),
        );
      }
    }

    if (hasError) {
      console.log(chalk.red(`Waiting for changes to generate proper types`));
      return;
    }

    const mergedTranslations = reduceTranslations(
      translationsWithPaths.map(({ translations }) => translations),
    );
    await generateAndSaveTypes(mergedTranslations, args);
  };
}

async function generateAndSaveTypes(
  translations: I18nTranslation,
  args: GenerateTypesArguments,
) {
  const object = Object.keys(translations).reduce(
    (result, key) => mergeDeep(result, translations[key]),
    {},
  );

  const rawContent = await createTypesFile(object);

  const outputFile = annotateSourceCode(rawContent);

  fs.mkdirSync(path.dirname(args.typesOutputPath), {
    recursive: true,
  });

  let currentFileContent = null;
  try {
    currentFileContent = fs.readFileSync(args.typesOutputPath, 'utf8');
  } catch (err) {}

  if (currentFileContent != outputFile) {
    fs.writeFileSync(args.typesOutputPath, outputFile);
    console.log(`
        ${chalk.green(`Types generated and saved to: ${args.typesOutputPath}`)}
      `);
  } else {
    console.log(`
        ${chalk.yellow('No changes generated in a result output type file.')}
      `);
  }
}

function customDebounce(func: (...args) => void, wait: number) {
  let args = [];
  let timeoutId;
  return function (...rest) {
    // User formal parameters to make sure we add a slot even if a param
    // is not passed in
    if (func.length) {
      for (let i = 0; i < func.length; i++) {
        if (!args[i]) {
          args[i] = [];
        }
        args[i].push(rest[i]);
      }
    }
    // No formal parameters, just track the whole argument list
    else {
      args.push(...rest);
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      func.apply(this, args);
      args = [];
    }, wait);
  };
}

async function loadTranslations(
  loaders: {
    loader: I18nLoader<unknown>;
    path?: string;
  }[],
) {
  const loadedTranslations = (await Promise.all(
    loaders.map(({ loader }) => loader.load().catch((e) => e)),
  )) as I18nTranslation[];

  return loadedTranslations.map((translations, index) => {
    const error = translations instanceof Error;
    return {
      translations: error ? null : translations,
      error: error ? translations : null,
      path: loaders[index].path,
    };
  });
}

function validateInputParams(args: GenerateTypesArguments) {
  if (args.loaderType.length !== args.translationsPath.length) {
    console.log(
      chalk.red(
        `Error: translationsPath and loaderType must have the same number of elements.
           You provided ${args.loaderType.length} loader types and ${args.translationsPath.length} paths`,
      ),
    );
    process.exit(1);
  }
}

function validatePath(path: string, loaderType: string, index: number) {
  if (path === undefined) {
    console.log(
      chalk.red(
        `Error: translationsPath is not defined for loader type ${loaderType},
                 please provide a path to translations, index ${index}`,
      ),
    );
    process.exit(1);
  }
}

function getLoaderByType(loaderType: string, path: string) {
  switch (loaderType) {
    case 'json':
      return new I18nJsonLoader({
        path,
      });
    case 'yaml':
      return new I18nYamlLoader({
        path,
      });
    default:
      console.log(
        chalk.red(`Error: loader type ${loaderType} is not supported`),
      );
      process.exit(1);
  }
}

function reduceTranslations(translations: I18nTranslation[]) {
  return translations.reduce((acc, t) => mergeTranslations(acc, t), {});
}
