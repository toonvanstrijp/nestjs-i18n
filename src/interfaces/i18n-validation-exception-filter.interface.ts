import { ArgumentsHost, HttpStatus, ValidationError } from '@nestjs/common';
import { I18nValidationException } from './i18n-validation-error.interface';

interface I18nValidationExceptionFilterCommonErrorsOption {
  errorHttpStatusCode?: HttpStatus | number;
}

export interface I18nValidationExceptionFilterDetailedErrorsOption
  extends I18nValidationExceptionFilterCommonErrorsOption {
  detailedErrors?: boolean;
}

export interface I18nValidationExceptionFilterErrorFormatterOption
  extends I18nValidationExceptionFilterCommonErrorsOption {
  errorFormatter?: (errors: ValidationError[]) => object;
  responseBodyFormatter?: (
    host: ArgumentsHost,
    exc: I18nValidationException,
    formattedErrors: object,
  ) => Record<string, unknown>;
}
