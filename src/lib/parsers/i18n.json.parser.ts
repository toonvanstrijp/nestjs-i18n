import { I18nParser } from './i18n.parser';
import { I18N_OPTIONS } from '../i18n.constants';
import { Inject } from '@nestjs/common';
import { I18nOptions } from '../interfaces/i18n-options.interface';
import * as path from 'path';
import * as fs from 'fs';
import { getDirectories, getFiles } from '../utils/parse';
import * as flat from 'flat';
import { promisify } from 'util';
import { I18nTranslation } from '../interfaces/i18n-translation.interface';

const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);

export class I18nJsonParser implements I18nParser {
  constructor(
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
  ) {}

  async languages(): Promise<string[]> {
    const i18nPath = path.normalize(this.i18nOptions.path + path.sep);
    return (await getDirectories(i18nPath)).map(dir =>
      path.relative(i18nPath, dir),
    );
  }

  async parse(): Promise<I18nTranslation> {
    const i18nPath = path.normalize(this.i18nOptions.path + path.sep);

    const translations: I18nTranslation = {};

    if (!(await exists(i18nPath))) {
      throw new Error(`i18n path (${i18nPath}) cannot be found`);
    }

    if (!this.i18nOptions.filePattern.match(/\*\.[A-z]+/)) {
      throw new Error(
        `filePattern should be formatted like: *.json, *.txt, *.custom etc`,
      );
    }

    const languages = await this.languages();

    const pattern = new RegExp(
      '.' + this.i18nOptions.filePattern.replace('.', '.'),
    );

    const files = await [
      ...languages.map(l => path.join(i18nPath, l)),
      i18nPath,
    ].reduce(async (files, path) => {
      (await files).push(...(await getFiles(path, pattern)));
      return files;
    }, Promise.resolve([]));

    for (const file of files) {
      let global = false;

      const key = path
        .dirname(path.relative(i18nPath, file))
        .split(path.sep)[0];

      if (key === '.') {
        global = true;
      }

      const data = JSON.parse(await readFile(file, 'utf8'));

      const prefix = path.basename(file).split('.')[0];

      const flatData = flat.flatten(data);

      for (const property of Object.keys(flatData)) {
        [...(global ? languages : [key])].forEach(lang => {
          translations[lang] = !!translations[lang] ? translations[lang] : {};
          translations[lang][`${global ? '' : `${prefix}.`}${property}`] =
            flatData[property];
        });
      }
    }

    return translations;
  }
}
