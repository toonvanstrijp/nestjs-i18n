---
sidebar_position: 2
---

# Nested

`nestjs-i18n` supports nested translations. 

You can make nested translations by using this function.
```json
$t(auth.PAGE_HOME.TITLE)
```

To pass along arguments use
```json
{
  "WELCOME": "$t(auth.WELCOME, {{ \"username\": \"{username}\" }})"
}
```

Here is an example of how this looks in your translation files

```json title="src/i18n/en/test.json"
{
    "HELLO": "World",
    "WELCOME": "Hello {username}",
    "PAGE_HOME": {
        "TITLE": "Home to this $t(auth.HELLO)",
        "SUBTITLE": "$t(auth.WELCOME, {{ \"username\": \"{username}\" }}) this is the home page"
    }
}
```

```typescript
i18n.t('test.PAGE_HOME.SUBTITLE', {args: { username: 'Toon' } })
// => Hello Toon, this is the home page
```

:::tip
The [`formatter`](guides/formatting.md) is applied before doing nested translations. This way you can pass on arguments to your nested translations! 🎉
:::