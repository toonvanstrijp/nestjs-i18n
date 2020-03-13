export interface I18nResolver<TRequest = any> {
  resolve(req: TRequest): Promise<string> | string | string[] | undefined;
}
