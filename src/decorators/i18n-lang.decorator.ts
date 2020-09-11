import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getContextObject } from '../utils/context';

export const I18nLang = createParamDecorator(
  (data, context: ExecutionContext) => {
    const ctx = getContextObject(context);

    if (!ctx) {
      throw Error(`context type: ${context.getType()} not supported`);
    }

    return ctx.i18nLang;
  },
);
