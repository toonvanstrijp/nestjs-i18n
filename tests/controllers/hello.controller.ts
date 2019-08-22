import { Controller, Get } from '@nestjs/common';
import { I18nLang, I18nService } from '../../lib';

@Controller('hello')
export class HelloController {
  constructor(private i18n: I18nService) {}

  @Get()
  hello(@I18nLang() lang: string): string {
    return this.i18n.translate('test.HELLO', { lang });
  }
}
