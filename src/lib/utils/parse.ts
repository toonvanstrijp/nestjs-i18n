import * as fs from 'fs';
import * as path from 'path';
import { I18nTranslation } from '../i18n.constants';
import * as flat from 'flat';
import { I18nOptions } from '..';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);
const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);

function mapAsync<T, U>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => Promise<U>,
): Promise<U[]> {
  return Promise.all(array.map(callbackfn));
}

async function filterAsync<T>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => Promise<boolean>,
): Promise<T[]> {
  const filterMap = await mapAsync(array, callbackfn);
  return array.filter((value, index) => filterMap[index]);
}

const isDirectory = async (source: string) =>
  (await lstat(source)).isDirectory();

export const getDirectories = async (source: string) => {
  const dirs = await readdir(source);
  return filterAsync(
    dirs.map(name => path.join(source, name)),
    isDirectory,
  );
};

const getFiles = async (dirPath: string, pattern: RegExp) => {
  const dirs = await readdir(dirPath, { withFileTypes: true });

  return (
    await filterAsync(dirs, async (f: fs.Dirent | string) => {
      try {
        if (typeof f === 'string') {
          return (await exists(path.join(dirPath, f))) && pattern.test(f);
        } else {
          return f.isFile() && pattern.test(f.name);
        }
      } catch {
        return false;
      }
    })
  ).map(f => path.join(dirPath, typeof f === 'string' ? f : f.name));
};

export async function getLanguages(options: I18nOptions) {
  const i18nPath = path.normalize(options.path + path.sep);

  return (await getDirectories(i18nPath)).map(dir =>
    path.relative(i18nPath, dir),
  );
}

export async function parseTranslations(
  options: I18nOptions,
): Promise<I18nTranslation> {
  const i18nPath = path.normalize(options.path + path.sep);

  const translations: I18nTranslation = {};

  if (!(await exists(i18nPath))) {
    throw new Error(`i18n path (${i18nPath}) cannot be found`);
  }

  if (!options.filePattern.match(/\*\.[A-z]+/)) {
    throw new Error(
      `filePattern should be formatted like: *.json, *.txt, *.custom etc`,
    );
  }

  const languages = await getLanguages(options);

  const pattern = new RegExp('.' + options.filePattern.replace('.', '.'));

  const files = await [
    ...languages.map(l => path.join(i18nPath, l)),
    i18nPath,
  ].reduce(async (files, path) => {
    (await files).push(...(await getFiles(path, pattern)));
    return files;
  }, Promise.resolve([]));

  for (const file of files) {
    let global = false;

    const key = path.dirname(path.relative(i18nPath, file)).split(path.sep)[0];

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
