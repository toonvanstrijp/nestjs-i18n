---
sidebar_position: 1
---

# Formatting

`nestjs-i18n` uses **[string-format](https://www.npmjs.com/package/string-format)** for formatting by default.

First define arguments in your translations

```json title="src/i18n/en/test.json"
{
  "HELLO": "Hello {username}",
}
```

To provide `nestjs-i18n` with the right arguments pass them down while doing the translation
```typescript
i18n.t('test.HELLO', {args: { username: 'Toon' }})
// => Hello Toon
```

:::tip
To define your own formatting function change the `formatter`. Read the instructions [here](#custom-formatter).
:::

## Array arguments

You can also use an array of arguments

```json title="src/i18n/en/test.json"
{
  "HELLO": "Hello {0.username}, This library is {1.opinion}",
}
```

```typescript
i18n.t('test.HELLO', {args: [{ username: 'Toon' }, {opinion: 'Terrible :\')'}]})
// => Hello Toon, This library is Terrible :')
```

## Custom formatter

To use a custom formatter define the `formatter` option. This option takes a function with a `template` and `...args`.

```typescript title="src/app.module.ts"
import { Module } from '@nestjs/common';
import * as path from 'path';
import { I18nJsonLoader, I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      formatter: (template: string, ...args: any[]) => template,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      }
    }),
  ],
  controllers: [],
})
export class AppModule {}
```