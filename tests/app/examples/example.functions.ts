import { ValidationError } from '@nestjs/common';
import { mapChildrenToValidationErrors } from '../../../src/utils/format';
import {I18nValidationException} from "../../../src";

export const exampleErrorFormatter = (errors: ValidationError[]): object => {
  const errorMessages = {};

  for (let foo = 0; foo < errors.length; foo = foo + 1) {
    const mappedErrors = mapChildrenToValidationErrors(errors[foo]);

    for (let bar = 0; bar < mappedErrors.length; bar = bar + 1) {
      const error = mappedErrors[bar];
      errorMessages[error.property] = Object.values(error.constraints);
    }
  }

  return errorMessages;
};


export const exampleResponseBodyFormatter = (exc: I18nValidationException, formattedErrors: object) => {
    return {
      type: 'static',
      status: exc.getStatus(),
      message: exc.getResponse(),
      data: formattedErrors,
    };
}