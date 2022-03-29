import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getI18nContextFromRequest } from '../../../src/utils/util';

@Injectable()
export class TestGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    let response = context.switchToHttp().getResponse();

    const i18n = getI18nContextFromRequest(request);
    response.header(
      'X-Test',
      i18n.t('test.CURRENT_LANGUAGE', { args: { lang: i18n.lang } }),
    );

    return true;
  }
}
