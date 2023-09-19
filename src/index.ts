export * from './i18n.module';
export {
  I18N_OPTIONS,
  I18N_TRANSLATIONS,
  I18N_LANGUAGES,
  I18N_RESOLVER_OPTIONS,
  I18N_RESOLVERS,
  I18N_LOADER_OPTIONS,
} from './i18n.constants';
export * from './i18n.context';

// services
export * from './services/i18n.service';

// interfaces
export * from './interfaces';

// decorators
export * from './decorators';

// build in resolvers
export * from './resolvers';

// build in loaders
export * from './loaders';

// interceptor
export * from './interceptors/i18n-language.interceptor';

// filters
export * from './filters/i18n-validation-exception.filter';

// middleware
export { I18nMiddleware } from './middlewares/i18n.middleware';

// pipes
export * from './pipes/i18n-validation.pipe';

// utils
export {
  i18nValidationErrorFactory,
  i18nValidationMessage,
  getContextObject,
} from './utils';

// types
export { Path, PathValue } from './types';
