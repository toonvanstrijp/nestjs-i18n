import { createParamDecorator } from '@nestjs/common';
import { getContextObject, RequestContext } from '../utils/context';

export const I18nLang = createParamDecorator((data, context) => {
  const i18n =
    RequestContext.getI18nContext() ?? getContextObject(context)?.i18nContext;

  return i18n.lang;
});
