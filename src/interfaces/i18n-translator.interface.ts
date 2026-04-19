import { TranslateOptions } from '../services/i18n.service';
import { I18nTypeOptions, IfAnyOrNever, Path, PathValue } from '../types';
import { I18nValidationError } from './i18n-validation-error.interface';

export interface I18nTranslator<K = I18nTypeOptions['resources']> {
  translate<P extends Path<K> = any, R = PathValue<K, P>>(
    key: P,
    options?: TranslateOptions,
  ): IfAnyOrNever<R, string, R>;

  t<P extends Path<K> = any, R = PathValue<K, P>>(
    key: P,
    options?: TranslateOptions,
  ): IfAnyOrNever<R, string, R>;

  validate(
    value: any,
    options?: TranslateOptions,
  ): Promise<I18nValidationError[]>;
}
