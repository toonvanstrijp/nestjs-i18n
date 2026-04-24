import { I18nResolver } from '../index';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { I18nResolverOptions } from '../decorators';
import { ExecutionContextType } from '../i18n.constants';

@Injectable()
export class QueryResolver implements I18nResolver {
  constructor(@I18nResolverOptions() private keys: string[] = []) {}

  resolve(context: ExecutionContext): Promise<string | string[] | undefined> {
    let req: any;

    switch (context.getType() as string) {
      case ExecutionContextType.HTTP:
        req = context.switchToHttp().getRequest();
        break;
      case ExecutionContextType.GRAPHQL:
        [, , { req }] = context.getArgs();
        break;
    }

    let lang = undefined;

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
