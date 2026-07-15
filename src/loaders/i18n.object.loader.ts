import {
  I18nAbstractLoader,
  I18nAbstractLoaderOptions,
} from './i18n.abstract.loader';
import path from 'path';

export class I18nObjectLoader extends I18nAbstractLoader {
  getDefaultOptions(): Partial<I18nAbstractLoaderOptions> {
    return {
      filePattern: '*.{ts,js}',
      watch: false,
    };
  }

  protected override async parseFile(file: string): Promise<any> {
    const absolutePath = path.resolve(file);

    if (this.options.watch) {
      delete require.cache[absolutePath];
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const module = require(absolutePath);
    return module.default || module;
  }
}
