import { Controller, Get } from '@nestjs/common';
import { I18n, I18nContext, I18nLang, I18nService } from '../../../src/lib';
import { I18nRequestScopeService } from '../../../src/lib/services/i18n-request-scope.service';

@Controller('hello')
export class HelloController {
  constructor(
    private i18n: I18nService,
    private i18nRequestScope: I18nRequestScopeService,
  ) {}

  @Get()
  hello(@I18nLang() lang: string): string {
    return this.i18n.translate('test.HELLO', { lang });
  }

  @Get('/context')
  helloContext(@I18n() i18n: I18nContext): string {
    return i18n.translate('test.HELLO');
  }

  @Get('/request-scope')
  helloRequestScope(): string {
    return this.i18nRequestScope.translate('test.HELLO');
  }
}
