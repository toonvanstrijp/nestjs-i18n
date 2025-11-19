import { IsNotEmpty, Min } from 'class-validator';
import { i18nValidationMessage } from '../../../src';
import { I18nTranslations } from '../../generated/i18n.generated';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCatInput {
  @Field(() => String)
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  name: string;

  @Field(() => Int)
  @Min(10, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN', {
      message: 'COOL',
    }),
  })
  age: number;
}
