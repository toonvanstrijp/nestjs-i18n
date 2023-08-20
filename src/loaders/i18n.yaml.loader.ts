import {
  I18nAbstractFileLoader,
  I18nAbstractFileLoaderOptions,
} from './i18n.abstract-file.loader';
import yaml from 'js-yaml';

export class I18nYamlLoader extends I18nAbstractFileLoader {
  getDefaultOptions(): Partial<I18nAbstractFileLoaderOptions> {
    return {
      filePattern: '*.yml',
    };
  }

  formatData(data: any, sourceFileName: string) {
    try {
      return yaml.load(data, { json: true });
    } catch (e) {
      if (e instanceof yaml.YAMLException) {
        throw new Error(
          `Invalid YAML file - ${sourceFileName}. Please check your YAML syntax.`,
        );
      }

      throw e;
    }
  }
}
