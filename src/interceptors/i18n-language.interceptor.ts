import {
  Inject,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { I18N_OPTIONS, I18N_RESOLVERS } from '../i18n.constants';
import { I18nContext, I18nOptions } from '../index';
import { I18nService } from '../services/i18n.service';
import { ModuleRef } from '@nestjs/core';
import {
  resolveLanguage,
  getContextObject,
  getLanguageFromResolverResult,
  I18nMessageFormat,
} from '../utils';
import { I18nOptionResolver } from '../interfaces/i18n-options.interface';
import { Observable, Subscription } from 'rxjs';

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

    // Skip interceptor if language is already resolved (in case of http middleware)
    if (ctx?.i18nLang) {
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
        return new Observable((observer) => {
          let subscription: Subscription | undefined;

          I18nContext.createAsync(requestI18nContext, async () => {
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

    return next.handle();
  }

}
