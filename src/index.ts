export * from './i18n.module';
export {
  I18N_OPTIONS,
  I18N_TRANSLATIONS,
  I18N_LANGUAGES,
  I18N_RESOLVER_OPTIONS,
  I18N_RESOLVERS,
  I18N_PARSER_OPTIONS,
} from './i18n.constants';
export * from './i18n.context';

// services
export * from './services/i18n.service';
export * from './services/i18n-request-scope.service';

// interfaces
export * from './interfaces/i18n-options.interface';
export * from './interfaces/i18n-language-resolver.interface';
export * from './interfaces/i18n-translation.interface';

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

// build in parsers
export * from './parsers/i18n.parser';
export * from './parsers/i18n.json.parser';
