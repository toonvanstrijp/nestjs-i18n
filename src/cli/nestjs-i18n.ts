#!/usr/bin/env node

import { Command } from 'commander';
import { generateI18nTypes } from '../types-generator';
import { I18nJsonLoader, I18nYamlLoader } from '../loaders';
import { I18nTranslation } from '../interfaces';

type CheckResult = {
  language: string;
  missingKeys: string[];
  extraKeys: string[];
};

function flattenKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...flattenKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }

  return keys;
}

function getTranslationKeys(translations: I18nTranslation, language: string): string[] {
  const languageTranslations = translations[language];
  if (!languageTranslations) {
    return [];
  }
  return flattenKeys(languageTranslations);
}

function checkTranslations(translations: I18nTranslation, baseLanguage: string) {
  const languages = Object.keys(translations);
  const baseKeys = new Set(getTranslationKeys(translations, baseLanguage));

  const results: CheckResult[] = [];

  for (const language of languages) {
    if (language === baseLanguage) {
      continue;
    }

    const langKeys = new Set(getTranslationKeys(translations, language));

    const missingKeys = Array.from(baseKeys).filter((key) => !langKeys.has(key));
    const extraKeys = Array.from(langKeys).filter((key) => !baseKeys.has(key));

    results.push({
      language,
      missingKeys,
      extraKeys,
    });
  }

  const isValid = results.every((result) => result.missingKeys.length === 0 && result.extraKeys.length === 0);

  return {
    baseLanguage,
    results,
    isValid,
  };
}

async function main() {
  const program = new Command();

  program
    .name('nestjs-i18n')
    .description('CLI for i18n type generation and translation checking')
    .version('1.0.0');

  program
    .command('types')
    .alias('t')
    .description('Generate TypeScript types from translation files')
    .requiredOption('--path <path>', 'Path to translations directory')
    .requiredOption('--out <output>', 'Output file path for generated types')
    .option('--format <format>', 'Translation file format (json|yaml)', 'json')
    .option('--pattern <pattern>', 'File pattern, for example: *.json')
    .option('--include-subfolders', 'Parse translations recursively')
    .action(async (options) => {
      await handleGenerateTypes(options);
    });

  program
    .command('check')
    .alias('c')
    .description('Check translation consistency across languages')
    .requiredOption('--path <path>', 'Path to translations directory')
    .option('--format <format>', 'Translation file format (json|yaml)', 'json')
    .option('--pattern <pattern>', 'File pattern, for example: *.json')
    .option('--include-subfolders', 'Parse translations recursively')
    .action(async (options) => {
      await handleCheck(options);
    });

  await program.parseAsync(process.argv);
}

async function handleCheck(options: any) {
  const loader =
    options.format === 'yaml'
      ? new I18nYamlLoader({
          path: options.path,
          filePattern: options.pattern,
          includeSubfolders: options.includeSubfolders,
        })
      : new I18nJsonLoader({
          path: options.path,
          filePattern: options.pattern,
          includeSubfolders: options.includeSubfolders,
        });

  try {
    const loaded = await loader.load();
    const translations: I18nTranslation =
      loaded && typeof (loaded as any).subscribe === 'function'
        ? await new Promise((resolve) => {
            (loaded as any).subscribe((value: I18nTranslation) => {
              resolve(value);
            });
          })
        : (loaded as I18nTranslation);

    const languages = Object.keys(translations);
    if (languages.length === 0) {
      process.stdout.write('No translation files found.\n');
      process.exit(1);
    }

    const baseLanguage = languages[0];
    const report = checkTranslations(translations, baseLanguage);

    if (report.isValid) {
      process.stdout.write('\x1b[32m✓ All translations are consistent!\x1b[0m\n');
      process.stdout.write(`Base language: ${baseLanguage}\n`);
      process.stdout.write(`Languages checked: ${languages.join(', ')}\n`);
      process.exit(0);
    } else {
      process.stdout.write('\x1b[31m✗ Translation inconsistencies found:\x1b[0m\n\n');
      process.stdout.write(`Base language: ${baseLanguage}\n\n`);

      for (const result of report.results) {
        process.stdout.write(`\x1b[33m${result.language}:\x1b[0m\n`);

        if (result.missingKeys.length > 0) {
          process.stdout.write(`  \x1b[31mMissing keys (${result.missingKeys.length}):\x1b[0m\n`);
          result.missingKeys.slice(0, 10).forEach((key) => {
            process.stdout.write(`    - ${key}\n`);
          });
          if (result.missingKeys.length > 10) {
            process.stdout.write(`    ... and ${result.missingKeys.length - 10} more\n`);
          }
        }

        if (result.extraKeys.length > 0) {
          process.stdout.write(`  \x1b[36mExtra keys (${result.extraKeys.length}):\x1b[0m\n`);
          result.extraKeys.slice(0, 10).forEach((key) => {
            process.stdout.write(`    - ${key}\n`);
          });
          if (result.extraKeys.length > 10) {
            process.stdout.write(`    ... and ${result.extraKeys.length - 10} more\n`);
          }
        }

        process.stdout.write('\n');
      }

      process.exit(1);
    }
  } finally {
    if (typeof (loader as any).onModuleDestroy === 'function') {
      await (loader as any).onModuleDestroy();
    }
  }
}

async function handleGenerateTypes(options: any) {
  const result = await generateI18nTypes({
    path: options.path,
    outputPath: options.out,
    format: options.format,
    filePattern: options.pattern,
    includeSubfolders: options.includeSubfolders,
    watch: false,
  });

  if (result.written) {
    process.stdout.write(`Types generated in: ${result.outputPath}\n`);
  } else {
    process.stdout.write(`No changes detected in: ${result.outputPath}\n`);
  }
  process.exit(0);
}

main().catch((error) => {
  process.stderr.write(`${error?.message || error}\n`);
  process.exit(1);
});
