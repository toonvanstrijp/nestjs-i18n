import { I18nAbstractLoaderOptions } from '../loaders';

type LoaderFormat = 'json' | 'yaml';

export interface GenerateI18nTypesOptions extends I18nAbstractLoaderOptions {
  output: string;
  format?: LoaderFormat;
}

export interface GenerateI18nTypesResult {
  output: string;
  written: boolean;
}
