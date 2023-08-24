import {
  ArgumentMetadata,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { I18nContext } from '../i18n.context';
import { i18nValidationErrorFactory } from '../utils';

export type I18nValidationPipeOptions = Omit<
  ValidationPipeOptions,
  'exceptionFactory'
>;

export class I18nValidationPipe extends ValidationPipe {
  constructor(options?: I18nValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: i18nValidationErrorFactory(),
    });
  }

  protected toValidate(metadata: ArgumentMetadata): boolean {
    const { metatype } = metadata;
    return metatype !== I18nContext && super.toValidate(metadata);
  }
}
