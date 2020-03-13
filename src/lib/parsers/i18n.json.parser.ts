import { I18nParser } from './i18n.parser';
import { I18N_PARSER_OPTIONS } from '../i18n.constants';
import { Inject } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { getDirectories, getFiles } from '../utils/file';
import * as flat from 'flat';
import { promisify } from 'util';
import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import { Observable } from 'rxjs';

const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);

export interface I18nJsonParserOptions {
  path: string;
  filePattern?: string;
}

const defaultOptions: Partial<I18nJsonParserOptions> = {
  filePattern: '*.json',
};

export class I18nJsonParser extends I18nParser<I18nJsonParserOptions> {
  constructor(
    @Inject(I18N_PARSER_OPTIONS)
    options: I18nJsonParserOptions,
  ) {
    super();
    this.options = this.sanitizeOptions(options);
  }

  async languages(): Promise<string[]> {
    const i18nPath = path.normalize(this.options.path + path.sep);
    return (await getDirectories(i18nPath)).map(dir =>
      path.relative(i18nPath, dir),
    );
  }

  async parse(): Promise<I18nTranslation | Observable<I18nTranslation>> {
    const i18nPath = path.normalize(this.options.path + path.sep);

    const translations: I18nTranslation = {};

    if (!(await exists(i18nPath))) {
      throw new Error(`i18n path (${i18nPath}) cannot be found`);
    }

    if (!this.options.filePattern.match(/\*\.[A-z]+/)) {
      throw new Error(
        `filePattern should be formatted like: *.json, *.txt, *.custom etc`,
      );
    }

    const languages = await this.languages();

    const pattern = new RegExp(
      '.' + this.options.filePattern.replace('.', '.'),
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

  private sanitizeOptions(options: I18nJsonParserOptions) {
    options = { ...defaultOptions, ...options };

    options.path = path.normalize(options.path + path.sep);
    if (!options.filePattern.startsWith('*.')) {
      options.filePattern = '*.' + options.filePattern;
    }

    return options;
  }
}
