import { ExecutionContext, Injectable } from '@nestjs/common';
import { ExecutionContextType } from '../i18n.constants';
import { I18nResolver } from '../interfaces';

@Injectable()
export class GraphQLWebsocketResolver implements I18nResolver {
  async resolve(
    context: ExecutionContext,
  ): Promise<string | string[] | undefined> {
    switch (context.getType() as string) {
      case ExecutionContextType.GRAPHQL:
        const [, , { connectionParams }] = context.getArgs();
        return connectionParams?.lang;
    }

    return undefined;
  }
}
