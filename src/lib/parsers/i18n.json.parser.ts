import { I18nParser } from './i18n.parser';
import { I18N_PARSER_OPTIONS } from '../i18n.constants';
import { Inject, OnModuleDestroy } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { getDirectories, getFiles } from '../utils/file';
import * as flat from 'flat';
import { promisify } from 'util';
import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import {
  Observable,
  Subject,
  merge as ObservableMerge,
  from as ObservableFrom,
} from 'rxjs';
import * as chokidar from 'chokidar';
import { switchMap } from 'rxjs/operators';
const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);

export interface I18nJsonParserOptions {
  path: string;
  filePattern?: string;
  watch?: boolean;
}

const defaultOptions: Partial<I18nJsonParserOptions> = {
  filePattern: '*.json',
  watch: false,
};

export class I18nJsonParser extends I18nParser<I18nJsonParserOptions>
  implements OnModuleDestroy {
  private watcher?: chokidar.FSWatcher;

  private events: Subject<string> = new Subject();

  constructor(
    @Inject(I18N_PARSER_OPTIONS)
    options: I18nJsonParserOptions,
  ) {
    super();
    this.options = this.sanitizeOptions(options);

    if (this.options.watch) {
      this.watcher = chokidar
        .watch(this.options.path, { ignoreInitial: true })
        .on('all', event => {
          this.events.next(event);
        });
    }
  }

  async onModuleDestroy() {
    if (this.watcher) {
      await this.watcher.close();
    }
  }

  async languages(): Promise<string[] | Observable<string[]>> {
    if (this.options.watch) {
      return ObservableMerge(
        ObservableFrom(this.parseLanguages()),
        this.events.pipe(switchMap(() => this.parseLanguages())),
      );
    }
    return this.parseLanguages();
  }

  async parse(): Promise<I18nTranslation | Observable<I18nTranslation>> {
    if (this.options.watch) {
      return ObservableMerge(
        ObservableFrom(this.parseTranslations()),
        this.events.pipe(switchMap(() => this.parseTranslations())),
      );
    }
    return this.parseTranslations();
  }

  private async parseTranslations(): Promise<I18nTranslation> {
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

  private async parseLanguages(): Promise<string[]> {
    const i18nPath = path.normalize(this.options.path + path.sep);
    return (await getDirectories(i18nPath)).map(dir =>
      path.relative(i18nPath, dir),
    );
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
