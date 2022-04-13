import {
  I18nAbstractLoader,
  I18nAbstractLoaderOptions,
} from './i18n.abstract.loader';
import * as yaml from 'js-yaml';

export class I18nYamlLoader extends I18nAbstractLoader {
  formatData(data: any) {
    return yaml.load(data, { json: true });
  }
  getDefaultOptions(): Partial<I18nAbstractLoaderOptions> {
    return {
      filePattern: '*.yml',
      watch: false,
    };
  }
}
