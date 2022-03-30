import { HttpException, HttpStatus } from '@nestjs/common';

export interface I18nValidationError {
  property: string;
  children: I18nValidationError[];
  value?: any;
  constraints: { [key: string]: string };
}

export class I18nValidationException extends HttpException {
  constructor(public errors: I18nValidationError[]) {
    super('Bad Request', HttpStatus.BAD_REQUEST);
  }
}
