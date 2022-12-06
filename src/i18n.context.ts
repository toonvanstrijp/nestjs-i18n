import { AsyncLocalStorage } from 'async_hooks';
import { I18nValidationError } from './interfaces/i18n-validation-error.interface';
import { I18nService, TranslateOptions } from './services/i18n.service';

export class I18nContext {
  private static storage = new AsyncLocalStorage<I18nContext>();
  private static counter = 1;
  readonly id = I18nContext.counter++;

  get i18n(): I18nContext | undefined {
    return this;
  }

  constructor(readonly lang: string, readonly service: I18nService) {}

  public translate<T = any>(key: string, options?: TranslateOptions): T {
    options = {
      lang: this.lang,
      ...options,
    };
    return this.service.translate<T>(key, options);
  }

  public t<T = any>(key: string, options?: TranslateOptions): T {
    return this.translate<T>(key, options);
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

  static current(): I18nContext | undefined {
    return this.storage.getStore();
  }
}
