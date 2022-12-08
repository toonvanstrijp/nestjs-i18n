import { ExecutionContext } from '@nestjs/common';

export interface I18nCustomContext {
  type: string;
  getContext: (context: ExecutionContext) => any;
}
