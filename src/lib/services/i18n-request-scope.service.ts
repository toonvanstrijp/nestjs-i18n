import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { I18nService } from './i18n.service';

@Injectable({ scope: Scope.REQUEST })
export class I18nRequestScopeService {
  readonly detectedLanguage: string;

  constructor(
    @Inject(REQUEST) private readonly req,
    private readonly i18nService: I18nService,
  ) {
    this.detectedLanguage =
      req.i18nLang || (req.raw ? req.raw.i18nLang : undefined);
  }

  public translate(key, options?) {
    options = {
      lang: this.detectedLanguage,
      ...options,
    };
    return this.i18nService.translate(key, options);
  }
}
