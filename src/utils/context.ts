import { ExecutionContext, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { I18nContext } from '..';

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

export class RequestContext {
  private static storage = new AsyncLocalStorage<RequestContext>();
  private static counter = 1;
  readonly id = RequestContext.counter++;

  constructor(readonly _i18n: I18nContext) {}

  get i18n(): I18nContext | undefined {
    return this._i18n;
  }

  static create(i18n: I18nContext, next: (...args: any[]) => void): void {
    const ctx = this.createContext(i18n);
    this.storage.run(ctx, next);
  }

  static async createAsync<T>(
    i18n: I18nContext,
    next: (...args: any[]) => Promise<T>,
  ): Promise<T> {
    const ctx = this.createContext(i18n);
    return this.storage.run(ctx, next);
  }

  static currentRequestContext(): RequestContext | undefined {
    return this.storage.getStore();
  }

  static getI18nContext(): I18nContext | undefined {
    const context = RequestContext.currentRequestContext();
    return context ? context._i18n : undefined;
  }

  private static createContext(i18n: I18nContext): RequestContext {
    return new RequestContext(i18n);
  }
}
