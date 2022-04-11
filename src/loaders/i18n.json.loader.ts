import { I18nAbstractLoader } from './i18n.abstract.loader';

export class I18nJsonLoader extends I18nAbstractLoader {
  formatData(data: any) {
    return JSON.parse(data)
  }
}
