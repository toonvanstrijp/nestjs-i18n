import { createParamDecorator } from '@nestjs/common';

export const I18nLang = createParamDecorator((data, req) => {
  // this is gonna be so nasty..
  // FIXME: This has to be fixed in later stages! PLEASE!
  if (Array.isArray(req)) {
    return resolveI18nLanguageFromGraphQLContext(req);
  }
  return resolveI18nLanguageFromRestRequest(req);
});

function resolveI18nLanguageFromRestRequest(req) {
  return req.i18nLang || (req.raw ? req.raw.i18nLang : undefined);
}

function resolveI18nLanguageFromGraphQLContext(req) {
  const [root, args, ctx, info] = req;
  return ctx.req.i18nLang;
}
