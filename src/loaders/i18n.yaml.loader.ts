import { I18nError } from '../i18n.error';
import {
  I18nAbstractLoader,
  I18nAbstractLoaderOptions,
} from './i18n.abstract.loader';
import yaml from 'yaml';
import { readFile } from 'fs/promises';

export class I18nYamlLoader extends I18nAbstractLoader {
  getDefaultOptions(): Partial<I18nAbstractLoaderOptions> {
    return {
      filePattern: '*.{yaml,yml}',
      watch: false,
    };
  }

  protected override async parseFile(file: string): Promise<any> {
    try {
      const data = await readFile(file, 'utf8');
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
