import { I18nError } from '../i18n.error';
import {
  I18nAbstractLoader,
  I18nAbstractLoaderOptions,
} from './i18n.abstract.loader';
import * as yaml from 'js-yaml';

export class I18nYamlLoader extends I18nAbstractLoader {
  getDefaultOptions(): Partial<I18nAbstractLoaderOptions> {
    return {
      filePattern: '*.yml',
      watch: false,
    };
  }

  formatData(data: any) {
    try {
      return yaml.load(data, { json: true });
    } catch (e) {
      if (e instanceof yaml.YAMLException) {
        throw new I18nError(
          'Invalid YAML file. Please check your YAML syntax.',
        );
      }

      throw e;
    }
  }
}
