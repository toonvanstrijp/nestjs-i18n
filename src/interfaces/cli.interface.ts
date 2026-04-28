export interface CliOptions {
  mode: 'generate' | 'check';
  path: string;
  out: string;
  format?: 'json' | 'yaml';
  pattern?: string;
  includeSubfolders?: boolean;
  watch: boolean;
}

export interface ParsedCliOptions {
  options: CliOptions;
  warnings: string[];
}
