import { Inject } from '@nestjs/common';
import { I18N_RESOLVER_OPTIONS } from '..';

export function getI18nResolverOptionsToken(target: () => void) {
  return `${target.name}${I18N_RESOLVER_OPTIONS}`;
}

export function I18nResolverOptions() {
  return (target: () => void, key: string | symbol, index?: number): any => {
    return Inject(getI18nResolverOptionsToken(target))(target, key, index);
  };
}
