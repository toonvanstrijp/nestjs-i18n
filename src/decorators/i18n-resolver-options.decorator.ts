import { Inject } from '@nestjs/common';
import { I18N_RESOLVER_OPTIONS } from '../i18n.constants';

export function getI18nResolverOptionsToken(target: () => void) {
  return `${target.name}${I18N_RESOLVER_OPTIONS}`;
}

export function I18nResolverOptions(): any {
  return (
    target: () => void,
    key: string | symbol,
    index?: number,
  ): unknown => {
    return Inject(getI18nResolverOptionsToken(target))(target, key, index);
  };
}
