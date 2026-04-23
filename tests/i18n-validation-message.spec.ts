import { i18nValidationMessage } from '../src';
import { I18nTranslations } from './generated/i18n.generated';

describe('i18nValidationMessage types', () => {
  it('should allow plain string keys when generic is omitted', () => {
    const messageFactory = i18nValidationMessage('validation.IsPositive');

    expect(typeof messageFactory).toBe('function');
  });

  it('should keep path safety when generic is provided', () => {
    const typedMessageFactory = i18nValidationMessage<I18nTranslations>('validation.MIN');

    expect(typeof typedMessageFactory).toBe('function');

    // @ts-expect-error invalid translation key should be rejected with typed translations
    i18nValidationMessage<I18nTranslations>('validation.DoesNotExist');
  });
});
