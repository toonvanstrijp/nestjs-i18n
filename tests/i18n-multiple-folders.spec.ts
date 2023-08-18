import { Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as path from 'path';
import {I18nJsonLoader, I18nModule, I18nService} from '../src';

describe('i18n async multiple folders', () => {
  let i18nService: I18nService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRootAsync({
          useFactory: () => {
            return {
              fallbackLanguage: 'en',
              loaders: [
                new I18nJsonLoader({
                  path: path.join(__dirname, '/i18n/'),
                }),
                new I18nJsonLoader({
                  path: path.join(__dirname, '/i18n-second/'),
                }),
              ],
            };
          },
        }),
      ],
    }).compile();

    i18nService = module.get(I18nService);
  });

  it('i18n service should be defined', async () => {
    expect(i18nService).toBeTruthy();
  });

  it('i18n service should return correct translation', async () => {
    expect(i18nService.translate('new_file.NEW_VALUE', { lang: 'en' })).toBe('NEW_VALUE');
    expect(i18nService.translate('new_file.NEW_VALUE_OBJECT.NEW_VALUE_OBJECT_KEY', { lang: 'en' })).toBe('NEW_VALUE');
    expect(i18nService.translate('validation.NEW_VALUE', { lang: 'en' })).toBe('NEW_VALUE');
    expect(i18nService.translate('validation.email', { lang: 'en' })).toBe('OVERRIDE');
    expect(i18nService.translate('validation.password', { lang: 'en' })).toBe('password');
    expect(i18nService.translate('test.HELLO', { lang: 'uk' })).toBe('Привіт');
  });
});

