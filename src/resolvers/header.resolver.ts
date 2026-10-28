import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nResolverOptions } from '../decorators';
import { ExecutionContextType } from '../i18n.constants';
import { I18nResolver } from '../interfaces';
import { logger } from "../utils";

@Injectable()
export class HeaderResolver implements I18nResolver {
  constructor(
    @I18nResolverOptions()
    private keys: string[] = [],
  ) {}

  resolve(context: ExecutionContext): Promise<string | string[] | undefined> {
    let req: any;

    switch (context.getType() as string) {
      case ExecutionContextType.HTTP:
        req = context.switchToHttp().getRequest();
        break;
      case ExecutionContextType.WS: {
        const client: any = context.switchToWs().getClient();
        req = client?.handshake ?? client?.upgradeReq ?? client?.request ?? client;
        break;
      }
      case ExecutionContextType.GRAPHQL:
        [, , { req }] = context.getArgs();
        break;
    }

    let lang = undefined;

    if (req) {
      for (const key of this.keys) {
        if (key.toLowerCase() === 'accept-language') {
          logger.warn(
            'HeaderResolver does not support RFC4647 Accept-Language header. Please use AcceptLanguageResolver instead.',
          );
        }
        // Node.js lowercases incoming header names, so also look up the
        // lowercased key to match keys configured like `X-Custom-Lang`.
        const value = req.headers?.[key] ?? req.headers?.[key.toLowerCase()];
        if (value !== undefined) {
          lang = value;
          break;
        }
      }
    }

    return lang;
  }
}
