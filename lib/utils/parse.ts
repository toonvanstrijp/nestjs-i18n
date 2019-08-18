import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { I18nTranslation } from '../i18n.constants';
import * as flat from 'flat';
import { lstatSync, readdirSync } from 'fs';
import { I18nOptions } from '../interfaces/i18n-options.interface';

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);

export async function parseTranslations(
  options: I18nOptions,
): Promise<I18nTranslation> {
  return new Promise<I18nTranslation>((resolve, reject) => {
    const i18nPath = path.normalize(options.path + path.sep);

    const translations: I18nTranslation = {};

    if (!fs.existsSync(i18nPath)) {
      reject('i18n path does not exists');
    }

    const languages = getDirectories(i18nPath).map(dir =>
      path.relative(i18nPath, dir),
    );

    glob(
      i18nPath + '**/' + options.filePattern,
      (err: Error, files: string[]) => {
        if (err) {
          return reject(err);
        }

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
              translations[lang] = !!translations[lang]
                ? translations[lang]
                : {};
              translations[lang][`${prefix}.${property}`] = flatData[property];
            });
          }
        });

        resolve(translations);
      },
    );
  });
}
