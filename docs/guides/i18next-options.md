# i18next-Compatible Options

`nestjs-i18n` supports several options inspired by [i18next](https://www.i18next.com/) for flexible key resolution and return value control. These options can be set globally in `I18nModule.forRoot()` or overridden per translation call.

## keySeparator

Controls the character used to split nested translation keys.

**Default:** `'.'`

```typescript title="src/app.module.ts"
I18nModule.forRoot({
  fallbackLanguage: 'en',
  loaderOptions: { path: path.join(__dirname, '/i18n/') },
  keySeparator: '/',
})
```

```typescript
// With keySeparator: '/'
i18n.t('test/HELLO')       // resolves test → HELLO
i18n.t('test/nested/KEY')  // resolves test → nested → KEY
```

Set to `false` to treat the entire key as a literal (no splitting):

```typescript
I18nModule.forRoot({
  keySeparator: false,
})

// 'test.HELLO' is treated as a single literal key
i18n.t('test.HELLO')
```

You can also override per call:

```typescript
i18n.t('test.HELLO', { keySeparator: false })
```

---

## nsSeparator

Controls the character used to split a **namespace** prefix from the key. When set, the part before the separator is used as the namespace (top-level key), and the rest is the translation path.

**Default:** `false` (disabled — no namespace splitting)

```typescript title="src/app.module.ts"
I18nModule.forRoot({
  fallbackLanguage: 'en',
  loaderOptions: { path: path.join(__dirname, '/i18n/') },
  nsSeparator: ':',
})
```

```json title="src/i18n/en/test.json"
{
  "HELLO": "Hello World"
}
```

```typescript
// With nsSeparator: ':'
i18n.t('test:HELLO')   // => 'Hello World'
```

Override per call:

```typescript
i18n.t('test:HELLO', { nsSeparator: ':' })
```

---

## returnObjects

When a key resolves to an **object or array**, controls whether to return the structured value or the key string.

**Default:** `true` (return the object/array)

```json title="src/i18n/en/test.json"
{
  "ARRAY": ["ONE", "TWO", "THREE"],
  "NESTED": { "A": "alpha", "B": "beta" }
}
```

```typescript
i18n.t('test.ARRAY')   // => ['ONE', 'TWO', 'THREE']
i18n.t('test.NESTED')  // => { A: 'alpha', B: 'beta' }

// With returnObjects: false, returns the key instead
i18n.t('test.ARRAY', { returnObjects: false })   // => 'test.ARRAY'
i18n.t('test.NESTED', { returnObjects: false })  // => 'test.NESTED'
```

---

## joinArrays

When a key resolves to an **array**, joins the elements into a single string using the provided separator.

**Default:** `undefined` (arrays are returned as-is)

```json title="src/i18n/en/test.json"
{
  "ARRAY": ["ONE", "TWO", "THREE"]
}
```

```typescript
i18n.t('test.ARRAY', { joinArrays: ', ' })
// => 'ONE, TWO, THREE'

i18n.t('test.ARRAY', { joinArrays: ' | ' })
// => 'ONE | TWO | THREE'
```

Set globally in the module to apply to all translations:

```typescript title="src/app.module.ts"
I18nModule.forRoot({
  fallbackLanguage: 'en',
  loaderOptions: { path: path.join(__dirname, '/i18n/') },
  joinArrays: ', ',
})
```

Per-call options always override module-level defaults.

---

## Option Precedence

Per-call options take precedence over module-level options:

```typescript
I18nModule.forRoot({
  joinArrays: ' | ',    // module default
})

// This call overrides the module default
i18n.t('test.ARRAY', { joinArrays: ', ' })  // => 'ONE, TWO, THREE'
```

---

## Summary

| Option | Type | Default | Scope |
|--------|------|---------|-------|
| `keySeparator` | `string \| false` | `'.'` | module + per-call |
| `nsSeparator` | `string \| false` | `false` | module + per-call |
| `returnObjects` | `boolean` | `true` | module + per-call |
| `joinArrays` | `string` | `undefined` | module + per-call |
