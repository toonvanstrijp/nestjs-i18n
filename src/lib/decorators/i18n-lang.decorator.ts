import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const I18nLang = createParamDecorator((data, ctx: ExecutionContext) => {
  switch (ctx.getType() as string) {
    case 'http':
      return resolveI18nLanguageFromRestRequest(
        ctx.switchToHttp().getRequest(),
      );
    case 'graphql':
      return resolveI18nLanguageFromGraphQLContext(ctx.getArgs());
    default:
      throw Error(`context type: ${ctx.getType()} not supported`);
  }
});

function resolveI18nLanguageFromRestRequest(req) {
  return req.i18nLang || (req.raw ? req.raw.i18nLang : undefined);
}

function resolveI18nLanguageFromGraphQLContext(req) {
  const [root, args, ctx, info] = req;
  return ctx.req.i18nLang;
}
