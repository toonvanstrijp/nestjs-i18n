import * as fs from 'fs';
import { lstatSync, readdirSync } from 'fs';
import * as path from 'path';
import { I18nTranslation } from '../i18n.constants';
import * as flat from 'flat';
import { I18nOptions } from '..';

const isDirectory = source => lstatSync(source).isDirectory();
export const getDirectories = source =>
  readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);

const getFiles = (dirPath: string, pattern: RegExp) =>
  fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter(f => f.isFile() && f.name.match(pattern))
    .map(f => path.join(dirPath, f.name));

export async function parseTranslations(
  options: I18nOptions,
): Promise<I18nTranslation> {
  return new Promise<I18nTranslation>((resolve, reject) => {
    const i18nPath = path.normalize(options.path + path.sep);

    const translations: I18nTranslation = {};

    if (!fs.existsSync(i18nPath)) {
      reject('i18n path does not exists');
    }

    if (!options.filePattern.match(/\*\.[A-z]+/)) {
      reject(
        `filePattern should be formatted like: *.json, *.txt, *.custom etc.`,
      );
    }

    const languages = getDirectories(i18nPath).map(dir =>
      path.relative(i18nPath, dir),
    );

    const pattern = new RegExp('.' + options.filePattern.replace('.', '.'));
    const files = [
      ...languages.map(l => path.join(i18nPath, l)),
      i18nPath,
    ].reduce((files, path) => {
      files.push(...getFiles(path, pattern));
      return files;
    }, []);

    files.map(file => {
      let global = false;

      const key = path
        .dirname(path.relative(i18nPath, file))
        .split(path.sep)[0];

      if (key === '.') {
        global = true;
      }

      const data = JSON.parse(fs.readFileSync(file, 'utf8'));

      const prefix = path.basename(file).split('.')[0];

      const flatData = flat.flatten(data);

      for (const property of Object.keys(flatData)) {
        [...(global ? languages : [key])].forEach(lang => {
          translations[lang] = !!translations[lang] ? translations[lang] : {};
          translations[lang][`${global ? '' : `${prefix}.`}${property}`] =
            flatData[property];
        });
      }
    });

    resolve(translations);
  });
}
