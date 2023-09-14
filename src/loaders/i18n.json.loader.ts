import { I18nError } from '../i18n.error';
import {
  I18nAbstractLoader,
  I18nAbstractLoaderOptions,
} from './i18n.abstract.loader';

export class I18nJsonLoader extends I18nAbstractLoader {
  getDefaultOptions(): Partial<I18nAbstractLoaderOptions> {
    return {
      filePattern: '*.json',
      watch: false,
    };
  }
  formatData(data: any) {
    try {
      return JSON.parse(data);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new I18nError(
          'Invalid JSON file. Please check your JSON syntax.',
        );
      }
      throw e;
    }
  }
}
