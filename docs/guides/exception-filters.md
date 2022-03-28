---
sidebar_position: 9
---

# Exception filters

To access the `I18nContext` inside your exception filters use the `getI18nContextFromArgumentsHost` helper function.

```typescript title="src/test.filter.ts"
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { getI18nContextFromArgumentsHost } from "nestjs-i18n";

@Catch()
export class TestExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);
    const response = host.switchToHttp().getResponse<any>();

    console.log('current language', i18n.lang);

    response
      .status(500)
      .send(`Your language is: ${i18n.lang}`);
  }
}
```