import { ExecutionContext } from '@nestjs/common';

export function getContextObject(context: ExecutionContext): any {
  switch (context.getType() as string) {
    case 'http':
      return context.switchToHttp().getRequest();
    case 'graphql':
      const [, , ctx] = context.getArgs();
      return ctx;
    case 'rpc':
      return context.switchToRpc().getContext();
    default:
      console.warn(`context type: ${context.getType()} not supported`);
  }
}
