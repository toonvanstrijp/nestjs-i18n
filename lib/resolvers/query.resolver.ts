import { I18nResolver } from '..';

export class QueryResolver implements I18nResolver {
  constructor(private keys: string[]) {}

  resolve(req: any, res: any) {
    let lang;

    for (const key of this.keys) {
      if (req.query[key] !== undefined) {
        lang = req.query[key];
        break;
      }
    }

    return lang;
  }
}
