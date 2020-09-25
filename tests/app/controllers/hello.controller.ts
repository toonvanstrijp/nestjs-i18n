import { Controller, Get } from '@nestjs/common';
import { I18n, I18nContext, I18nLang, I18nService } from '../../../src';
import { I18nRequestScopeService } from '../../../src/services/i18n-request-scope.service';

@Controller('hello')
export class HelloController {
  constructor(
    private i18n: I18nService,
    private i18nRequestScope: I18nRequestScopeService,
  ) {}

  @Get()
  async hello(@I18nLang() lang: string): Promise<string> {
    return this.i18n.translate('test.HELLO', { lang });
  }

  @Get('/short')
  async helloShort(@I18nLang() lang: string): Promise<string> {
    return this.i18n.t('test.HELLO', { lang });
  }

  @Get('/context')
  helloContext(@I18n() i18n: I18nContext): Promise<string> {
    return i18n.translate('test.HELLO');
  }

  @Get('/short/context')
  helloShortContext(@I18n() i18n: I18nContext): Promise<string> {
    return i18n.t('test.HELLO');
  }

  @Get('/request-scope')
  helloRequestScope(): Promise<string> {
    return this.i18nRequestScope.translate('test.HELLO');
  }

  @Get('/short/request-scope')
  helloShortRequestScope(): Promise<string> {
    return this.i18nRequestScope.t('test.HELLO');
  }

  @Get('/object')
  object(): Promise<any> {
    return this.i18n.translate('test.set-up-password', {
      args: { username: 'KirillCherkalov' },
    });
  }

  @Get('/array')
  array(): Promise<any> {
    return this.i18n.translate('test.ARRAY');
  }
}
