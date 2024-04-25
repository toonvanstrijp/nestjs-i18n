---
sidebar_position: 1
---

# Type safety

`nestjs-i18n` can generate types! This way your translations will be completely type safe! 🎉

![type safety demo](./../../static/img/type-safety.gif)

To use generated types specify the `typesOutputPath` option to let `nestjs-i18n` know where to put them.

```typescript title="src/app.module.ts"
import { Module } from '@nestjs/common';
import * as path from 'path';
import { I18nModule , I18nJsonLoader} from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaders: [
      new I18nJsonLoader({
      path: path.join(__dirname, '/i18n/'),
      }),
      ],
      typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
    }),
  ],
  controllers: [],
})
export class AppModule {}
```

> The `typesOutputPath` should also be added to `eslintignore` to prevent linting errors.

# Usage

To use the types within your code import the `I18nTranslations` type from the generated file. Pass this type into the generic type properties of the `I18nContext` or `I18nService`.

```typescript title="src/app.controller.ts"
import { Controller, Get } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from './generated/i18n.generated.ts';

@Controller()
export class AppController {

  @Get()
  async getHello(@I18n() i18n: I18nContext<I18nTranslations>) {
    return await i18n.t('test.HELLO');
  }
}
```

```typescript title="src/app.service.ts"
import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from './generated/i18n.generated.ts';

@Injectable()
export class AppService {
 constructor(
  private readonly i18n: I18nService<I18nTranslations>
){}

  getHello() {
    return this.i18n.translate("test.HELLO", {
      lang: I18nContext.current()?.lang,
    });
  }
}
```


:::tip
You can import the `I18nPath` type so you require a valid i18n path in your code. This is useful when handeling exceptions with translations.

```typescript title="src/app.service.ts"
import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from './generated/i18n.generated.ts';

@Injectable()
export class AppService {
 constructor(
  private readonly i18n: I18nService<I18nTranslations>
){}

  getHello() {
    return this.i18n.translate("test.HELLO", {
      lang: I18nContext.current()?.lang,
    });
  }
}
```
:::

:::caution
For now type safety is optional and need to be enabled. We're planning to make a breaking change where type safety is enabled by default.
:::

# Type safety with DTOS

You can also use the generated types in your DTOs. This way you can reduce the chance of having a typo in your validation messages.

```typescript title="src/craete-user.dto.ts"
import { I18nTranslations } from './generated/i18n.generated.ts';
import {
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>("validation.isNotEmpty")})
  @IsEmail({}, { message: i18nValidationMessage<I18nTranslations>("validation.isEmail")})
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>("validation.isNotEmpty")})
  password: string;

}

```
