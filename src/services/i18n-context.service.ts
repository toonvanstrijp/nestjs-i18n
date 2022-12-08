import { ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { I18N_CUSTOM_CONTEXT } from '../i18n.constants';
import { I18nCustomContext } from '../interfaces/i18n-custom-context.interface';

@Injectable()
export class I18nContextService {
  private logger = new Logger('I18nContextService');

  constructor(
    @Inject(I18N_CUSTOM_CONTEXT) private customContexts: I18nCustomContext[],
  ) {}

  public getContextObject(context: ExecutionContext): any {
    const customContextKeys = this.customContexts?.map((c) => c.type) ?? [];

    switch (context.getType() as string) {
      case 'http':
        return context.switchToHttp().getRequest();
      case 'graphql':
        return context.getArgs()[2];
      case 'rpc':
        return context.switchToRpc().getContext();
      default:
        if (customContextKeys.indexOf(context.getType() as string) >= 0) {
          return this._getCustomContext(context.getType()).getContext(context);
        }

        this.logger.warn(`context type: ${context.getType()} not supported`);
    }
  }

  private _getCustomContext(type: string): I18nCustomContext {
    return this.customContexts.find((c) => (c.type = type));
  }
}
