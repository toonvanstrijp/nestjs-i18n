export const I18N_OPTIONS = 'I18nOptions';
export const I18N_TRANSLATIONS = 'I18nTranslations';
export const I18N_LANGUAGES = 'I18nLanguages';
export const I18N_RESOLVER_OPTIONS = 'I18nResolverOptions';
export const I18N_RESOLVERS = 'I18nResolvers';
export const I18N_LOADER_OPTIONS = 'I18nLoaderOptions';
export const I18N_LOADERS = 'I18nLoaders';

// private constants
export const I18N_LANGUAGES_SUBJECT = 'I18nLanguagesSubject';
export const I18N_TRANSLATIONS_SUBJECT = 'I18nTranslationsSubject';

// Execution context types
export enum ExecutionContextType {
  HTTP = 'http',
  GRAPHQL = 'graphql',
  RPC = 'rpc',
  WS = 'ws',
  RMQ = 'rmq',
}

export const SUPPORTED_CONTEXT_TYPES = [
  ExecutionContextType.HTTP,
  ExecutionContextType.GRAPHQL,
  ExecutionContextType.RPC,
  ExecutionContextType.RMQ,
  ExecutionContextType.WS,
] as const;

// Plural form keys (CLDR format)
export enum PluralKey {
  ZERO = 'zero',
  ONE = 'one',
  TWO = 'two',
  FEW = 'few',
  MANY = 'many',
  OTHER = 'other',
}

export const PLURAL_KEYS = [
  PluralKey.ZERO,
  PluralKey.ONE,
  PluralKey.TWO,
  PluralKey.FEW,
  PluralKey.MANY,
  PluralKey.OTHER,
] as const;

// Transform pipe names
export enum TransformPipeName {
  UPPERCASE = 'uppercase',
  LOWERCASE = 'lowercase',
  CAPITALIZE = 'capitalize',
}

// Separator defaults
export const DEFAULT_KEY_SEPARATOR = '.';
export const DEFAULT_NAMESPACE_SEPARATOR = false;

// Regex patterns and separators
export const TEMPLATE_PLACEHOLDER_REGEX = /\{\{\s*([^{}]+?)\s*\}\}/g;
export const PIPE_SEPARATOR = '|';
export const NESTED_TRANSLATION_REGEX = /\$t\((.*?)(,(.*?))?\)/g;
export const TRANSFORM_PLACEHOLDER_PREFIX = '__i18n_transform_';

// Framework/runtime constants
export const FASTIFY_ADAPTER_NAME = 'fastify';
export const TYPEOF_OBJECT = 'object';
