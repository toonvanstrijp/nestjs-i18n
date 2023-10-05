import { ArgumentsHost } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { I18nTranslator, I18nValidationError } from './interfaces';
import { I18nService, TranslateOptions } from './services/i18n.service';
import { Path, PathValue } from './types';
import { getContextObject } from './utils';

export class I18nContext<K = Record<string, unknown>>
  implements I18nTranslator<K>
{
  private static storage = new AsyncLocalStorage<I18nContext>();
  private static counter = 1;
  readonly id = I18nContext.counter++;

  get i18n(): I18nContext<K> | undefined {
    return this;
  }

  constructor(readonly lang: string, readonly service: I18nService<K>) {}

  public translate<P extends Path<K> = any, R = PathValue<K, P>>(
    key: P,
    options?: TranslateOptions,
  ) {
    options = {
      lang: this.lang,
      ...options,
    };
    return this.service.translate<P, R>(key, options);
  }

  public t<P extends Path<K> = any, R = PathValue<K, P>>(
    key: P,
    options?: TranslateOptions,
  ) {
    return this.translate<P, R>(key, options);
  }

  public validate(
    value: any,
    options?: TranslateOptions,
  ): Promise<I18nValidationError[]> {
    options = {
      lang: this.lang,
      ...options,
    };
    return this.service.validate(value, options);
  }

  static create(ctx: I18nContext, next: (...args: any[]) => void): void {
    this.storage.run(ctx, next);
  }

  static async createAsync<T>(
    ctx: I18nContext,
    next: (...args: any[]) => Promise<T>,
  ): Promise<T> {
    return this.storage.run(ctx, next);
  }

  static current<K = Record<string, unknown>>(
    context?: ArgumentsHost,
  ): I18nContext<K> | undefined {
    const i18n = this.storage.getStore() as I18nContext<K> | undefined;

    if (!i18n && !!context) {
      return getContextObject(context)?.i18nContext;
    }

    return i18n;
  }
}
