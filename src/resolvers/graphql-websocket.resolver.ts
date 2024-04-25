import { I18nResolver } from '../index';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class GraphQLWebsocketResolver implements I18nResolver {
  async resolve(
    context: ExecutionContext,
  ): Promise<string | string[] | undefined> {
    switch (context.getType() as string) {
      case 'graphql':
        const [, , { connectionParams }] = context.getArgs();
        return connectionParams?.lang;
    }

    return undefined;
  }
}
