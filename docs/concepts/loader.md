---
sidebar_position: 1
---

# Loaders

The `loader` option is used to configure loaders, default being `I18nJsonLoader`. Currently `I18nJsonLoader` and `I18nYamlLoader` are supported out of the box.

```typescript title="src/app.module.ts"
       I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
          loader: I18nYamlLoader,
        }),
```

:::tip

If you need to implement custom loaders , your loader needs to extend `src/loaders/i18n.abstract.loader.ts` interface. Also you can check the `src/loaders` to see how to default loaders are implemented.

:::

### Example: Custom loader coming soon

## Subfolders

`nestjs-i18n` supports translations in (deep/nested) subfolders. By default, subfolders are not loaded via the standard (abstract) loader.

You can use subfolders by setting the loader option `includeSubfolders: true` as follows:

```ts
I18nModule.forRoot({
  loaderOptions: {
    path: path.join(__dirname, '/i18n/'),
    includeSubfolders: true,
  },
}),
```

As an example, assuming a file named `test.json` located in `src/i18n/en/sub1/sub2/`:

```json title="src/i18n/en/sub1/sub2/test.json"
{
  "HELLO": "World"
}
```

You would consume it with the translation key prefixed by the folder path (`.`-separated):

```typescript
i18n.t('sub1.sub2.test.HELLO');
// => World
```
