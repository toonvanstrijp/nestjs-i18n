import { ValidationError } from '@nestjs/common';

export interface I18nValidationExceptionFilterDetailedErrorsOption {
  detailedErrors?: boolean;
}

export interface I18nValidationExceptionFilterErrorFormatterOption {
  errorFormatter?: (errors: ValidationError[]) => object;
}
