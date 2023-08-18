import { I18nResolver } from '../index';
import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { I18nResolverOptions } from '../decorators';

@Injectable()
export class HeaderResolver implements I18nResolver {
  private logger = new Logger('I18nService');
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
          this.logger.warn(
            'HeaderResolver does not support RFC4647 Accept-Language header. Please use AcceptLanguageResolver instead.',
          );
        }
        if (req.headers !== undefined && req.headers[key] !== undefined) {
          lang = req.headers[key];
          break;
        }
      }
    }

    return lang;
  }
}
