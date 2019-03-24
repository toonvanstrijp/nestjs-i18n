import { Inject, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as format from 'string-format';
import { I18N_PATH } from '../i18n.constants';

@Injectable()
export class I18nService {
  translations: { [key: string]: { [key: string]: string } } = {};

  private logger = new Logger('I18nService');

  constructor(
    @Inject(I18N_PATH)
    private readonly i18nPath: string,
  ) {
    if (!fs.existsSync(i18nPath)) {
      this.logger.error('i18n path does not exists');
    }

    glob(i18nPath + '**/*.json', (err: Error, files: string[]) => {
      files.map(file => {
        const key = path.parse(file).name;
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));

        for (const property of Object.keys(data)) {
          this.translations[key] = !!this.translations[key]
            ? this.translations[key]
            : {};

          if (!!this.translations[key][property]) {
            this.logger.error(
              `translation "${property}" already exists in language "${key}", change key from file: ${file}`,
            );
            return;
          }
          this.translations[key][property] = data[property];
        }
      });
      this.logger.log('Translation files setup');
    });
  }

  public translate(
    lang: string,
    key: string,
    args: Array<{ [k: string]: any } | string> = [],
  ) {
    try {
      let translation = this.translations[lang][key];
      if (translation === undefined || translation === null) {
        const message = `translation "${key}" in "${lang}" doesn't exist.`;
        this.logger.error(message);
        return message;
      }
      if (args && args.length > 0) {
        translation = format(translation, ...(args || []));
      }
      return translation;
    } catch (e) {
      return e.message;
    }
  }
}
