import * as cookie from 'cookie';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { I18nResolver } from '..';
import { I18nResolverOptions } from '../decorators';

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
      case 'http':
        req = context.switchToHttp().getRequest();
        req = req.raw ? req.raw : req;
        break;
      case 'graphql':
        [, , { req }] = context.getArgs();
        break;
    }

    if (req) {
      if (!req.cookies && req.headers.cookie) {
        req.cookies = cookie.parse(req.headers.cookie);
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
