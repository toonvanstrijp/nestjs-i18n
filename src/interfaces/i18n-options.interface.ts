import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { I18nResolver } from './i18n-language-resolver.interface';
import { I18nParser } from '../parsers/i18n.parser';

export type ResolverWithOptions = {
  use: Type<I18nResolver>;
  options: any;
};

export type I18nOptionsWithoutResolvers = Omit<
  I18nOptions,
  'resolvers' | 'parser'
>;

export type I18nOptionResolver =
  | ResolverWithOptions
  | Type<I18nResolver>
  | I18nResolver;

export type Formatter = (
  template: string,
  ...args: (string | Record<string, string>)[]
) => string;

export interface I18nOptions {
  fallbackLanguage: string;
  fallbacks?: { [key: string]: string };
  resolvers?: I18nOptionResolver[];
  parser?: Type<I18nParser>;
  parserOptions: any;
  formatter?: Formatter;
  logging?: boolean;
  viewEngine?: 'hbs'
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
  parser?: Type<I18nParser>;
  inject?: any[];
  logging?: boolean;
}
