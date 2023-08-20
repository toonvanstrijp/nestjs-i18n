import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from '../../../src';
import { I18nTranslations } from '../../generated/i18n.generated';

export class ExtraUserDto {
  @IsBoolean({ message: 'validation.INVALID_BOOLEAN' })
  subscribeToEmail: string;

  @Min(5, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN', {
      message: 'COOL',
    }),
  })
  min: number;

  @Max(10, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX', {
      message: 'SUPER',
    }),
  })
  max: number;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  email: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  password: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => ExtraUserDto)
  extra: ExtraUserDto;
}
