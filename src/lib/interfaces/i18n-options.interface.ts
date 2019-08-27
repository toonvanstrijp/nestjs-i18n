import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { I18nResolver } from './i18n-language-resolver.interface';

export interface I18nOptions {
  path: string;
  fallbackLanguage: string;
  filePattern?: string;
  resolvers?: I18nResolver[];
  saveMissing?: boolean;
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
