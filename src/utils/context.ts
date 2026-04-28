import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { I18nOptions } from '../interfaces';
import { ExecutionContextType } from '../i18n.constants';
import { logger } from "./util";

export function getContextObject(
  i18nOptions?: I18nOptions,
  context?: ExecutionContext | ArgumentsHost,
): any {
  if (!context) {
    if (i18nOptions?.logging) {
      logger.warn('context type: undefined not supported');
    }
    return context;
  }

  const contextType = context.getType<string>();

  switch (contextType) {
    case ExecutionContextType.HTTP:
      return context.switchToHttp().getRequest();
    case ExecutionContextType.WS:
      return context.switchToWs().getClient();
    case ExecutionContextType.GRAPHQL:
      return context.getArgs()[2];
    case ExecutionContextType.RPC:
      return context.switchToRpc().getContext();
    case ExecutionContextType.RMQ:
      return context.getArgs()[1];
    default:
      if (i18nOptions?.logging) {
        logger.warn(`context type: ${contextType} not supported`);
      }
      return context;
  }
}
