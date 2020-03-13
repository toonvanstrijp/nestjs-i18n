import { AbstractAction } from './abstract.action';
import { Input } from '../commands';
import * as path from 'path';
import * as fs from 'fs';
import { getDirectories } from '../../lib/utils/file';
import { I18nJsonParser } from '../../lib/parsers/i18n.json.parser';
import * as _ from 'lodash';
import * as chalk from 'chalk';

export class CheckAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]) {
    const i18nPathInput = inputs.find(input => input.name === 'path');
    const i18nPath = path.normalize(i18nPathInput.value + path.sep);

    if (!fs.existsSync(i18nPath)) {
      console.error('i18n path does not exists');
      process.exit(1);
    }

    const languages = (await getDirectories(i18nPath)).map(dir =>
      path.relative(i18nPath, dir),
    );

    console.log(
      chalk.bold('found languages:'),
      chalk.bold.yellow(languages.join(',')),
    );

    const jsonParser = new I18nJsonParser({
      path: i18nPath,
      filePattern: '*.json',
    });

    const translations = await jsonParser.parse();

    let uniqueKeys = [];
    for (let translationsKey in translations) {
      uniqueKeys.push(...Object.keys(translations[translationsKey]));
    }

    uniqueKeys = _.uniq(uniqueKeys);

    let totalErrorCount = 0;
    languages.forEach(lang => {
      console.log(`${chalk.underline('checking:')} ${chalk.bold.yellow(lang)}`);
      let errorCount = 0;
      let message = '';
      uniqueKeys.forEach(key => {
        if (
          !translations.hasOwnProperty(lang) ||
          !translations[lang].hasOwnProperty(key)
        ) {
          errorCount++;
          const fileName = key.split('.')[0];
          key = key.substring(key.indexOf('.') + 1);
          message +=
            chalk.underline(
              `${chalk.bold.red(
                lang,
              )} is missing value for key: ${chalk.bold.red(
                key,
              )} in file: ${chalk.bold.red(fileName)}`,
            ) + '\n';
        }
      });

      if (errorCount === 0) {
        message = chalk.bold.green('ok');
      } else {
        console.log(chalk.red(`${chalk.bold(`${errorCount}`)} errors found:`));
      }

      console.log(message.trim());

      totalErrorCount += errorCount;
    });

    process.exit(totalErrorCount === 0 ? 0 : 1);
  }
}
