---
sidebar_position: 11
---

# Debugging

For debugging purposes if you specify the language as **`debug`**, `nestjs-i18n` will only return the translation key instead of the actual translation.

```typescript
i18n.t('test.HELLO', {args: { username: 'Toon' }, lang: 'debug'})
// => test.HELLO
```