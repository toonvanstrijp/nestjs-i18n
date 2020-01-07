import * as cookie from 'cookie';
import { Injectable } from '@nestjs/common';
import { I18nResolver } from '..';
import { I18nResolverOptions } from '../decorators/i18n-resolver-options.decorator';

/**
 * Simple resolver to fetch language/locale from cookie
 */
@Injectable()
export class CookieResolver implements I18nResolver {
  constructor(
    @I18nResolverOptions()
    private readonly cookieNames: string[] = ['lang'],
  ) {}

  resolve(req) {
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
    return undefined;
  }
}
