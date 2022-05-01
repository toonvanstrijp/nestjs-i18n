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

If you need to implement custom loaders , your loader needs to extend  `src/loaders/i18n.abstract.loader.ts` interface. Also you can check the `src/loaders` to see how to default loaders are implemented.

:::

### Example: Custom loader coming soon
