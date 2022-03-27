import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getI18nContextFromArgumentsHost } from '../utils/util';

export const I18n = createParamDecorator((data, ctx: ExecutionContext) => {
  return getI18nContextFromArgumentsHost(ctx);
});
