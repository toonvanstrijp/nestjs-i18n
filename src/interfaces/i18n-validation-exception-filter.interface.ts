import { HttpStatus, ValidationError } from '@nestjs/common';

export interface I18nValidationExceptionFilterDetailedErrorsOption {
  detailedErrors?: boolean;
  errorHttpStatusCode?: HttpStatus;
}

export interface I18nValidationExceptionFilterErrorFormatterOption {
  errorFormatter?: (errors: ValidationError[]) => object;
}
