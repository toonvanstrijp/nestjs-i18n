import { createParamDecorator } from '@nestjs/common';

// support express and fastify
export const I18nLang = createParamDecorator((data, req) => {
  return req.i18nLang || (req.raw ? req.raw.i18nLang : null);
});
