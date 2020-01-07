import { Inject } from '@nestjs/common';
import { I18N_LANGUAGES } from '../i18n.constants';

export const I18nLanguages = () => {
  return Inject(I18N_LANGUAGES);
};
