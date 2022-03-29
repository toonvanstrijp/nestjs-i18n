import { I18nContext } from '../i18n.context';
import { I18nOptionResolver } from '../interfaces/i18n-options.interface';
import { ArgumentsHost } from '@nestjs/common';

export function shouldResolve(e: I18nOptionResolver) {
  return typeof e === 'function' || (e['use'] && e['options']);
}

export function getI18nContextFromRequest(req: any): I18nContext {
  const lang = req.raw && req.raw.i18nLang ? req.raw.i18nLang : req.i18nLang;
  const service =
    req.raw && req.raw.i18nService ? req.raw.i18nService : req.i18nService;
  return new I18nContext(lang, service);
}

export function getI18nServiceFromGraphQLContext(
  graphqlContext: any,
): I18nContext {
  const [, , ctx] = graphqlContext;
  return new I18nContext(ctx.i18nLang, ctx.i18nService);
}

export function getI18nServiceFromRpcContext(rpcContext: any): I18nContext {
  return new I18nContext(rpcContext.i18nLang, rpcContext.i18nService);
}

export function getI18nContextFromArgumentsHost(
  ctx: ArgumentsHost,
): I18nContext {
  switch (ctx.getType() as string) {
    case 'http':
      return getI18nContextFromRequest(ctx.switchToHttp().getRequest());
    case 'graphql':
      return getI18nServiceFromGraphQLContext(ctx.getArgs());
    case 'rpc':
      return getI18nServiceFromRpcContext(ctx.switchToRpc().getContext());
    default:
      throw Error(
        `can't resolve i18n context for type: ${ctx.getType()} not supported yet)`,
      );
  }
}
