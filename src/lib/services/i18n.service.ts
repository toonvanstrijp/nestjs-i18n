import { Inject, Injectable, Logger } from '@nestjs/common';
import * as format from 'string-format';
import {
  I18N_OPTIONS,
  I18N_TRANSLATIONS,
  I18nTranslation,
} from '../i18n.constants';
import { I18nOptions } from '..';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

@Injectable()
export class I18nService {
  constructor(
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
    @Inject(I18N_TRANSLATIONS)
    private readonly translations: I18nTranslation,
    private readonly logger: Logger,
  ) {}

  public translate(
    key: string,
    options?: {
      lang?: string;
      args?: Array<{ [k: string]: any } | string> | { [k: string]: any };
    },
  ) {
    options = {
      lang: this.i18nOptions.fallbackLanguage,
      ...options,
    };

    const { lang, args } = options;

    const translationsByLanguage = this.translations[lang];

    if (
      translationsByLanguage === undefined ||
      translationsByLanguage === null ||
      (!!translationsByLanguage && !translationsByLanguage.hasOwnProperty(key))
    ) {
      // and now we detect, if this should also be added to the MISSING file
      if (this.i18nOptions.saveMissing === true) {
        this.saveMissingTranslation(key, lang);
      }

      if (lang !== this.i18nOptions.fallbackLanguage) {
        const message = `Translation "${key}" in "${lang}" does not exist.`;
        this.logger.error(message);

        return this.translate(key, {
          lang: this.i18nOptions.fallbackLanguage,
          args: args,
        });
      }
    }

    let translation = translationsByLanguage[key];

    if (args || (args instanceof Array && args.length > 0)) {
      translation = format(
        translation,
        ...(args instanceof Array ? args || [] : [args]),
      );
    }
    return translation || key;
  }

  private saveMissingTranslation(key: string, language: string) {
    const filePathMissing = path.join(this.i18nOptions.path, language);
    if (!fs.existsSync(filePathMissing)) {
      this.logger.error(`Cannot find path to store missing translations`);
      return;
    }

    const keyParts = key.split('.');
    const filePart = keyParts.shift();
    const keyWithoutFile = keyParts.join('.');

    const filePath = path.join(filePathMissing, `${filePart}.missing`);

    // first we get the content of the file
    let jsonContent = {};
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
      jsonContent = JSON.parse(fileContent);
    }

    // check if the key is already present in our file
    // so we must not save the file again
    if (_.has(jsonContent, keyWithoutFile)) {
      return;
    }

    // and now we add the missing key
    jsonContent = _.set(jsonContent, keyWithoutFile, '');

    fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
    this.logger.error(
      `The key "${keyWithoutFile}" for language: ${language} was added to the file "${filePart}.missing" (@ ${filePath} )`,
    );
  }
}
