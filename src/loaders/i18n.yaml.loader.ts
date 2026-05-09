import { I18nError } from '../i18n.error';
import {
  I18nAbstractLoader,
  I18nAbstractLoaderOptions,
} from './i18n.abstract.loader';
import yaml from 'yaml';

export class I18nYamlLoader extends I18nAbstractLoader {
  getDefaultOptions(): Partial<I18nAbstractLoaderOptions> {
    return {
      filePattern: '*.{yaml,yml}',
      watch: false,
    };
  }

  formatData(data: any) {
    try {
      return yaml.parse(data);
    } catch (e: any) {

      // yaml.parse throws YAMLParseError on error
      if (e && e.name === 'YAMLParseError') {
        throw new I18nError(
          'Invalid YAML file. Please check your YAML syntax.',
        );
      }

      throw e;
    }
  }
}
