import { Type } from '@nestjs/common';
import {
  ClassProvider,
  ExistingProvider,
  FactoryProvider,
  ModuleMetadata,
  ValueProvider,
} from '@nestjs/common/interfaces';
import { I18nLoader } from '../loaders/i18n.loader';
import { I18nCustomContext } from './i18n-custom-context.interface';
import { I18nResolver } from './i18n-language-resolver.interface';
import { ValidatorOptions } from 'class-validator';

export interface OptionsProvider {
  options: any;
}

export type OptionProvider<T = any> =
  | Omit<ClassProvider<T>, 'provide'>
  | Omit<ValueProvider<T>, 'provide'>
  | Omit<FactoryProvider<T>, 'provide'>
  | Omit<ExistingProvider<T>, 'provide'>
  | OptionsProvider;

export type ResolverWithOptions = {
  use: Type<I18nResolver>;
} & OptionProvider;

export type I18nOptionsWithoutResolvers = Omit<
  I18nOptions,
  'resolvers' | 'loader'
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
  contexts?: I18nCustomContext[];
  loader?: Type<I18nLoader>;
  loaderOptions: any;
  formatter?: Formatter;
  logging?: boolean;
  viewEngine?: 'hbs' | 'pug' | 'ejs';
  disableMiddleware?: boolean;
  validatorOptions?: I18nValidatorOptions;
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
  contexts?: I18nCustomContext[];
  loader?: Type<I18nLoader>;
  inject?: any[];
  logging?: boolean;
}

export type I18nValidatorOptions = ValidatorOptions;
