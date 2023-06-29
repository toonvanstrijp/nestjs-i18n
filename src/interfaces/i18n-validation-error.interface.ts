import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export type I18nValidationError = ValidationError;

export class I18nValidationException extends HttpException {
  constructor(
    public errors: I18nValidationError[],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(HttpMessages[status], status);
  }
}

enum HttpMessages {
  'Continue' = 100,
  'Switching Protocols' = 101,
  'Processing' = 102,
  'Earlyhints' = 103,
  'Ok' = 200,
  'Created' = 201,
  'Accepted' = 202,
  'Non Authoritative Information' = 203,
  'No Content' = 204,
  'Reset Content' = 205,
  'Partial Content' = 206,
  'Ambiguous' = 300,
  'Moved Permanently' = 301,
  'Found' = 302,
  'See Other' = 303,
  'Not Modified' = 304,
  'Temporary Redirect' = 307,
  'Permanent Redirect' = 308,
  'Bad Request' = 400,
  'Unauthorized' = 401,
  'Payment Required' = 402,
  'Forbidden' = 403,
  'Not Found' = 404,
  'Method Not Allowed' = 405,
  'Not Acceptable' = 406,
  'Proxy Authentication Required' = 407,
  'Request Timeout' = 408,
  'Conflict' = 409,
  'Gone' = 410,
  'Length Required' = 411,
  'Precondition Failed' = 412,
  'Payload Too Large' = 413,
  'URI Too Long' = 414,
  'Unsupported Media Type' = 415,
  'Requested Range Not Satisfiable' = 416,
  'Expectation Failed' = 417,
  'I Am A Teapot' = 418,
  'Misdirected' = 421,
  'Unprocessable Entity' = 422,
  'Failed Dependency' = 424,
  'Precondition Required' = 428,
  'Too Many Requests' = 429,
  'Internal Server Error' = 500,
  'Not Implemented' = 501,
  'Bad Gateway' = 502,
  'Service Unavailable' = 503,
  'Gateway Timeout' = 504,
  'HTTP Version Not Supported' = 505,
}
