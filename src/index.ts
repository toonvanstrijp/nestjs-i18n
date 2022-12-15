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
export * from './interfaces/i18n-options.interface';
export * from './interfaces/i18n-language-resolver.interface';
export * from './interfaces/i18n-translation.interface';
export * from './interfaces/i18n-validation-error.interface';

// decorators
export * from './decorators/i18n-lang.decorator';
export * from './decorators/i18n-languages.decorator';
export * from './decorators/i18n-resolver-options.decorator';
export * from './decorators/i18n.decorator';

// build in resolvers
export * from './resolvers/header.resolver';
export * from './resolvers/accept-language.resolver';
export * from './resolvers/query.resolver';
export * from './resolvers/cookie.resolver';
export * from './resolvers/graphql-websocket.resolver';
export * from './resolvers/grpc-metadata.resolver';

// build in loaders
export * from './loaders/i18n.loader';
export * from './loaders/i18n.json.loader';
export * from './loaders/i18n.yaml.loader';

// interceptor
export * from './interceptors/i18n-language.interceptor';

// filters
export * from './filters/i18n-validation-exception.filter';

// middleware
export { I18nMiddleware } from './middlewares/i18n.middleware';

// utils
export {
  i18nValidationErrorFactory,
  i18nValidationMessage,
} from './utils/util';

// types
export { Path, PathValue } from './types';
