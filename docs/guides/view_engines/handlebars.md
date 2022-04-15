---
sidebar_position: 1
---

# Handlebars

To enable [**handlebars**](https://handlebarsjs.com) support make use of the `viewEngine` option inside your `I18nModule`.

```diff title="src/app.module.ts"
  I18nModule.forRoot({
    fallbackLanguage: 'en',
    loaderOptions: {
      path: path.join(__dirname, '/i18n/'),
    },
+   viewEngine: 'hbs'
  })
```

:::caution

Handlebars is imported dynamically, so make sure to install it (`npm i hbs`). Otherwise `nestjs-i18n` can't register the helper function.

:::

## Example usage

Let's try to do some translations with handlebar templates.

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
    return { helloArgs: { username: "Toon" } };
  }
}

```

```hbs title="src/view/page.hbs"
<!doctype html>
<html>
  <body>
    <h1>{{ t 'test.HELLO' helloArgs }}</h1>
  </body>
</html>
```

:::tip

The third argument `helloArgs` is optional. This is only needed if you want to pass along arugments to your translations.

:::

### Result
<code>
  <h1>Hello Toon</h1>
</code>