# Common errors

During your development with NestJS, you may encounter various errors as you learn the framework. This page will try to list the most common errors and how to fix them.

### Cannot find module 'typescript'

This is not likely to be encountered but anyone who has this issue has two options as a quick fix:

- Add typescript to dependencies in your package.json and run a project
- Comment out (or remove) `__exportStar(require("./typescript"), exports);` in `node_modules/nestjs-i18n/dist/utils/index.js`

### translating nested translations without arguments

```json
// translations.json
{
  "nestedValue": "world",
  "foo": "Hello $t(translations.nestedValue)"
}
```

```ts
// foo.service.ts
i18n.translate("translations.foo") // result: "Hello $t(translations.nestedValue)"

// to get the actual translations , just pass in empty args
i18n.translate("translations.foo", { args: {} }) // result: "Hello world"
```

## Do I need class-validator?

No, unless you use i18n validation features.

`nestjs-i18n` only requires `class-validator` when calling validation-related APIs such as `i18n.validate(...)` or using validation pipes/filters.

If you do not use those features, you can omit `class-validator` from your project.

