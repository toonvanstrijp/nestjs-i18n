import { ArgumentsHost, ExecutionContext, Logger } from '@nestjs/common';
import { I18nOptions } from '..';

const logger = new Logger('I18nService');

export function getContextObject(
  i18nOptions?: I18nOptions,
  context?: ExecutionContext | ArgumentsHost,
): any {
  const contextType = context?.getType<string>() ?? 'undefined';

  switch (contextType) {
    case 'http':
      return context.switchToHttp().getRequest();
    case 'graphql':
      return context.getArgs()[2];
    case 'rpc':
      return context.switchToRpc().getContext();
    case 'rmq':
      return context.getArgs()[1];
    default:
      if (i18nOptions?.logging) {
        logger.warn(`context type: ${contextType} not supported`);
      }
      return context;
  }
}
