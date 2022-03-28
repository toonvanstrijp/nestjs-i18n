---
sidebar_position: 3
---

# Fallback languages

To configure one or more fallback languages use the `fallbackLanguage` and `fallbacks` options. 

The `fallbackLanguage` languages is used when no language is resolved.

```typescript title="src/app.module.ts"
I18nModule.forRoot({
  fallbackLanguage: 'en',
  fallbacks: {
    'en-CA': 'fr',
    'en-*': 'en',
    'fr-*': 'fr',
    pt: 'pt-BR',
  },
  loaderOptions: {
    path: path.join(__dirname, '/i18n/'),
  },
});
```

:::tip

With the `fallbacks` option you can have different `fallbackLanguage` for each language. (It works like a regex `en-ZA` will fallback to `en`).

:::