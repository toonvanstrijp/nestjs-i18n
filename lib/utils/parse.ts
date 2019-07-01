import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { I18nTranslation } from '../i18n.constants';
import * as flat from 'flat';

export async function parseTranslations(
  i18nPath: string,
): Promise<I18nTranslation> {
  return new Promise<I18nTranslation>((resolve, reject) => {
    const translations: I18nTranslation = {};

    if (!fs.existsSync(i18nPath)) {
      reject('i18n path does not exists');
    }

    glob(i18nPath + '**/*.json', (err: Error, files: string[]) => {
      if (err) {
        return reject(err);
      }
      files.map(file => {
        const key = path.parse(file).name;
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));

        const flatData = flat.flatten(data);

        for (const property of Object.keys(flatData)) {
          translations[key] = !!translations[key] ? translations[key] : {};

          if (!!translations[key][property]) {
            reject(
              `translation "${property}" already exists in language "${key}", change key from file: ${file}`,
            );
            return;
          }
          translations[key][property] = flatData[property];
        }
      });

      resolve(translations);
    });
  });
}
