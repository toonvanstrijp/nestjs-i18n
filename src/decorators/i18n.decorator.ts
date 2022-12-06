import { createParamDecorator } from '@nestjs/common';
import { I18nContext } from '..';
import { getContextObject } from '../utils/context';

export const I18n = createParamDecorator((_, context) => {
  const i18n = I18nContext.current() ?? getContextObject(context)?.i18nContext;

  if (i18n == undefined) {
    throw Error('I18n context undefined');
  }

  return i18n;
});
