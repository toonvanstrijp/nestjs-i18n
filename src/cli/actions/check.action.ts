import { AbstractAction } from './abstract.action';
import { Input } from '../commands';
import * as path from 'path';
import * as fs from 'fs';
import { getDirectories, parseTranslations } from '../../lib/utils/parse';

export class CheckAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]) {
    const i18nPathInput = inputs.find(input => input.name === 'path');
    const i18nPath = path.normalize(i18nPathInput.value + path.sep);

    if (!fs.existsSync(i18nPath)) {
      console.error('i18n path does not exists');
      process.exit(1);
    }

    const languages = getDirectories(i18nPath).map(dir =>
      path.relative(i18nPath, dir),
    );

    console.log('languages', languages);

    console.log(
      await parseTranslations({
        path: i18nPath,
        filePattern: '*.json',
      }),
    );

    return undefined;
  }
}
