import {
  Inject,
  Injectable,
  Type,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { I18N_OPTIONS, I18N_RESOLVERS } from '../i18n.constants';
import {
  I18nContext,
  I18nOptions,
  I18nResolver,
  ResolverWithOptions,
} from '../index';
import { I18nService } from '../services/i18n.service';
import { ModuleRef } from '@nestjs/core';
import { shouldResolve } from '../utils/util';
import { I18nOptionResolver } from '../interfaces/i18n-options.interface';
import { Observable } from 'rxjs';
import { getContextObject } from '../utils/context';

@Injectable()
export class I18nLanguageInterceptor implements NestInterceptor {
  constructor(
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
    @Inject(I18N_RESOLVERS)
    private readonly i18nResolvers: I18nOptionResolver[],
    private readonly i18nService: I18nService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const i18nContext = I18nContext.current();
    let language = null;

    const ctx = getContextObject(context);

    // Skip interceptor if language is already resolved (in case of http middleware) or when ctx is undefined (unsupported context)
    if (ctx === undefined || !!ctx.i18nLang) {
      return next.handle();
    }

    ctx.i18nService = this.i18nService;

    for (const r of this.i18nResolvers) {
      const resolver = await this.getResolver(r);

      language = resolver.resolve(context);

      if (language instanceof Promise) {
        language = await (language as Promise<string>);
      }

      if (language !== undefined) {
        break;
      }
    }

    ctx.i18nLang = language || this.i18nOptions.fallbackLanguage;

    // Pass down language to handlebars
    if (ctx.app && ctx.app.locals) {
      ctx.app.locals.i18nLang = ctx.i18nLang;
    }

    if (!i18nContext) {
      ctx.i18nContext = new I18nContext(ctx.i18nLang, this.i18nService);

      if (!this.i18nOptions.skipAsyncHook) {
        return I18nContext.createAsync(ctx.i18nContext, async (error) => {
          if (error) {
            throw error;
          }
          return next.handle();
        });
      }
    }

    return next.handle();
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
