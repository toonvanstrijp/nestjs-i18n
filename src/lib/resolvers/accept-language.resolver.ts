import { I18nResolver } from '../index';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { I18nService } from '../services/i18n.service';
import { pick } from 'accept-language-parser';

@Injectable()
export class AcceptLanguageResolver implements I18nResolver {
  constructor() {}

  async resolve(
    context: ExecutionContext,
  ): Promise<string | string[] | undefined> {
    const req = context.switchToHttp().getRequest();

    const lang: string = req.raw
      ? req.raw.headers['accept-language']
      : req.headers['accept-language'];

    if (lang) {
      const service: I18nService = req.i18nService;
      return pick(await service.getSupportedLanguages(), lang);
    }
    return lang;
  }
}
