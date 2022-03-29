import {
  Controller,
  Get,
  Query,
  Render,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { I18n, I18nContext, I18nLang, I18nService } from '../../../src';
import { I18nRequestScopeService } from '../../../src/services/i18n-request-scope.service';
import { TestExceptionFilter } from '../filter/test.filter';
import { TestGuard } from '../guards/test.guard';

@Controller('hello')
@UseFilters(new TestExceptionFilter())
export class HelloController {
  constructor(
    private i18n: I18nService,
    private i18nRequestScope: I18nRequestScopeService,
  ) {}

  @Get()
  hello(@I18nLang() lang: string): any {
    return this.i18n.translate('test.HELLO', { lang });
  }

  @Get('/index')
  @Render('index')
  index(): any {
    return { count: 1 };
  }

  @Get('/short')
  helloShort(@I18nLang() lang: string): any {
    return this.i18n.t('test.HELLO', { lang });
  }

  @Get('/context')
  helloContext(@I18n() i18n: I18nContext): any {
    return i18n.translate('test.HELLO');
  }

  @Get('/short/context')
  helloShortContext(@I18n() i18n: I18nContext): any {
    return i18n.t('test.HELLO');
  }

  @Get('/request-scope')
  helloRequestScope(): any {
    return this.i18nRequestScope.translate('test.HELLO');
  }

  @Get('/short/request-scope')
  helloShortRequestScope(): any {
    return this.i18nRequestScope.t('test.HELLO');
  }

  @Get('/object')
  object(): any {
    return this.i18n.translate('test.set-up-password', {
      args: { username: 'KirillCherkalov' },
    });
  }

  @Get('/array')
  array(): any {
    return this.i18n.translate('test.ARRAY');
  }

  @Get('/plurarization')
  plurarization(@Query('count') count: number): any {
    return this.i18nRequestScope.translate('test.day_interval', {
      args: { count },
    });
  }

  @Get('/nested')
  nested(@Query('username') username: string): any {
    return this.i18nRequestScope.translate('test.nested', {
      args: { username },
    });
  }

  @Get('/nested-no-args')
  nestedNoArgs(): any {
    return this.i18nRequestScope.translate('test.nested-no-args');
  }

  @Get('/deeply-nested')
  deeplyNested(@Query('count') count: number): any {
    return this.i18nRequestScope.translate('test.nest1.nest2.nest3', {
      args: { count },
    });
  }

  @Get('/guard')
  @UseGuards(TestGuard)
  guard(): any {
    return 'NO';
  }

  @Get('/exception')
  exception(): any {
    throw new Error('Test exception');
  }
}
