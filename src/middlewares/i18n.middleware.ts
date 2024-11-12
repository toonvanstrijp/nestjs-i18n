import { Inject, Injectable, NestMiddleware, Type } from '@nestjs/common';
import {
  ArgumentsHost,
  ContextType,
  ExecutionContext,
  HttpArgumentsHost,
  RpcArgumentsHost,
  WsArgumentsHost,
} from '@nestjs/common/interfaces';
import { ModuleRef } from '@nestjs/core';
import { shouldResolve } from '../utils';
import { I18N_OPTIONS, I18N_RESOLVERS } from '../i18n.constants';
import {
  I18nContext,
  I18nOptions,
  I18nResolver,
  ResolverWithOptions,
} from '../index';
import { I18nService } from '../services/i18n.service';
import { I18nOptionResolver } from '../interfaces';
import { I18nError } from '../i18n.error';

const ExecutionContextMethodNotImplemented = new I18nError(
  "Method not implemented. nestjs-i18n creates a fake Http context since it's using middleware to resolve your language. Nestjs middlewares don't have access to the ExecutionContext.",
);

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  constructor(
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
    @Inject(I18N_RESOLVERS)
    private readonly i18nResolvers: I18nOptionResolver[],
    private readonly i18nService: I18nService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async use(req: any, res: any, next: any) {
    let language = null;

    // Skip middleware if language is already resolved
    if (!!req.i18nLang) {
      return next();
    }

    req.i18nService = this.i18nService;

    for (const r of this.i18nResolvers) {
      const resolver = await this.getResolver(r);

      language = resolver.resolve(new MiddlewareHttpContext(req, res, next));

      if (language instanceof Promise) {
        language = await (language as Promise<string>);
      }

      if (language !== undefined) {
        break;
      }
    }

    req.i18nLang = language || this.i18nOptions.fallbackLanguage;

    // Pass down language to handlebars
    if (req.app) {
      req.app.locals.i18nLang = req.i18nLang;
    }

    req.i18nContext = new I18nContext(req.i18nLang, this.i18nService);

    if (this.i18nOptions.skipAsyncHook) {
      next();
    } else {
      I18nContext.create(req.i18nContext, next);
    }
  }

  private async getResolver(r: I18nOptionResolver): Promise<I18nResolver> {
    if (shouldResolve(r)) {
      if (r['use']) {
        const resolver = r as ResolverWithOptions;
        return this.moduleRef.get(resolver.use);
      } else {
        return this.moduleRef.get(r as Type<I18nResolver>);
      }
    } else {
      return r as I18nResolver;
    }
  }
}

class MiddlewareHttpContext
  implements ExecutionContext, ArgumentsHost, HttpArgumentsHost
{
  constructor(
    private req: any,
    private res: any,
    private next: any,
  ) {}

  getClass<T = any>(): Type<T> {
    throw ExecutionContextMethodNotImplemented;
  }

  getHandler(): any {
    throw ExecutionContextMethodNotImplemented;
  }

  getArgs<T extends any[] = any[]>(): T {
    throw ExecutionContextMethodNotImplemented;
  }

  getArgByIndex<T = any>(): T {
    throw ExecutionContextMethodNotImplemented;
  }

  switchToRpc(): RpcArgumentsHost {
    throw ExecutionContextMethodNotImplemented;
  }

  switchToHttp(): HttpArgumentsHost {
    return this;
  }

  switchToWs(): WsArgumentsHost {
    throw ExecutionContextMethodNotImplemented;
  }

  getType<TContext extends string = ContextType>(): TContext {
    return 'http' as any;
  }

  getRequest<T = any>(): T {
    return this.req;
  }

  getResponse<T = any>(): T {
    return this.res;
  }

  getNext<T = any>(): T {
    return this.next;
  }
}
