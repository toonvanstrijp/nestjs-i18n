import { I18nAbstractLoader, I18nAbstractLoaderOptions } from './i18n.abstract.loader';

export class I18nJsonLoader extends I18nAbstractLoader {
  getDefaultOptions(): Partial<I18nAbstractLoaderOptions> {
    return {
      filePattern: '*.json',
      watch: false,
    };
  }
  formatData(data: any) {
    return JSON.parse(data)
  }
}
