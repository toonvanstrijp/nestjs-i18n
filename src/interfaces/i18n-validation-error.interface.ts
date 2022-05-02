import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export type I18nValidationError = ValidationError;

export class I18nValidationException extends HttpException {
  constructor(public errors: I18nValidationError[]) {
    super('Bad Request', HttpStatus.BAD_REQUEST);
  }
}
