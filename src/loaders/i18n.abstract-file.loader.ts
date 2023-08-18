import { I18nLoader } from './i18n.loader';
import * as path from 'path';
import { readFile } from 'fs/promises';
import { exists, getDirectories, getFiles } from '../utils/file';
import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import {
  Observable,
  Subject,
} from 'rxjs';

export interface I18nAbstractFileLoaderOptions {
  path: string;
  includeSubfolders?: boolean;
  filePattern?: string;
}

export abstract class I18nAbstractFileLoader
  extends I18nLoader<I18nAbstractFileLoaderOptions>
{
  private events: Subject<string> = new Subject();

  constructor(
      options: I18nAbstractFileLoaderOptions,
  ) {
    super(options);
    this.options = this.sanitizeOptions(options);
  }


  async languages(): Promise<string[] | Observable<string[]>> {
    return this.parseLanguages();
  }

  async load(): Promise<I18nTranslation | Observable<I18nTranslation>> {
    return this.parseTranslations();
  }

  protected async parseTranslations(): Promise<I18nTranslation> {
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

    const languages = await this.parseLanguages();

    const pattern = new RegExp(
      '.' + this.options.filePattern.replace('.', '.'),
    );

    const files = await [
      ...languages.map((l) => path.join(i18nPath, l)),
      i18nPath,
    ].reduce(async (f: Promise<string[]>, p: string) => {
      (await f).push(
        ...(await getFiles(p, pattern, this.options.includeSubfolders)),
      );
      return f;
    }, Promise.resolve([]));

    for (const file of files) {
      let global = false;

      const pathParts = path
        .dirname(path.relative(i18nPath, file))
        .split(path.sep);
      const key = pathParts[0];

      if (key === '.') {
        global = true;
      }

      // const data = JSON.parse(await readFile(file, 'utf8'));
      const data = this.formatData(await readFile(file, 'utf8'));

      const prefix = [...pathParts.slice(1), path.basename(file).split('.')[0]];

      for (const property of Object.keys(data)) {
        [...(global ? languages : [key])].forEach((lang) => {
          translations[lang] = translations[lang] ? translations[lang] : {};

          if (global) {
            translations[lang][property] = data[property];
          } else {
            this.assignPrefixedTranslation(
              translations[lang],
              prefix,
              property,
              data[property],
            );
          }
        });
      }
    }

    return translations;
  }

  protected assignPrefixedTranslation(
    translations: I18nTranslation | string,
    prefix: string[],
    property: string,
    value: string,
  ) {
    if (prefix.length) {
      translations[prefix[0]] = translations[prefix[0]]
        ? translations[prefix[0]]
        : {};
      this.assignPrefixedTranslation(
        translations[prefix[0]],
        prefix.slice(1),
        property,
        value,
      );
    } else {
      translations[property] = value;
    }
  }

  protected async parseLanguages(): Promise<string[]> {
    const i18nPath = path.normalize(this.options.path + path.sep);
    return (await getDirectories(i18nPath)).map((dir) =>
      path.relative(i18nPath, dir),
    );
  }

  protected sanitizeOptions(options: I18nAbstractFileLoaderOptions) {
    options = { ...this.getDefaultOptions(), ...options };

    options.path = path.normalize(options.path + path.sep);
    if (!options.filePattern.startsWith('*.')) {
      options.filePattern = '*.' + options.filePattern;
    }

    return options;
  }

  abstract formatData(data: any);
  abstract getDefaultOptions(): Partial<I18nAbstractFileLoaderOptions>;
}

