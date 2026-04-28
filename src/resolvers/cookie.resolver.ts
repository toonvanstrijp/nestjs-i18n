import { ExecutionContext, Injectable } from '@nestjs/common';
import { parse } from 'cookie';
import { I18nResolverOptions } from '../decorators';
import { ExecutionContextType } from '../i18n.constants';
import { I18nResolver } from '../interfaces';

/**
 * Simple resolver to fetch language/locale from cookie
 */
@Injectable()
export class CookieResolver implements I18nResolver {
  constructor(
    @I18nResolverOptions()
    private readonly cookieNames: string[] = ['lang'],
  ) {}

  resolve(context: ExecutionContext): string | string[] | undefined {
    let req: any;

    switch (context.getType() as string) {
      case ExecutionContextType.HTTP:
        req = context.switchToHttp().getRequest();
        req = req.raw ? req.raw : req;
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

    if (req) {
      if (!req.cookies && req.headers.cookie) {
        req.cookies = parse(req.headers.cookie);
      }

      if (req.cookies) {
        for (const i in this.cookieNames) {
          if (req.cookies[this.cookieNames[i]]) {
            return req.cookies[this.cookieNames[i]];
          }
        }
      }
    }

    return undefined;
  }
}
