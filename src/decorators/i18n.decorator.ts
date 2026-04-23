import { createParamDecorator } from '@nestjs/common';
import { I18nContext } from '..';
import { getI18nContextOrThrow } from '../utils';

export const I18n = createParamDecorator((_, context) => {
  return getI18nContextOrThrow(I18nContext.current(context));
});
