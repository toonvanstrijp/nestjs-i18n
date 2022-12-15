import { createParamDecorator } from '@nestjs/common';
import { I18nContext } from '../i18n.context';

export const I18nLang = createParamDecorator((data, context) => {
  const i18n = I18nContext.current(context);

  return i18n.lang;
});
