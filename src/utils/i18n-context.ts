import { I18nContext, logger } from '..';
import { I18nError } from '../i18n.error';

export function getI18nContextOrThrow<K = Record<string, unknown>>(
  i18n: I18nContext<K> | undefined,
): I18nContext<K> {
  if (i18n === undefined) {
    logger.error(
      'I18n context not found! Is this function triggered by a processor or cronjob? Please use the I18nService',
    );
    throw new I18nError('I18n context undefined');
  }

  return i18n;
}
