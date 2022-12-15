# Exception filters

To access the `I18nContext` inside your exception filters use the `I18nContext.current()` helper function.

```typescript title="src/test.filter.ts"
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { I18nContext } from "nestjs-i18n";

@Catch()
export class TestExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const i18n = I18nContext.current<I18nTranslations>(host);
    const response = host.switchToHttp().getResponse<any>();

    console.log('current language', i18n.lang);

    response
      .status(500)
      .send(`Your language is: ${i18n.lang}`);
  }
}
```

:::caution

When using **http** or **graphql** `nestjs-i18n` uses `middleware` to make things work. However when throwing exceptions in [**middleware**](https://docs.nestjs.com/middleware#middleware) this can lead to throwing your exception before the `nestjs-i18n` middleware had been reached. To solve this problem you'll need to register the `I18nMiddleware` globally.

```typescript title="src/main.ts"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nMiddleware } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(I18nMiddleware);
  await app.listen(3000);
}
bootstrap();
```

or

```typescript title="src/app.module.ts"
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { I18nMiddleware } from 'nestjs-i18n';

@Module({
  ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(I18nMiddleware, MyMiddleware).forRoutes('*');
  }
}

```

:::