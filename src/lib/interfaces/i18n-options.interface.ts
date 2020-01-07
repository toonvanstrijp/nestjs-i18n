import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { I18nResolver } from './i18n-language-resolver.interface';

export type ResolverWithOptions = {
  use: Type<I18nResolver>;
  options: any;
};

export type I18nOptionsWithoutResolvers = Omit<I18nOptions, 'resolvers'>;

export type I18nOptionResolver =
  | ResolverWithOptions
  | Type<I18nResolver>
  | I18nResolver;

export interface I18nOptions {
  path: string;
  fallbackLanguage: string;
  filePattern?: string;
  resolvers?: I18nOptionResolver[];
  saveMissing?: boolean;
}

export interface I18nOptionsFactory {
  createI18nOptions():
    | Promise<I18nOptionsWithoutResolvers>
    | I18nOptionsWithoutResolvers;
}
export interface I18nAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<I18nOptionsFactory>;
  useClass?: Type<I18nOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<I18nOptionsWithoutResolvers> | I18nOptionsWithoutResolvers;
  resolvers?: I18nOptionResolver[];
  inject?: any[];
}
