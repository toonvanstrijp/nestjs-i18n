import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { I18nService } from '../services/i18n.service';
import { Observable } from 'rxjs';

@Injectable()
export class I18nLanguageInterceptor implements NestInterceptor {
  constructor(private readonly i18nService: I18nService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    await this.i18nService.getLanguageByContext(context);

    return next.handle();
  }
}
