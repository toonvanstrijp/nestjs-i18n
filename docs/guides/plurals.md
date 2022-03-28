---
sidebar_position: 4
---

# Plurals
You can use plurals inside your translations as followed. You need to provide a `one`, `other` and `zero` translation for the pluralization to work.

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

For i18n to pick the right plural you need to provide a count argument within the translation function.

```typescript title="src/app.controller.ts"
await i18n.t('test.day_interval', {
  args: { count: 1 },
});
```