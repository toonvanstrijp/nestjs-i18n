import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';
import { httpStatusToMessage } from '../utils';

export type I18nValidationError = ValidationError;

export class I18nValidationException extends HttpException {
  constructor(
    public errors: I18nValidationError[],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(httpStatusToMessage(status), status);
  }
}
