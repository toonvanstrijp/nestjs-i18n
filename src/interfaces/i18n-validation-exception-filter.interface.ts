import { HttpStatus, ValidationError } from '@nestjs/common';

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
}
