import { ExecutionContext, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { I18nResolver, ResolverWithOptions } from '../interfaces';
import { I18nOptionResolver } from '../interfaces/i18n-options.interface';
import { shouldResolve } from './util';

export async function resolveLanguage(
  resolvers: I18nOptionResolver[],
  context: ExecutionContext,
  moduleRef: ModuleRef,
): Promise<string | string[] | null> {
  for (const r of resolvers) {
    const resolver = await getResolver(r, moduleRef);

    let language = resolver.resolve(context);

    if (language instanceof Promise) {
      language = await language;
    }

    if (language !== undefined) {
      return language;
    }
  }

  return null;
}

export async function getResolver(
  r: I18nOptionResolver,
  moduleRef: ModuleRef,
): Promise<I18nResolver> {
  if (shouldResolve(r)) {
    if ('use' in r) {
      return moduleRef.get((r as ResolverWithOptions).use);
    }
    return moduleRef.get(r as Type<I18nResolver>);
  }
  return r as I18nResolver;
}
