import { generateI18nTypes } from '../types-generator';
import { checkI18nTranslations } from './check-translations';


interface CliOptions {
  mode: 'generate' | 'check';
  path: string;
  out: string;
  format?: 'json' | 'yaml';
  pattern?: string;
  includeSubfolders?: boolean;
  watch: boolean;
}

interface ParsedCliOptions {
  options: CliOptions;
  warnings: string[];
}

const DEFAULT_PATH = 'i18n';
const DEFAULT_OUT = 'generated.ts';
const DEFAULT_FORMAT: NonNullable<CliOptions['format']> = 'json';
const CLI_VERSION = `v${require('../../package.json').version}`;
const HELP_ASCII_ART = `
███    ██ ███████ ███████ ████████      ██ ███████       ██  ██  █████  ███    ██
████   ██ ██      ██         ██         ██ ██            ██ ███ ██   ██ ████   ██
██ ██  ██ █████   ███████    ██         ██ ███████ █████ ██  ██  █████  ██ ██  ██
██  ██ ██ ██           ██    ██    ██   ██      ██       ██  ██ ██   ██ ██  ██ ██
██   ████ ███████ ███████    ██     █████  ███████       ██  ██  █████  ██   ████
`

export function renderLogoWithVersion(logo: string, version: string): string {
  const lines = logo.trimEnd().split('\n');

  if (lines.length === 0) {
    return logo;
  }

  const maxLineLength = Math.max(...lines.map((line) => line.length));
  lines[0] = `${lines[0].padEnd(maxLineLength + 2)}${version}`;

  return lines.join('\n');
}

export function getDefaultPattern(format: NonNullable<CliOptions['format']>): string {
  return format === 'yaml' ? '*.{yaml,yml}' : '*.json';
}

export function getOptionValue(args: string[], index: number, optionName: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith('-')) {
    throw new Error(`Missing value for ${optionName}. Use --help to see valid usage.`);
  }
  return value;
}

export function parseArgs(args: string[]): ParsedCliOptions {
  const options: CliOptions = {
    mode: 'generate',
    path: DEFAULT_PATH,
    out: DEFAULT_OUT,
    format: DEFAULT_FORMAT,
    includeSubfolders: true,
    pattern: undefined,
    watch: false,
  };
  const warnings: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    if (arg === 'check' || arg === '--check') {
      options.mode = 'check';
      continue;
    }

    if (arg === 'generate') {
      options.mode = 'generate';
      continue;
    }

    if (arg === '--path' || arg === '-p') {
      options.path = getOptionValue(args, i, arg);
      i++;
      continue;
    }

    if (arg === '--out' || arg === '-o') {
      options.out = getOptionValue(args, i, arg);
      i++;
      continue;
    }

    if (arg === '--format' || arg === '-f') {
      const format = getOptionValue(args, i, arg);
      if (format === 'json' || format === 'yaml') {
        options.format = format;
      } else {
        throw new Error(`Unsupported format "${format}". Use json or yaml.`);
      }
      i++;
      continue;
    }

    if (arg === '--pattern') {
      options.pattern = getOptionValue(args, i, arg);
      i++;
      continue;
    }

    if (arg === '--include-subfolders') {
      options.includeSubfolders = true;
      continue;
    }

    if (arg === '--no-include-subfolders') {
      options.includeSubfolders = false;
      continue;
    }

    if (arg === '--watch' || arg === '-w') {
      options.watch = true;
      continue;
    }

    if (!arg.startsWith('-')) {
      throw new Error(
        `Unexpected positional argument "${arg}". Use flags (for example: -p <dir>).`,
      );
    }

    warnings.push(`Unknown option: ${arg}`);
  }

  return { options, warnings };
}

