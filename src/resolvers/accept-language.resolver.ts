import { I18nResolver } from '../index';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { pick } from 'accept-language-parser';
import { I18nService } from '../services/i18n.service';

@Injectable()
export class AcceptLanguageResolver implements I18nResolver {
  async resolve(
    context: ExecutionContext,
  ): Promise<string | string[] | undefined> {
    let req: any;
    let service: I18nService;

    switch (context.getType() as string) {
      case 'http':
        req = context.switchToHttp().getRequest();
        service = req.i18nService;
        break;
      case 'graphql':
        [, , { req, i18nService: service }] = context.getArgs();
        if(!req) return undefined;
        break;
      default:
        return undefined;
    }

    const lang = req.raw
      ? req.raw.headers['accept-language']
      : req.headers['accept-language'];

    if (lang) {
      return pick(await service.getSupportedLanguages(), lang, {loose: true });
    }
    return lang;
  }
}
