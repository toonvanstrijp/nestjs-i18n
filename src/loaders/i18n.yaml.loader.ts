import { I18nAbstractLoader } from './i18n.abstract.loader';
import * as yaml from 'js-yaml'

export class I18nYamlLoader extends I18nAbstractLoader {
  formatData(data: any) {
    return yaml.load(data, { json: true })
  }
}
