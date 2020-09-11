import { I18nResolver } from '../index';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { I18nResolverOptions } from '../decorators/i18n-resolver-options.decorator';
import { I18nLanguages } from '../decorators/i18n-languages.decorator';

@Injectable()
export class HeaderResolver implements I18nResolver {
  constructor(
    @I18nResolverOptions()
    private keys: string[] = [],
  ) {}

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
        if (key === 'accept-language') {
          console.warn(
            'HeaderResolver does not support RFC4647 Accept-Language header. Please use AcceptLanguageResolver instead.',
          );
        }
        if (req.headers[key] !== undefined) {
          lang = req.headers[key];
          break;
        }
      }
    }

    return lang;
  }
}
