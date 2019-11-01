import { createParamDecorator } from '@nestjs/common';
import { I18nService } from '..';
import { I18nContext } from '../i18n.context';

export const I18n = createParamDecorator((data, req) => {
  // this is gonna be so nasty..
  // FIXME: This has to be fixed in later stages! PLEASE!
  if (Array.isArray(req)) {
    return new I18nContext(...resolveI18nServiceFromGraphQLContext(req));
  }
  return new I18nContext(...resolveI18nServiceFromRestRequest(req));
});

function resolveI18nServiceFromRestRequest(req): [string, I18nService] {
  return [
    req.i18nLang || (req.raw ? req.raw.i18nLang : undefined),
    req.i18nService || (req.raw ? req.raw.i18nService : undefined),
  ];
}

function resolveI18nServiceFromGraphQLContext(req): [string, I18nService] {
  const { ctx } = req;
  return [ctx.req.i18nLang, ctx.req.i18nService];
}
