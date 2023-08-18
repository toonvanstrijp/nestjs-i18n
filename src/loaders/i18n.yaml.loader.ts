import {
  I18nAbstractFileLoader,
  I18nAbstractFileLoaderOptions,
} from './i18n.abstract-file.loader';
import * as yaml from 'js-yaml';

export class I18nYamlLoader extends I18nAbstractFileLoader {

  getDefaultOptions(): Partial<I18nAbstractFileLoaderOptions> {
    return {
      filePattern: '*.yml',
      watch: false,
    };
  }

  formatData(data: any) {
    try{
    return yaml.load(data, { json: true });
    }
    catch(e){
      if(e instanceof yaml.YAMLException){
        throw new Error(
          'Invalid YAML file. Please check your YAML syntax.'
        );
      }

      throw e;
    }
  }
}
