import { ExecutionContext, Injectable } from '@nestjs/common';
import { pick } from 'accept-language-parser';
import { I18nResolverOptions } from '../decorators';
import { ExecutionContextType } from '../i18n.constants';
import { I18nResolver } from '../interfaces';
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
      case ExecutionContextType.HTTP:
        req = context.switchToHttp().getRequest();
        service = req.i18nService;
        break;
      case ExecutionContextType.WS: {
        const client: any = context.switchToWs().getClient();
        req = client?.handshake ?? client?.upgradeReq ?? client?.request ?? client;
        service = client?.i18nService;
        break;
      }
      case ExecutionContextType.GRAPHQL:
        [, , { req, i18nService: service }] = context.getArgs();
        if (!req) return undefined;
        break;
      default:
        return undefined;
    }

    const lang = req.raw
      ? req.raw.headers?.['accept-language']
      : req?.headers?.['accept-language'];

    if (lang && service) {
      const supportedLangs = service.getSupportedLanguages();
      if (this.options.matchType === 'strict') {
        return pick(supportedLangs, lang) ?? undefined;
      } else if (this.options.matchType === 'loose') {
        return pick(supportedLangs, lang, { loose: true }) ?? undefined;
      }
      return (
        pick(supportedLangs, lang) ??
        pick(supportedLangs, lang, { loose: true }) ??
        undefined
      );
    }
    return lang;
  }
}
