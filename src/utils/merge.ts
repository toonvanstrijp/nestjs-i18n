import { I18nTranslation } from '../interfaces';
import mergician from 'mergician';

function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function mergeDeep(target: I18nTranslation, ...sources: any) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key] as I18nTranslation, source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export function mergeTranslations(
  first: I18nTranslation,
  second: I18nTranslation,
): I18nTranslation {
  return mergician(first, second);
}
