import { createParamDecorator } from '@nestjs/common';
import { I18nContext } from '../i18n.context';
import { getContextObject } from '../utils/context';

export const I18nLang = createParamDecorator((data, context) => {
  const i18n = I18nContext.current() ?? getContextObject(context)?.i18nContext;

  return i18n.lang;
});
