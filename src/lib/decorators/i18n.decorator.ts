import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { I18nService } from '..';
import { I18nContext } from '../i18n.context';

export const I18n = createParamDecorator((data, ctx: ExecutionContext) => {
  switch (ctx.getType() as string) {
    case 'http':
      return new I18nContext(
        ...resolveI18nServiceFromRequest(ctx.switchToHttp().getRequest()),
      );
    case 'graphql':
      return new I18nContext(
        ...resolveI18nServiceFromGraphQLContext(ctx.getArgs()),
      );
    case 'rpc':
      return new I18nContext(
        ...resolveI18nServiceFromRpcContext(ctx.switchToRpc().getContext()),
      );
    default:
      throw Error(`context type: ${ctx.getType()} not supported`);
  }
});
function resolveI18nServiceFromRequest(req): [string, I18nService] {
  return [
    req.raw && req.raw.i18nLang ? req.raw.i18nLang : req.i18nLang,
    req.raw && req.raw.i18nService ? req.raw.i18nService : req.i18nService,
  ];
}

function resolveI18nServiceFromGraphQLContext(
  graphqlContext,
): [string, I18nService] {
  const [root, args, ctx, info] = graphqlContext;
  return [ctx.req.i18nLang, ctx.req.i18nService];
}

function resolveI18nServiceFromRpcContext(rpcContext): [string, I18nService] {
  return [rpcContext.i18nLang, rpcContext.i18nService];
}
