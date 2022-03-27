import { ExecutionContext } from '@nestjs/common';

export function getContextObject(context: ExecutionContext): any {
  switch (context.getType() as string) {
    case 'http':
      return context.switchToHttp().getRequest();
    case 'graphql':
      return context.getArgs()[2];
    case 'rpc':
      return context.switchToRpc().getContext();
    default:
      console.warn(`context type: ${context.getType()} not supported`);
  }
}
