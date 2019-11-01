import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { I18N_OPTIONS } from '../i18n.constants';
import { I18nOptions } from '../index';
import { I18nService } from '../services/i18n.service';

@Injectable()
export class I18nLanguageMiddleware implements NestMiddleware {
  constructor(
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
    private readonly i18nService: I18nService,
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
    req.i18nService = this.i18nService;

    next();
  }
}
