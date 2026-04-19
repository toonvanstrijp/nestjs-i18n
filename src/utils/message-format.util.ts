import { MessageFormat } from 'messageformat';

export class I18nMessageFormat {
  private readonly messageFormats = new Map<string, MessageFormat>();

  compile(message: string, locale: string): (params?: Record<string, any>) => string {
    try {
      let messageFormat = this.messageFormats.get(locale);
      if (!messageFormat) {
        messageFormat = new MessageFormat(locale);
        this.messageFormats.set(locale, messageFormat);
      }
      return messageFormat.compile(message);
    } catch {
      return () => message;
    }
  }

  compileObject(
    translations: Record<string, any>,
    locale: string,
  ): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key of Object.keys(translations)) {
      const value = translations[key];
      if (typeof value === 'string') {
        result[key] = this.compile(value, locale);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.compileObject(value, locale);
      } else {
        result[key] = value;
      }
    }

    return result;
  }
}