import { IsNotEmpty, Min } from 'class-validator';
import { i18nValidationMessage } from '../../../src';

export class CreateCatInput {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  name: string;

  @Min(10, {
    message: i18nValidationMessage('validation.MIN', { message: 'COOL' }),
  })
  age: number;
}
