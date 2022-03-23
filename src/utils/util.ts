import { I18nOptionResolver } from '../interfaces/i18n-options.interface';

export function shouldResolve(e: I18nOptionResolver) {
  return (
    typeof e === 'function' ||
    (e['use'] && e['options'])
  );
}
