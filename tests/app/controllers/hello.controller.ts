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
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
  I18n,
  I18nContext,
  I18nLang,
  I18nService,
  I18nValidationExceptionFilter,
} from '../../../src';
import { I18nTranslations } from '../../generated/i18n.generated';
import { CreateUserDto } from '../dto/create-user.dto';
import { exampleErrorFormatter } from '../examples/example.functions';
import { TestException, TestExceptionFilter } from '../filter/test.filter';
import { TestGuard } from '../guards/test.guard';
import { Hero, HeroById } from '../interfaces/hero.interface';

@Controller('hello')
@UseFilters(new TestExceptionFilter())
export class HelloController {
  constructor(private i18n: I18nService<I18nTranslations>) {}

  @Get()
  hello(@I18nLang() lang: string): any {
    return this.i18n.translate('test.HELLO', { lang });
  }

  @Get('/typed')
  helloTyped(@I18nLang() lang: string): string {
    return this.i18n.translate('test.HELLO', { lang });
  }

  @Get('/index')
  @Render('index')
  index(): any {
    return { count: 1 };
  }

  @Get('/index2')
  @Render('index2')
  index2(): any {}

  @Get('/index3')
  @Render('index3')
  index3(): any {}

  @Get('/short')
  helloShort(@I18nLang() lang: string): any {
    return this.i18n.t('test.HELLO', { lang });
  }

  @Get('/short/typed')
  helloShortTyped(@I18nLang() lang: string): string {
    return this.i18n.t('test.HELLO', { lang });
  }

  @Get('/context')
  helloContext(@I18n() i18n: I18nContext<I18nTranslations>): any {
    return i18n.translate('test.HELLO');
  }

  @Get('/context/typed')
  helloContextTyped(@I18n() i18n: I18nContext<I18nTranslations>): string {
    return i18n.translate('test.HELLO');
  }

  @Get('/short/context')
  helloShortContext(@I18n() i18n: I18nContext<I18nTranslations>): any {
    return i18n.t('test.HELLO');
  }

  @Get('/short/context/typed')
  helloShortContextTyped(@I18n() i18n: I18nContext<I18nTranslations>): string {
    return i18n.t('test.HELLO');
  }

  @Get('/request-scope')
  helloRequestScope(): any {
    return I18nContext.current<I18nTranslations>().translate('test.HELLO');
  }

  @Get('/request-scope/typed')
  helloRequestScopeTyped(): string {
    return I18nContext.current<I18nTranslations>().translate('test.HELLO');
  }

  @Get('/short/request-scope')
  helloShortRequestScope(): any {
    return I18nContext.current<I18nTranslations>().t('test.HELLO');
  }

  @Get('/short/request-scope/typed')
  helloShortRequestScopeTyped(): string {
    return I18nContext.current<I18nTranslations>().t('test.HELLO');
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
    return I18nContext.current<I18nTranslations>().translate(
      'test.day_interval',
      {
        args: { count: parseInt(count) },
      },
    );
  }

  @Get('/nested')
  nested(@Query('username') username: string): any {
    return I18nContext.current<I18nTranslations>().translate('test.nested', {
      args: { username },
    });
  }

  @Get('/nested-no-args')
  nestedNoArgs(): any {
    return I18nContext.current<I18nTranslations>().translate(
      'test.nested-no-args',
    );
  }

  @Get('/deeply-nested')
  deeplyNested(@Query('count') count: number): any {
    return I18nContext.current<I18nTranslations>().translate(
      'test.nest1.nest2.nest3',
      {
        args: { count },
      },
    );
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

  @Post('/validation-with-custom-http-code')
  @UseFilters(new I18nValidationExceptionFilter({ errorHttpStatusCode: 422 }))
  validationWithCustomHttpCode(@Body() createUserDto: CreateUserDto): any {
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

  @Post('/custom-validation')
  customValidation(@I18n() i18n: I18nContext<I18nTranslations>): any {
    let createUserDto = new CreateUserDto();
    return i18n.validate(createUserDto);
  }

  @GrpcMethod('HeroesService', 'FindOne')
  findOne(
    @Payload() data: HeroById,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Hero {
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
