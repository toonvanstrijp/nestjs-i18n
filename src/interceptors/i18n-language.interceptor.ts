import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Observable, Subscription } from 'rxjs';
import { I18N_OPTIONS, I18N_RESOLVERS } from '../i18n.constants';
import { I18nContext } from '../i18n.context';
import { I18nOptionResolver, I18nOptions } from '../interfaces';
import { I18nService } from '../services/i18n.service';
import {
  getContextObject,
  getLanguageFromResolverResult,
  I18nMessageFormat,
  resolveLanguage,
} from '../utils';

@Injectable()
export class I18nLanguageInterceptor implements NestInterceptor {
  constructor(
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
    @Inject(I18N_RESOLVERS)
    private readonly i18nResolvers: I18nOptionResolver[],
    private readonly i18nService: I18nService,
    private readonly messageFormat: I18nMessageFormat,
    private readonly moduleRef: ModuleRef,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const i18nContext = I18nContext.current();
    let language = null;

    const ctx = getContextObject(this.i18nOptions, context);
    const contextType = context.getType<string>();
    const supportedContextTypes = ['http', 'graphql', 'rpc', 'rmq', 'ws'];

    // Skip interceptor only for unsupported contexts.
    // For rpc/ws we still need AsyncLocal i18n context even if the transport
    // does not expose a mutable context object.
    if (!supportedContextTypes.includes(contextType)) {
      return next.handle();
    }

    // Skip language resolution if it already happened, either in the http
    // middleware or on an earlier message of the same websocket client.
    if (ctx?.i18nLang) {
      // Later messages of a websocket client reuse the i18n context stored on
      // the client, which still has to be made available to the handler.
      if (!i18nContext && ctx.i18nContext && !this.i18nOptions.skipAsyncHook) {
        return this.runInI18nContext(ctx.i18nContext, next);
      }

      return next.handle();
    }

    if (ctx) {
      ctx.i18nService = this.i18nService;
    }

    language = await resolveLanguage(this.i18nResolvers, context, this.moduleRef);

    const resolvedLanguage =
      getLanguageFromResolverResult(language) || this.i18nOptions.fallbackLanguage;

    if (ctx) {
      ctx.i18nLang = resolvedLanguage;
    }

    const response =
      context.getType<string>() === 'http'
        ? context.switchToHttp().getResponse()
        : ctx?.res;

    if (response?.locals && ctx?.i18nLang) {
      response.locals.i18nLang = ctx.i18nLang;
    }

    if (!i18nContext) {
      const requestI18nContext = new I18nContext(
        resolvedLanguage,
        this.i18nService,
        this.messageFormat,
      );

      if (ctx) {
        ctx.i18nContext = requestI18nContext;
      }

      if (!this.i18nOptions.skipAsyncHook) {
        return this.runInI18nContext(requestI18nContext, next);
      }
    }

    return next.handle();
  }

  private runInI18nContext(i18nContext: I18nContext, next: CallHandler<any>): Observable<any> {
    return new Observable((observer) => {
      let subscription: Subscription | undefined;

      I18nContext.createAsync(i18nContext, async () => {
        subscription = next.handle().subscribe(observer);
      }).catch((error) => {
        observer.error(error);
      });

      return () => {
        subscription?.unsubscribe();
      };
    });
  }
}
