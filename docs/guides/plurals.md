---
sidebar_position: 4
---

# Plurals

You can use plurals inside your translations as followed. You need to provide some of the listed categories required by your language rules: `zero`, `one`, `two`, `few`, `many`, and `other`. To check which categories you need to specify for your language, you can use this reference: [Language Plural Rules](https://unicode-org.github.io/cldr-staging/charts/37/supplemental/language_plural_rules.html). After finding your language in the table, check out the **Type** column. The **cardinal** type includes all plural categories you must implement. The next **Example** column will help you find out the correct form for each category.

```json title="src/i18n/en/test.json"
{
  "day_interval": {
    "one": "Every day",
    "other": "Every {count} days",
    "zero": "Never"
  },
  "cat": {
    "one": "cat",
    "other": "cats",
    "zero": "cats"
  }
}
```

For i18n to pick the right plural you need to provide a `count` argument within the translation function.

```typescript title="src/app.controller.ts"
await i18n.t('test.day_interval', {
  args: { count: 1 },
});
```

> Note: English plural rules does not require `zero` category. This behavior has been kept for backwards compatibility and will work for any language.

```json title="src/i18n/uk/test.json"
{
  "day_interval": {
    "one": "{count} день",
    "few": "{count} дні",
    "many": "{count} днів",
    "other": "{count} дня"
  }
}
```

```typescript title="src/app.controller.ts"
await i18n.t('test.day_interval', { args: { count: 1 } }); // => 1 день
await i18n.t('test.day_interval', { args: { count: 2 } }); // => 2 дні
await i18n.t('test.day_interval', { args: { count: 5 } }); // => 5 днів
await i18n.t('test.day_interval', { args: { count: 1.5 } }); // => 1.5 дня
```
