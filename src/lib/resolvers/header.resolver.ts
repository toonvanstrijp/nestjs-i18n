import { I18nResolver } from '../index';

export class HeaderResolver implements I18nResolver {
  constructor(private keys: string[] = ['accept-language']) {}

  resolve(req: any) {
    let lang;

    for (const key of this.keys) {
      if (req.headers[key] !== undefined) {
        lang = req.headers[key];
        break;
      }
    }

    return lang;
  }
}
