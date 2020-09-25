export interface I18nTranslation {
  [key: string]: { [key: string]: I18nTranslation | string } | string;
}
