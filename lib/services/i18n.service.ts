import { Inject, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as format from 'string-format';
import { I18N_OPTIONS } from '../i18n.constants';
import { I18nOptions } from '../i18n.module';

@Injectable()
export class I18nService {
  translations: { [key: string]: { [key: string]: string } } = {};

  private logger = new Logger('I18nService');

  constructor(
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
  ) {
    if (!fs.existsSync(this.i18nOptions.path)) {
      this.logger.error('i18n path does not exists');
    }

    glob(this.i18nOptions.path + '**/*.json', (err: Error, files: string[]) => {
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
        if((this.i18nOptions.fallbackLanguage !== null || this.i18nOptions.fallbackLanguage !== undefined) && lang !== this.i18nOptions.fallbackLanguage) {
          return this.translate(this.i18nOptions.fallbackLanguage, key, args);
        }else {
          return message;
        }
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
