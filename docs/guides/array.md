# Arrays

You can use arrays inside your translations as followed.

```json title="src/i18n/en/test.json"
{
  "animals": [
    "cat",
    "dog",
    "elephant",
  ],
}
```

To get the data into i18n, you just need to provide a `.` followed by the array index, just like the following example

```typescript title="src/app.controller.ts"
await i18n.t('test.animals.0'); // cat
await i18n.t('test.animals.1'); // dog
await i18n.t('test.animals.2'); // elephant
```

You can also get the whole array, but translated.

```typescript title="src/app.controller.ts"
await i18n.t('test.animals') // ['cat', 'dog', 'elephant']
```