import { ExecutionContext } from '@nestjs/common';

export interface I18nResolver {
  resolve(
    context: ExecutionContext,
  ): Promise<string | string[] | undefined> | string | string[] | undefined;
}
