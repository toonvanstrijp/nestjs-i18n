import { I18nError } from '../i18n.error';
import {
  I18nAbstractFileLoader,
  I18nAbstractFileLoaderOptions,
} from './i18n.abstract-file.loader';

export class I18nJsonLoader extends I18nAbstractFileLoader {
  constructor(options: I18nAbstractFileLoaderOptions) {
    super(options);
  }

  getDefaultOptions(): Partial<I18nAbstractFileLoaderOptions> {
    return {
      filePattern: '*.json',
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
