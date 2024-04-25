import { I18nResolver } from '../index';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nResolverOptions } from '../decorators/i18n-resolver-options.decorator';

@Injectable()
export class QueryResolver implements I18nResolver {
  constructor(@I18nResolverOptions() private keys: string[] = []) {}

  resolve(context: ExecutionContext) {
    let req: any;

    switch (context.getType() as string) {
      case 'http':
        req = context.switchToHttp().getRequest();
        break;
      case 'graphql':
        [, , { req }] = context.getArgs();
        break;
    }

    let lang: string;

    if (req) {
      for (const key of this.keys) {
        if (req.query !== undefined && req.query[key] !== undefined) {
          lang = req.query[key];
          break;
        }
      }
    }

    return lang;
  }
}
