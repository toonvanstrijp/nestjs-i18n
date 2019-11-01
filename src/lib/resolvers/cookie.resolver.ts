import * as cookie from 'cookie';

/**
 * Simple resolver to fetch language/locale from cookie
 */
export class CookieResolver {
  constructor(private readonly cookieNames: string[] = ['lang']) {}

  resolve(req) {
    if (!req.cookieNames && req.headers.cookie) {
      req.cookieNames = cookie.parse(req.headers.cookie);
    }
    if (req.cookieNames) {
      for (const i in this.cookieNames) {
        if (req.cookies[this.cookieNames[i]]) {
          return req.cookies[this.cookieNames[i]];
        }
      }
    }
    return undefined;
  }
}
