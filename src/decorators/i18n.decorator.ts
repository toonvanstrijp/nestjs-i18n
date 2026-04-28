import { createParamDecorator } from '@nestjs/common';
import { I18nContext } from '../i18n.context';
import { getI18nContextOrThrow } from '../utils';

export const I18n = createParamDecorator((_, context) => {
  return getI18nContextOrThrow(I18nContext.current(context));
});
