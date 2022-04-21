import { ExecutionContext, Logger } from '@nestjs/common';

const logger = new Logger('I18nService');

export function getContextObject(context: ExecutionContext): any {
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
}
