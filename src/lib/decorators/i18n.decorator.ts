import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { I18nService } from '..';
import { I18nContext } from '../i18n.context';

export const I18n = createParamDecorator((data, ctx: ExecutionContext) => {
  switch (ctx.getType() as string) {
    case 'http':
      return new I18nContext(
        ...resolveI18nServiceFromRestRequest(ctx.switchToHttp().getRequest()),
      );
    case 'graphql':
      return new I18nContext(
        ...resolveI18nServiceFromGraphQLContext(ctx.getArgs()),
      );
    default:
      throw Error(`context type: ${ctx.getType()} not supported`);
  }
});

function resolveI18nServiceFromRestRequest(req): [string, I18nService] {
  return [
    req.i18nLang || (req.raw ? req.raw.i18nLang : undefined),
    req.i18nService || (req.raw ? req.raw.i18nService : undefined),
  ];
}

function resolveI18nServiceFromGraphQLContext(req): [string, I18nService] {
  const [root, args, ctx, info] = req;
  return [ctx.req.i18nLang, ctx.req.i18nService];
}
