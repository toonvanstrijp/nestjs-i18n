import { I18nResolver, I18nResolverOptions } from '../index';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { ExecutionContextType } from '../i18n.constants';

@Injectable()
export class GrpcMetadataResolver implements I18nResolver {
  constructor(
    @I18nResolverOptions()
    private keys: string[] = ['lang'],
  ) {}

  async resolve(
    context: ExecutionContext,
  ): Promise<string | string[] | undefined> {
    let lang  = undefined;

    switch (context.getType() as string) {
      case ExecutionContextType.RPC:
        const metadata = context.switchToRpc().getContext() as Metadata;
        for (const key of this.keys) {
          const [value] = metadata.get(key);
          if (value) {
            lang = value as string;
            break;
          }
        }
    }

    return lang;
  }
}
