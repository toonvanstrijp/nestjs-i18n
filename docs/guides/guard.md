# Guards

To access the `I18nContext` inside your guards use the `I18nContext.current()` helper function.

```typescript title="src/test.guard.ts"
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { I18nContext } from "nestjs-i18n";

@Injectable()
export class TestGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const i18n = I18nContext.current();
    console.log('current language', i18n.lang);

    return true;
  }
}
```

:::warning

This only works when running in an `http` context! So it works with `express`, `fastify` and `graphql` (most parts).

Internally `nestjs-i8n` uses a middleware instead of an interceptor when running in an `http` context. To disable this behaviour set the `disableMiddleware` option to `true`.

:::
