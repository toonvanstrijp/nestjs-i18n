import { I18nResolver } from '../index';

export class QueryResolver implements I18nResolver {
  constructor(private keys: string[]) {}

  resolve(req: any) {
    let lang: string;

    for (const key of this.keys) {
      if (req.query != undefined && req.query[key] !== undefined) {
        lang = req.query[key];
        break;
      }
    }

    return lang;
  }
}
