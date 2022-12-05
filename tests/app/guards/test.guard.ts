import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestContext } from '../../../src/utils/context';

@Injectable()
export class TestGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    let response = context.switchToHttp().getResponse();

    const i18n = RequestContext.getI18nContext();
    response.header(
      'X-Test',
      i18n.t('test.CURRENT_LANGUAGE', { args: { lang: i18n.lang } }),
    );

    return true;
  }
}