export function renderHelp(): string {
  return (
    `${renderLogoWithVersion(HELP_ASCII_ART, CLI_VERSION)}\n\n` +
    `🌍 Generate TypeScript translation key types for nestjs-i18n.\n\n` +
    `📌 Usage:\n` +
    `  nestjs-i18n [options]\n` +
    `  nestjs-i18n check -p <dir> [options]\n\n` +
    `⚙️ Options:\n` +
    `  -p, --path <dir>                Translation root directory (default: ${DEFAULT_PATH})\n` +
    `  -o, --out <file>                Output .ts file (default: ${DEFAULT_OUT})\n` +
    `  -f, --format <json|yaml>        Translation format (default: ${DEFAULT_FORMAT})\n` +
    `      --pattern <glob>            Custom file glob; overrides default format pattern\n` +
    `      --include-subfolders        Scan nested language folders (default: true)\n` +
    `      --no-include-subfolders     Only scan direct child folders\n` +
    `  -w, --watch                     Watch translation files and regenerate on changes (default: false)\n` +
    `      --check                     Run key completeness check across all languages\n` +
    `  -h, --help                       Show this help\n\n` +
    `💡 Examples:\n` +
    `  nestjs-i18n\n` +
    `  nestjs-i18n -p src/i18n -o src/generated/i18n.generated.ts\n` +
    `  nestjs-i18n --format yaml --pattern '*.{yaml,yml}'\n` +
    `  nestjs-i18n --watch --no-include-subfolders\n\n` +
    `  nestjs-i18n check -p i18n\n` +
    `  nestjs-i18n check -p src/i18n --format yaml\n\n` +
    `📝 Notes:\n` +
    `  - Default file pattern for json: *.json\n` +
    `  - Default file pattern for yaml: *.{yaml,yml}\n` +
    `  - If --pattern is set, it is used as-is\n` +
    `  - Positional arguments are not supported; use flags\n` +
    `  - check mode exits with code 1 when missing keys are found\n`
  );
}

export function printHelp() {
  process.stdout.write(renderHelp());
}

export async function main() {
  const { options, warnings } = parseArgs(process.argv.slice(2));

  for (const warning of warnings) {
    process.stderr.write(`⚠️ ${warning}\n`);
  }

  if (!options.path || options.path === '' || !options.out) {
    printHelp();
    process.exit(1);
  }

  const selectedFormat = options.format ?? DEFAULT_FORMAT;
  const selectedPattern = options.pattern ?? getDefaultPattern(selectedFormat);

  if (options.mode === 'check') {
    if (options.watch) {
      process.stderr.write(`⚠️ --watch is ignored in check mode.\n`);
    }

    const checkResult = await checkI18nTranslations({
      path: options.path,
      format: selectedFormat,
      filePattern: selectedPattern,
      includeSubfolders: options.includeSubfolders,
      watch: false,
    });

    process.stdout.write(
      `🔎 Found languages: ${checkResult.languages.join(', ') || '(none)'}\n`,
    );

    if (checkResult.ok) {
      process.stdout.write(`✅ All languages contain the same translation keys.\n`);
      return;
    }

    for (const language of checkResult.languages) {
      const missingKeys = checkResult.missingByLanguage[language] ?? [];
      if (missingKeys.length === 0) {
        process.stdout.write(`✅ ${language}: complete\n`);
        continue;
      }

      process.stdout.write(`❌ ${language}: ${missingKeys.length} missing keys\n`);
      for (const key of missingKeys) {
        process.stdout.write(`   - ${key}\n`);
      }
    }

    process.stderr.write(`❌ Check failed with ${checkResult.totalMissing} missing entries.\n`);
    process.exit(1);
  }

  const result = await generateI18nTypes({
    path: options.path,
    output: options.out,
    format: selectedFormat,
    filePattern: selectedPattern,
    includeSubfolders: options.includeSubfolders,
    watch: options.watch,
  });

  if (result.written) {
    process.stdout.write(`✅ Types generated in: ${result.output}\n`);
  } else {
    process.stdout.write(`ℹ️ No changes detected in: ${result.output}\n`);
  }
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`❌ ${error?.message || error}\n`);
    process.exit(1);
  });
}
