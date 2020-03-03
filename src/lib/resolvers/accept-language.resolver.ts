import { I18nResolver } from '../index';
import { Injectable } from '@nestjs/common';
import { I18nResolverOptions } from '../decorators/i18n-resolver-options.decorator';
import { I18nLanguages } from '../decorators/i18n-languages.decorator';
import { I18nService } from '../services/i18n.service';
import { pick } from 'accept-language-parser';

@Injectable()
export class AcceptLanguageResolver implements I18nResolver {
  constructor() {}

  resolve(req: any) {
    const lang = req.headers['accept-language'];
    if (lang) {
      const service: I18nService = req.i18nService;
      return pick(service.getSupportedLanguages(), lang);
    }
    return lang;
  }
}
