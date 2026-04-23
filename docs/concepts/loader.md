---
sidebar_position: 1
---

# Loaders

Loaders are responsible for fetching translation data and the list of available languages. `nestjs-i18n` ships two loaders out of the box: `I18nJsonLoader` (default) and `I18nYamlLoader`.

## Single loader (legacy)

Pass a loader class via the `loader` option together with `loaderOptions`:

```typescript title="src/app.module.ts"
I18nModule.forRoot({
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, '/i18n/'),
  },
  loader: I18nYamlLoader,
}),
```

:::caution

The `loader` / `loaderOptions` API is deprecated. Prefer the `loaders` array described below.

:::

## Multiple loaders

Pass an array of pre-instantiated loader objects via the `loaders` option. Translations and languages from every loader are **deep-merged** at startup, so you can combine, for example, a file-based loader with a database loader:

```typescript title="src/app.module.ts"
I18nModule.forRoot({
  fallbackLanguage: 'en',
  loaders: [
    new I18nJsonLoader({ path: path.join(__dirname, '/i18n/') }),
    new MyDatabaseLoader(),
  ],
}),
```

When the same key exists in multiple loaders the **last** loader wins. Deeply nested objects are merged recursively, so partial overrides are safe.

## Custom loader

Extend the abstract `I18nLoader` class and implement two methods:

| Method | Return type | Purpose |
|---|---|---|
| `languages()` | `Promise<string[]>` or `Promise<Observable<string[]>>` | Return all supported language codes |
| `load()` | `Promise<I18nTranslation>` or `Promise<Observable<I18nTranslation>>` | Return the full translations map keyed by language code |

```typescript title="src/my.loader.ts"
import { I18nLoader } from 'nestjs-i18n';
import { I18nTranslation } from 'nestjs-i18n';

export class MyDatabaseLoader extends I18nLoader {
  async languages(): Promise<string[]> {
    // fetch language codes from your data source
    return ['en', 'nl'];
  }

  async load(): Promise<I18nTranslation> {
    // fetch and return translations keyed by language
    return {
      en: { greeting: 'Hello' },
      nl: { greeting: 'Hallo' },
    };
  }
}
```

### Watch mode

If you want the loader to push live updates (e.g. when translation files change on disk), return an `Observable` instead of a plain value from `languages()` and/or `load()`. `nestjs-i18n` will subscribe and automatically update the running application when new values are emitted.

`I18nAbstractLoader` (the base class used by `I18nJsonLoader` and `I18nYamlLoader`) implements this pattern via `chokidar`. Enable it with `watch: true` in loader options:

```typescript
new I18nJsonLoader({
  path: path.join(__dirname, '/i18n/'),
  watch: true,
}),
```

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
