#!/usr/bin/env node

import { generateI18nTypes } from '../types-generator';

type CliOptions = {
  path?: string;
  out?: string;
  format?: 'json' | 'yaml';
  pattern?: string;
  includeSubfolders?: boolean;
};

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    if (arg === '--path') {
      options.path = next;
      i++;
      continue;
    }

    if (arg === '--out') {
      options.out = next;
      i++;
      continue;
    }

    if (arg === '--format') {
      if (next === 'json' || next === 'yaml') {
        options.format = next;
      }
      i++;
      continue;
    }

    if (arg === '--pattern') {
      options.pattern = next;
      i++;
      continue;
    }

    if (arg === '--include-subfolders') {
      options.includeSubfolders = true;
    }
  }

  return options;
}

function printHelp() {
  process.stdout.write(
    `Usage: nestjs-i18n --path <translationsPath> --out <outputFile> [options]\n\n`,
  );
  process.stdout.write(`Options:\n`);
  process.stdout.write(
    `  --format <json|yaml>        Translation file format (default: json)\n`,
  );
  process.stdout.write(
    `  --pattern <glob>            File pattern, for example: *.json\n`,
  );
  process.stdout.write(
    `  --include-subfolders        Parse translations recursively\n`,
  );
  process.stdout.write(`  --help, -h                  Show this help\n`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.path || !args.out) {
    printHelp();
    process.exit(1);
  }

  const result = await generateI18nTypes({
    path: args.path,
    outputPath: args.out,
    format: args.format,
    filePattern: args.pattern,
    includeSubfolders: args.includeSubfolders,
    watch: false,
  });

  if (result.written) {
    process.stdout.write(`Types generated in: ${result.outputPath}\n`);
  } else {
    process.stdout.write(`No changes detected in: ${result.outputPath}\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`${error?.message || error}\n`);
  process.exit(1);
});
