import {
  Inject,
  Injectable,
  Type,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { I18N_OPTIONS, I18N_RESOLVERS } from '../i18n.constants';
import { I18nOptions, I18nResolver, ResolverWithOptions } from '../index';
import { I18nService } from '../services/i18n.service';
import { ModuleRef, Reflector } from '@nestjs/core';
import { shouldResolve } from '../utils/util';
import { I18nOptionResolver } from '../interfaces/i18n-options.interface';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    let language = null;

    const ctx = getContextObject(context);

    if (ctx) {
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

      ctx.i18nLang = language;
    }

    return next.handle();
  }

  async use(req: any, res: any, next: () => void) {
    let language = null;

    req.i18nService = this.i18nService;
    for (const r of this.i18nResolvers) {
      const resolver = await this.getResolver(r);

      language = resolver.resolve(req);

      if (language instanceof Promise) {
        language = await (language as Promise<string>);
      }

      if (language !== undefined) {
        break;
      }
    }
    req.i18nLang = language || this.i18nOptions.fallbackLanguage;

    next();
  }

  private async getResolver(r: I18nOptionResolver): Promise<I18nResolver> {
    if (shouldResolve(r)) {
      if (r.hasOwnProperty('use') && r.hasOwnProperty('options')) {
        const resolver = r as ResolverWithOptions;
        return await this.moduleRef.resolve(resolver.use);
      } else {
        return await this.moduleRef.resolve(r as Type<I18nResolver>);
      }
    } else {
      return r as I18nResolver;
    }
  }
}
