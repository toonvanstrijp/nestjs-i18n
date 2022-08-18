import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

const logger = new Logger('I18nLang');

const getContextObject = (context: ExecutionContext) => {
  switch (context.getType() as string) {
    case 'http':
      return context.switchToHttp().getRequest();
    case 'graphql':
      return context.getArgs()[2];
    case 'rpc':
      return context.switchToRpc().getContext();
    default:
      logger.warn(`context type: ${context.getType()} not supported`);
  }
};

export const I18nLang = createParamDecorator(function (
  data,
  context: ExecutionContext,
) {
  const ctx = getContextObject(context);

  if (!ctx) {
    throw Error(`context type: ${context.getType()} not supported`);
  }

  return ctx.i18nLang;
});
