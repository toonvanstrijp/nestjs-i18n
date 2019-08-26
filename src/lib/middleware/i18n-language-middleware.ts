import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { I18N_OPTIONS } from '../i18n.constants';
import { I18nOptions } from '../index';

@Injectable()
export class I18nLanguageMiddleware implements NestMiddleware {
  constructor(
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
  ) {}

  use(req: any, res: any, next: () => void) {
    let language = null;

    for (const resolver of this.i18nOptions.resolvers) {
      language = resolver.resolve(req);
      if (language !== undefined) {
        break;
      }
    }
    req.i18nLang = language || this.i18nOptions.fallbackLanguage;

    next();
  }
}
