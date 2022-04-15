---
sidebar_position: 3
---

# ejs

To enable [**ejs**](https://github.com/mde/ejs) support make use of the `viewEngine` option inside your `I18nModule`.

```diff title="src/app.module.ts"
  I18nModule.forRoot({
    fallbackLanguage: 'en',
    loaderOptions: {
      path: path.join(__dirname, '/i18n/'),
    },
+   viewEngine: 'ejs'
  })
```

## Example usage

Let's try to do some translations with pug templates.

```json title="src/i18n/en/test.json"
{
  "HELLO": "Hello {username}",
}
```

```typescript title="src/app.controller.ts"

@Controller('Test')
export class TestController {
  @Get('/')
  @Render('page')
  index(): any {
    return { username: "Toon" };
  }
}

```

```hbs title="src/view/page.hbs"
<h1><%= t('test.HELLO', i18nLang, { username }) -%></h1>
```

:::caution

The second parameter `i18nLang` is the current language. There is no way of passing this to `nestjs-i18n` automatically. So you have to pass it manually.

:::

:::tip

The third argument is optional. This is only needed if you want to pass along arugments to your translations.

:::

### Result
<code>
  <h1>Hello Toon</h1>
</code>