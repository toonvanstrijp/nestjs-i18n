import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export type I18nLoadingType = 'BY_LANGUAGE' | 'BY_DOMAIN';

export interface I18nOptions {
  path: string;
  fallbackLanguage?: string;
}

export interface I18nOptionsFactory {
  createI18nOptions(): Promise<I18nOptions> | I18nOptions;
}
export interface I18nAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<I18nOptionsFactory>;
  useClass?: Type<I18nOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<I18nOptions> | I18nOptions;
  inject?: any[];
}
