import { I18nResolver, I18nResolverOptions } from '../index';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { pick } from 'accept-language-parser';
import { I18nService } from '../services/i18n.service';

interface AcceptLanguageResolverOptions {
  matchType: 'strict' | 'loose' | 'strict-loose';
}

@Injectable()
export class AcceptLanguageResolver implements I18nResolver {
  constructor(
    @I18nResolverOptions()
    private options: AcceptLanguageResolverOptions = {
      matchType: 'strict-loose',
    },
  ) {}

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
        if (!req) return undefined;
        break;
      default:
        return undefined;
    }

    const lang = req.raw
      ? req.raw.headers?.['accept-language']
      : req?.headers?.['accept-language'];

    if (lang) {
      const supportedLangs = service.getSupportedLanguages();
      if (this.options.matchType === 'strict') {
        return pick(supportedLangs, lang);
      } else if (this.options.matchType === 'loose') {
        return pick(supportedLangs, lang, { loose: true });
      }
      return (
        pick(supportedLangs, lang) ??
        pick(supportedLangs, lang, { loose: true })
      );
    }
    return lang;
  }
}
