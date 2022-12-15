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
import { I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      typesOutputPath: path.join(__dirname, '/generated/i18n.generated.ts'),
    }),
  ],
  controllers: [],
})
export class AppModule {}
```

:::caution
For now type safety is optional and need to be enabled. We're planning to make a breaking change where type safety is enabled by default.
:::
