import MessageFormat, { type MessageFunction } from '@messageformat/core';
import { I18nOptions } from '../interfaces/i18n-options.interface';

export class I18nMessageFormat {
  private readonly messageFormats = new Map<string, MessageFormat<'string'>>();

  constructor(private readonly i18nOptions: I18nOptions) {}

  get enabled(): boolean {
    return Boolean(this.i18nOptions.useICU);
  }

  compile(message: string, locale: string): MessageFunction<'string'> {
    try {
      let messageFormat = this.messageFormats.get(locale);
      if (!messageFormat) {
        messageFormat = new MessageFormat(this.i18nOptions.icuLocales ?? locale, {
          biDiSupport: this.i18nOptions.icuOptions?.biDiSupport,
          customFormatters: this.i18nOptions.icuOptions?.formatters,
        });
        this.messageFormats.set(locale, messageFormat);
      }

      return messageFormat.compile(message);
    } catch {
      return (() => message) as MessageFunction<'string'>;
    }
  }
}
