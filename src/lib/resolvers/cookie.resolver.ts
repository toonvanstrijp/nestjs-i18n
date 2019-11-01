import * as cookie from 'cookie';

/**
 * Simple resolver to fetch language/locale from cookie
 */
export class CookieResolver {
  constructor(private readonly cookieNames: string[] = ['lang']) {}

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
