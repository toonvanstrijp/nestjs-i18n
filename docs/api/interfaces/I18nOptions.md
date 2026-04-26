# Interface: I18nOptions

Defined in: [src/interfaces/i18n-options.interface.ts:57](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L57)

## Properties

### disableMiddleware?

> `optional` **disableMiddleware?**: `boolean`

Defined in: [src/interfaces/i18n-options.interface.ts:69](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L69)

***

### fallbackLanguage

> **fallbackLanguage**: `string`

Defined in: [src/interfaces/i18n-options.interface.ts:58](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L58)

***

### fallbacks?

> `optional` **fallbacks?**: [`I18nFallbacks`](I18nFallbacks.md)

Defined in: [src/interfaces/i18n-options.interface.ts:59](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L59)

***

### formatter?

> `optional` **formatter?**: [`Formatter`](../type-aliases/Formatter.md)

Defined in: [src/interfaces/i18n-options.interface.ts:66](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L66)

***

### icuLocales?

> `optional` **icuLocales?**: `string`[]

Defined in: [src/interfaces/i18n-options.interface.ts:84](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L84)

***

### icuOptions?

> `optional` **icuOptions?**: [`I18nICUOptions`](I18nICUOptions.md)

Defined in: [src/interfaces/i18n-options.interface.ts:83](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L83)

***

### joinArrays?

> `optional` **joinArrays?**: `string`

Defined in: [src/interfaces/i18n-options.interface.ts:80](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L80)

Join array translations into a single string using this delimiter.

***

### keySeparator?

> `optional` **keySeparator?**: `string` \| `false`

Defined in: [src/interfaces/i18n-options.interface.ts:74](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L74)

Configure how translation keys are split into nested paths. Set false to disable splitting.

***

### ~~loader?~~

> `optional` **loader?**: `Type`\<[`I18nLoader`](../classes/I18nLoader.md)\>

Defined in: [src/interfaces/i18n-options.interface.ts:62](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L62)

#### Deprecated

Use `loaders` instead

***

### ~~loaderOptions?~~

> `optional` **loaderOptions?**: `any`

Defined in: [src/interfaces/i18n-options.interface.ts:64](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L64)

#### Deprecated

Use `loaders` instead

***

### loaders?

> `optional` **loaders?**: [`I18nLoader`](../classes/I18nLoader.md)[]

Defined in: [src/interfaces/i18n-options.interface.ts:65](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L65)

***

### logging?

> `optional` **logging?**: `boolean`

Defined in: [src/interfaces/i18n-options.interface.ts:67](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L67)

***

### nsSeparator?

> `optional` **nsSeparator?**: `string` \| `false`

Defined in: [src/interfaces/i18n-options.interface.ts:76](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L76)

Configure namespace separator (for example test:HELLO). Set false to disable namespace parsing.

***

### resolvers?

> `optional` **resolvers?**: [`I18nOptionResolver`](../type-aliases/I18nOptionResolver.md)[]

Defined in: [src/interfaces/i18n-options.interface.ts:60](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L60)

***

### returnObjects?

> `optional` **returnObjects?**: `boolean`

Defined in: [src/interfaces/i18n-options.interface.ts:78](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L78)

Whether object/array translations are returned instead of the key when translating structured values.

***

### skipAsyncHook?

> `optional` **skipAsyncHook?**: `boolean`

Defined in: [src/interfaces/i18n-options.interface.ts:70](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L70)

***

### throwOnMissingKey?

> `optional` **throwOnMissingKey?**: `boolean`

Defined in: [src/interfaces/i18n-options.interface.ts:72](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L72)

***

### typesOutputPath?

> `optional` **typesOutputPath?**: `string`

Defined in: [src/interfaces/i18n-options.interface.ts:81](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L81)

***

### useICU?

> `optional` **useICU?**: `boolean`

Defined in: [src/interfaces/i18n-options.interface.ts:82](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L82)

***

### validatorOptions?

> `optional` **validatorOptions?**: `ValidatorOptions`

Defined in: [src/interfaces/i18n-options.interface.ts:71](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L71)

***

### viewEngine?

> `optional` **viewEngine?**: [`I18nViewEngine`](../type-aliases/I18nViewEngine.md)

Defined in: [src/interfaces/i18n-options.interface.ts:68](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L68)
