import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/hello')
  async getI18nHello(@I18n() i18n: I18nContext) {
    return await i18n.t('test.HELLO');
  }
}
