import { IsNotEmpty, Min } from 'class-validator';
import { i18n } from '../../../src';
import { I18nTranslations } from '../../generated/i18n.generated';

export class CreateCatInput {
  @IsNotEmpty({
    message: i18n<I18nTranslations>('validation.NOT_EMPTY'),
  })
  name: string;

  @Min(10, {
    message: i18n<I18nTranslations>('validation.MIN', {
      message: 'COOL',
    }),
  })
  age: number;
}
