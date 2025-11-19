import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { i18nValidationMessage } from '../../../src';
import { I18nTranslations } from '../../generated/i18n.generated';

class PostDto {
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.nested'),
  })
  title: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.nested'),
  })
  body: string;
}

export class PostsDto {
  @ValidateNested({ each: true })
  @Type(() => PostDto)
  posts: PostDto[];
}
