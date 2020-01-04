export const I18N_OPTIONS = 'I18nOptions';
export const I18N_TRANSLATIONS = 'I18nTranslations';
export const I18N_LANGUAGES = 'I18nLanguages';
export interface I18nTranslation {
  [key: string]: { [key: string]: string };
}
