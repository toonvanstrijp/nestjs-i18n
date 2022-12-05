import { createParamDecorator } from '@nestjs/common';
import { getContextObject, RequestContext } from '../utils/context';

export const I18n = createParamDecorator((_, context) => {
  const i18n =
    RequestContext.getI18nContext() ?? getContextObject(context)?.i18nContext;

  if (i18n == undefined) {
    throw Error('I18n context undefined');
  }

  return i18n;
});
