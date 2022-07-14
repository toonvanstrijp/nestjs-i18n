import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  I18n,
  I18nContext,
  I18nLang,
  I18nService,
  I18nValidationExceptionFilter,
} from '../../../src';
import { I18nRequestScopeService } from '../../../src/services/i18n-request-scope.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { TestException, TestExceptionFilter } from '../filter/test.filter';
import { TestGuard } from '../guards/test.guard';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { Hero, HeroById } from '../interfaces/hero.interface';
import { exampleErrorFormatter } from '../examples/example.functions';

@Controller('hello')
@UseFilters(new TestExceptionFilter())
export class HelloController {
  constructor(
    private i18n: I18nService,
    private i18nRequestScope: I18nRequestScopeService,
  ) { }

  @Get()
  hello(@I18nLang() lang: string): any {
    return this.i18n.translate('test.HELLO', { lang });
  }

  @Get('/typed')
  helloTyped(@I18nLang() lang: string): string {
    return this.i18n.translate<string>('test.HELLO', { lang });
  }

  @Get('/index')
  @Render('index')
  index(): any {
    return { count: 1 };
  }

  @Get('/index2')
  @Render('index2')
  index2(): any { }

  @Get('/short')
  helloShort(@I18nLang() lang: string): any {
    return this.i18n.t('test.HELLO', { lang });
  }

  @Get('/short/typed')
  helloShortTyped(@I18nLang() lang: string): string {
    return this.i18n.t<string>('test.HELLO', { lang });
  }

  @Get('/context')
  helloContext(@I18n() i18n: I18nContext): any {
    return i18n.translate('test.HELLO');
  }

  @Get('/context/typed')
  helloContextTyped(@I18n() i18n: I18nContext): string {
    return i18n.translate<string>('test.HELLO');
  }

  @Get('/short/context')
  helloShortContext(@I18n() i18n: I18nContext): any {
    return i18n.t('test.HELLO');
  }

  @Get('/short/context/typed')
  helloShortContextTyped(@I18n() i18n: I18nContext): string {
    return i18n.t<string>('test.HELLO');
  }

  @Get('/request-scope')
  helloRequestScope(): any {
    return this.i18nRequestScope.translate('test.HELLO');
  }

  @Get('/request-scope/typed')
  helloRequestScopeTyped(): string {
    return this.i18nRequestScope.translate<string>('test.HELLO');
  }

  @Get('/short/request-scope')
  helloShortRequestScope(): any {
    return this.i18nRequestScope.t('test.HELLO');
  }

  @Get('/short/request-scope/typed')
  helloShortRequestScopeTyped(): string {
    return this.i18nRequestScope.t<string>('test.HELLO');
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
  plurarization(@Query('count') count: string): any {
    return this.i18nRequestScope.translate('test.day_interval', {
      args: { count: parseInt(count) },
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
    throw new TestException();
  }

  @Post('/validation')
  @UseFilters(new I18nValidationExceptionFilter())
  validation(@Body() createUserDto: CreateUserDto): any {
    return 'This action adds a new user';
  }

  @Post('/validation-without-details')
  @UseFilters(new I18nValidationExceptionFilter({ detailedErrors: false }))
  validationWithoutDetails(@Body() createUserDto: CreateUserDto): any {
    return 'This action adds a new user';
  }

  @Post('/validation-with-keys')
  @UseFilters(new I18nValidationExceptionFilter({ detailedErrors: false }))
  validationWithKeys(@Body() createUserDto: CreateUserDto): any {
    return 'This action adds a new user';
  }

  @Post('/validation-custom-formatter')
  @UseFilters(
    new I18nValidationExceptionFilter({
      errorFormatter: exampleErrorFormatter,
    }),
  )
  validationCustomFormatter(@Body() createUserDto: CreateUserDto): any {
    return 'This action adds a new user';
  }



  @GrpcMethod('HeroesService', 'FindOne')
  findOne(@Payload() data: HeroById, @I18n() i18n: I18nContext): Hero {
    const items = [
      {
        id: 1,
        name: i18n.t('test.set-up-password.heading', {
          args: { username: 'John' },
        }),
      },
      { id: 2, name: 'Doe' },
    ];
    return items.find(({ id }) => id === data.id);
  }
}
