import { I18nLoader } from './i18n.loader';
import { I18N_LOADER_OPTIONS } from '../i18n.constants';
import { Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import path from 'path';
import { readFile } from 'fs/promises';
import { exists, getDirectories, getFiles } from '../utils';
import { I18nTranslation } from '../interfaces';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  from,
  merge as ObservableMerge,
  of as ObservableOf,
  switchMap,
} from 'rxjs';
import chokidar from 'chokidar';
import { I18nError } from '../i18n.error';


// merge options
export interface I18nAbstractLoaderOptions {
  path: string;
  includeSubfolders?: boolean;
  filePattern?: string;
  watch: boolean;
}

export abstract class I18nAbstractLoader
  extends I18nLoader
  implements OnModuleDestroy
{
  private readonly logger = new Logger(I18nAbstractLoader.name);

  private watcher?: chokidar.FSWatcher;

  private events: Subject<{ event: string; filePath: string }> = new Subject();

  private languagesCache: string[] | null = null;

  constructor(
    @Inject(I18N_LOADER_OPTIONS)
    private options: I18nAbstractLoaderOptions,
  ) {
    super();
    this.options = this.sanitizeOptions(options);

    if (this.options.watch) {
      this.watcher = chokidar
        .watch(this.options.path, { ignoreInitial: true })
        .on('all', (event, filePath) => {
          this.events.next({
            event,
            filePath,
          });
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
        ObservableOf(await this.parseLanguages()),
        this.events.pipe(
          switchMap(() =>
            from(this.parseLanguages()).pipe(
              catchError((error) => {
                this.logger.error(
                  'Error while parsing i18n languages. Ignoring this change.',
                  error,
                );
                return EMPTY;
              }),
            ),
          ),
        ),
      );
    }
    return this.parseLanguages();
  }

  async load(): Promise<I18nTranslation | Observable<I18nTranslation>> {
    if (this.options.watch) {
      return ObservableMerge(
        ObservableOf(await this.parseTranslations()),
        this.events.pipe(
          switchMap((eventInfo) =>
            from(this.parseTranslations(eventInfo)).pipe(
              catchError((error) => {
                this.logger.error(
                  'Error while parsing i18n translations. Ignoring this change.',
                  error,
                );
                return EMPTY;
              }),
            ),
          ),
        ),
      );
    }
    return this.parseTranslations();
  }

  protected async parseTranslations(
    eventInfo?: { event: string; filePath: string },
  ): Promise<I18nTranslation> {
    const i18nPath = path.normalize(this.options.path + path.sep);

    const translations: I18nTranslation = {};

    if (!(await exists(i18nPath))) {
      throw new I18nError(`i18n path (${i18nPath}) cannot be found`);
    }

    const shouldRefreshLanguages =
      !eventInfo || eventInfo.event === 'addDir' || eventInfo.event === 'unlinkDir';
    const languages = shouldRefreshLanguages
      ? await this.parseLanguages()
      : await this.getCachedLanguages();

    const pattern = this.parseFilePattern(this.options.filePattern!);

    const files = await [
      ...languages.map((l) => path.join(i18nPath, l)),
      i18nPath,
    ].reduce(async (f: Promise<string[]>, p: string) => {
      (await f).push(
        ...(await getFiles(p, pattern, this.options.includeSubfolders ?? false)),
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

      let data: any;
      try {
        data = this.formatData(await readFile(file, 'utf8'));
      } catch (e) {
        const error = e as Error;
        throw new I18nError(
          `Error parsing translation file "${file}": ${error.message}`,
        );
      }

      const prefix = [...pathParts.slice(1), path.basename(file).split('.')[0]];

      for (const property of Object.keys(data)) {
        [...(global ? languages : [key])].forEach((lang) => {
          if (!translations[lang] || typeof translations[lang] === 'string') {
            translations[lang] = {};
          }

          const langTranslations = translations[lang] as I18nTranslation;

          if (global) {
            langTranslations[property] = data[property];
          } else {
            this.assignPrefixedTranslation(
              langTranslations,
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
    translations: I18nTranslation,
    prefix: string[],
    property: string,
    value: any,
  ) {
    if (prefix.length) {
      const [currentPrefix, ...nextPrefixes] = prefix;
      const currentValue = translations[currentPrefix];

      if (!currentValue || typeof currentValue === 'string') {
        translations[currentPrefix] = {};
      }

      this.assignPrefixedTranslation(
        translations[currentPrefix] as I18nTranslation,
        nextPrefixes,
        property,
        value,
      );
    } else {
      translations[property] = value;
    }
  }

  protected async parseLanguages(): Promise<string[]> {
    const i18nPath = path.normalize(this.options.path + path.sep);
    this.languagesCache = (await getDirectories(i18nPath)).map((dir) =>
      path.relative(i18nPath, dir),
    );
    return this.languagesCache;
  }

  private async getCachedLanguages(): Promise<string[]> {
    if (this.languagesCache) {
      return this.languagesCache;
    }

    return this.parseLanguages();
  }

  protected sanitizeOptions(options: I18nAbstractLoaderOptions) {
    options = { ...this.getDefaultOptions(), ...options };

    options.path = path.normalize(options.path + path.sep);
    options.filePattern = options.filePattern ?? '*.json';

    if (!options.filePattern.startsWith('*.')) {
      options.filePattern = '*.' + options.filePattern;
    }

    return options;
  }

  private parseFilePattern(filePattern: string): RegExp {
    const singleExtensionPattern = /^\*\.([A-Za-z0-9_-]+)$/;
    const groupedExtensionPattern = /^\*\.\{([^}]+)\}$/;

    const singleExtensionMatch = filePattern.match(singleExtensionPattern);

    if (singleExtensionMatch) {
      return new RegExp(`^.*\\.${singleExtensionMatch[1]}$`);
    }

    const groupedExtensionMatch = filePattern.match(groupedExtensionPattern);

    if (!groupedExtensionMatch) {
      throw new I18nError(
        `filePattern should be formatted like: *.json, *.txt or *.{yaml,yml}`,
      );
    }

    const extensions = groupedExtensionMatch[1]
      .split(/[,|]/)
      .map((extension) => extension.trim())
      .filter((extension) => extension.length > 0);

    if (
      extensions.length === 0 ||
      extensions.some((extension) => !extension.match(/^[A-Za-z0-9_-]+$/))
    ) {
      throw new I18nError(
        `filePattern should be formatted like: *.json, *.txt or *.{yaml,yml}`,
      );
    }

    return new RegExp(`^.*\\.(${extensions.join('|')})$`);
  }

  abstract formatData(data: any): any;
  abstract getDefaultOptions(): Partial<I18nAbstractLoaderOptions>;
}
