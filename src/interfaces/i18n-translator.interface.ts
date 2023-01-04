import { TranslateOptions } from '../services/i18n.service';
import { IfAnyOrNever, Path, PathValue } from '../types';
import { I18nValidationError } from './i18n-validation-error.interface';

export interface I18nTranslator<K = Record<string, unknown>> {
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
