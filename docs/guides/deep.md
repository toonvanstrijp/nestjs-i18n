---
sidebar_position: 3
---

# Deep Folders

`nestjs-i18n` supports translations in deep (nested) folders.

You can use deep (nested) translation folders by setting the loader option `includeDeepFolders: true`.

```ts
I18nModule.forRoot({
  loaderOptions: {
    path: path.join(__dirname, '/i18n/'),
    includeDeepFolders: true,
  },
}),
```

As an example, assuming a file named `test.json` located in `src/i18n/en/deep/deeper/`:

```json title="src/i18n/en/deep/deeper/test.json"
{
  "HELLO": "World"
}
```

You would consume it with the translation key prefixed by the folder path (`.`-separated):

```typescript
i18n.t('deep.deeper.test.HELLO');
// => World
```
