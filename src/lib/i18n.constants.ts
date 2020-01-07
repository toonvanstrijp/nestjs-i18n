export const I18N_OPTIONS = 'I18nOptions';
export const I18N_TRANSLATIONS = 'I18nTranslations';
export const I18N_LANGUAGES = 'I18nLanguages';
export const I18N_RESOLVER_OPTIONS = 'I18nResolverOptions';
export const I18N_RESOLVERS = 'I18nResolvers';
export interface I18nTranslation {
  [key: string]: { [key: string]: string };
}
