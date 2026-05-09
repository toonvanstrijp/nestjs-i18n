import { I18nAbstractLoaderOptions } from '../loaders';

type LoaderFormat = 'json' | 'yaml';

export interface CheckI18nTranslationsOptions extends I18nAbstractLoaderOptions {
  format?: LoaderFormat;
}

export interface CheckI18nTranslationsResult {
  ok: boolean;
  languages: string[];
  missingByLanguage: Record<string, string[]>;
  totalMissing: number;
}
