# Interface: I18nAsyncOptions

Defined in: [src/interfaces/i18n-options.interface.ts:93](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L93)

## Extends

- `Pick`\<`ModuleMetadata`, `"imports"`\>

## Properties

### imports?

> `optional` **imports?**: (`DynamicModule` \| `Type`\<`any`\> \| `Promise`\<`DynamicModule`\> \| `ForwardReference`\<`any`\>)[]

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/interfaces/modules/module-metadata.interface.d.ts:18

Optional list of imported modules that export the providers which are
required in this module.

#### Inherited from

`Pick.imports`

***

### inject?

> `optional` **inject?**: `any`[]

Defined in: [src/interfaces/i18n-options.interface.ts:104](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L104)

***

### ~~loader?~~

> `optional` **loader?**: `Type`\<[`I18nLoader`](../classes/I18nLoader.md)\>

Defined in: [src/interfaces/i18n-options.interface.ts:102](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L102)

#### Deprecated

Use `loaders` in the factory return value instead

***

### loaders?

> `optional` **loaders?**: [`I18nLoader`](../classes/I18nLoader.md)[]

Defined in: [src/interfaces/i18n-options.interface.ts:103](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L103)

***

### logging?

> `optional` **logging?**: `boolean`

Defined in: [src/interfaces/i18n-options.interface.ts:105](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L105)

***

### name?

> `optional` **name?**: `string`

Defined in: [src/interfaces/i18n-options.interface.ts:94](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L94)

***

### resolvers?

> `optional` **resolvers?**: [`I18nOptionResolver`](../type-aliases/I18nOptionResolver.md)[]

Defined in: [src/interfaces/i18n-options.interface.ts:100](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L100)

***

### useClass?

> `optional` **useClass?**: `Type`\<[`I18nOptionsFactory`](I18nOptionsFactory.md)\>

Defined in: [src/interfaces/i18n-options.interface.ts:96](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L96)

***

### useExisting?

> `optional` **useExisting?**: `Type`\<[`I18nOptionsFactory`](I18nOptionsFactory.md)\>

Defined in: [src/interfaces/i18n-options.interface.ts:95](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L95)

***

### useFactory?

> `optional` **useFactory?**: (...`args`) => [`I18nOptionsWithoutResolvers`](../type-aliases/I18nOptionsWithoutResolvers.md) \| `Promise`\<[`I18nOptionsWithoutResolvers`](../type-aliases/I18nOptionsWithoutResolvers.md)\>

Defined in: [src/interfaces/i18n-options.interface.ts:97](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-options.interface.ts#L97)

#### Parameters

##### args

...`any`[]

#### Returns

[`I18nOptionsWithoutResolvers`](../type-aliases/I18nOptionsWithoutResolvers.md) \| `Promise`\<[`I18nOptionsWithoutResolvers`](../type-aliases/I18nOptionsWithoutResolvers.md)\>
