import { I18nResolver } from '..';
import * as urlParse from 'url';

export class QueryResolver implements I18nResolver {
  constructor(private keys: string[]) {
  }

  resolve(req: any, res: any) {
    let lang;
    const query = this.tryToParseQueryFromURL(req);

    if (!query) {
      return;
    }

    for (const key of this.keys) {
      if (query[key] !== undefined) {
        lang = query[key];
        break;
      }
    }

    return lang;
  }

  private tryToParseQueryFromURL(req): object | null {
    const { query = null, url = '' } = { ...req };

    if (query) {
      return query;
    }

    return urlParse.parse(url, true).query;
  }
}
