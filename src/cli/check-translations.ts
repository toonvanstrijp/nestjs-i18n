import { I18nAbstractLoaderOptions, I18nJsonLoader, I18nYamlLoader } from '../loaders';
import { I18nTranslation } from '../interfaces';

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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function collectKeys(value: unknown, parentKey = ''): string[] {
  if (!isPlainObject(value)) {
    return parentKey ? [parentKey] : [];
  }

  const keys: string[] = [];

  for (const [key, nestedValue] of Object.entries(value)) {
    const nextKey = parentKey ? `${parentKey}.${key}` : key;
    if (isPlainObject(nestedValue)) {
      keys.push(...collectKeys(nestedValue, nextKey));
      continue;
    }
    keys.push(nextKey);
  }

  return keys;
}

function getLoader(options: CheckI18nTranslationsOptions) {
  if (options.format === 'yaml') {
    return new I18nYamlLoader(options);
  }

  return new I18nJsonLoader(options);
}

export async function checkI18nTranslations(
  options: CheckI18nTranslationsOptions,
): Promise<CheckI18nTranslationsResult> {
  const loader = getLoader(options);

  try {
    const rawLanguages = await loader.languages();
    const rawTranslations = await loader.load();
    const languages = rawLanguages as string[];
    const translations = rawTranslations as I18nTranslation;

    const allKeys = new Set<string>();
    const keysByLanguage: Record<string, Set<string>> = {};

    for (const language of languages) {
      const languageKeys = new Set(
        collectKeys((translations[language] as unknown) ?? {}),
      );

      keysByLanguage[language] = languageKeys;

      for (const key of languageKeys) {
        allKeys.add(key);
      }
    }

    const missingByLanguage: Record<string, string[]> = {};
    let totalMissing = 0;

    for (const language of languages) {
      const missingKeys = Array.from(allKeys)
        .filter((key) => !keysByLanguage[language].has(key))
        .sort();

      missingByLanguage[language] = missingKeys;
      totalMissing += missingKeys.length;
    }

    return {
      ok: totalMissing === 0,
      languages,
      missingByLanguage,
      totalMissing,
    };
  } finally {
    await loader.onModuleDestroy();
  }
}
