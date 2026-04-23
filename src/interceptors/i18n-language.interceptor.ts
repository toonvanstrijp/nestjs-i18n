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
import { resolveLanguage, getContextObject } from '../utils';
import { I18nOptionResolver } from '../interfaces/i18n-options.interface';
import { Observable } from 'rxjs';

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

    const ctx = getContextObject(this.i18nOptions, context);

    // Skip interceptor if language is already resolved (in case of http middleware) or when ctx is undefined (unsupported context)
    if (ctx === undefined || ctx.i18nLang) {
      return next.handle();
    }

    ctx.i18nService = this.i18nService;

    language = await resolveLanguage(this.i18nResolvers, context, this.moduleRef);

    ctx.i18nLang = language || this.i18nOptions.fallbackLanguage;

    const response =
      context.getType<string>() === 'http'
        ? context.switchToHttp().getResponse()
        : ctx?.res;

    if (response?.locals) {
      response.locals.i18nLang = ctx.i18nLang;
    }

    if (!i18nContext) {
      ctx.i18nContext = new I18nContext(ctx.i18nLang, this.i18nService);

      if (!this.i18nOptions.skipAsyncHook) {
        return new Observable((observer) => {
          I18nContext.createAsync(ctx.i18nContext, async (error) => {
            if (error) {
              throw error;
            }
            return next.handle().subscribe(observer);
          });
        });
      }
    }

    return next.handle();
  }

}
