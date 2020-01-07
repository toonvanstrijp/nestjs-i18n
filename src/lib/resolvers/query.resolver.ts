import { I18nResolver } from '../index';
import { Injectable } from '@nestjs/common';
import { I18nResolverOptions } from '../decorators/i18n-resolver-options.decorator';

@Injectable()
export class QueryResolver implements I18nResolver {
  constructor(@I18nResolverOptions() private keys: string[]) {}

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
