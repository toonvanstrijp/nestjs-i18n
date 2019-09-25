export interface I18nResolver<TRequest = any, TResponse = string> {
  resolve(req: TRequest): TResponse;
}
