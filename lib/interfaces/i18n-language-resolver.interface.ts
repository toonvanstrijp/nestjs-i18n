export interface I18nResolver<TRequest = any, TResponse = any> {
  resolve(req: TRequest, res: TResponse): string | void;
}
