# Abstract Class: I18nAbstractLoader

Defined in: [src/loaders/i18n.abstract.loader.ts:30](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L30)

## Extends

- [`I18nLoader`](I18nLoader.md)

## Extended by

- [`I18nJsonLoader`](I18nJsonLoader.md)
- [`I18nYamlLoader`](I18nYamlLoader.md)

## Implements

- `OnModuleDestroy`

## Constructors

### Constructor

> **new I18nAbstractLoader**(`options`): `I18nAbstractLoader`

Defined in: [src/loaders/i18n.abstract.loader.ts:42](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L42)

#### Parameters

##### options

[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)

#### Returns

`I18nAbstractLoader`

#### Overrides

[`I18nLoader`](I18nLoader.md).[`constructor`](I18nLoader.md#constructor)

## Methods

### assignPrefixedTranslation()

> `protected` **assignPrefixedTranslation**(`translations`, `prefix`, `property`, `value`): `void`

Defined in: [src/loaders/i18n.abstract.loader.ts:189](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L189)

#### Parameters

##### translations

[`I18nTranslation`](../interfaces/I18nTranslation.md)

##### prefix

`string`[]

##### property

`string`

##### value

`any`

#### Returns

`void`

***

### formatData()

> `abstract` **formatData**(`data`): `any`

Defined in: [src/loaders/i18n.abstract.loader.ts:278](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L278)

#### Parameters

##### data

`any`

#### Returns

`any`

***

### getDefaultOptions()

> `abstract` **getDefaultOptions**(): `Partial`\<[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)\>

Defined in: [src/loaders/i18n.abstract.loader.ts:279](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L279)

#### Returns

`Partial`\<[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)\>

***

### languages()

> **languages**(): `Promise`\<`string`[] \| `Observable`\<`string`[]\>\>

Defined in: [src/loaders/i18n.abstract.loader.ts:67](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L67)

#### Returns

`Promise`\<`string`[] \| `Observable`\<`string`[]\>\>

#### Overrides

[`I18nLoader`](I18nLoader.md).[`languages`](I18nLoader.md#languages)

***

### load()

> **load**(): `Promise`\<[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`\<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>\>

Defined in: [src/loaders/i18n.abstract.loader.ts:89](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L89)

#### Returns

`Promise`\<[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`\<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>\>

#### Overrides

[`I18nLoader`](I18nLoader.md).[`load`](I18nLoader.md#load)

***

### onModuleDestroy()

> **onModuleDestroy**(): `Promise`\<`void`\>

Defined in: [src/loaders/i18n.abstract.loader.ts:61](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L61)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

***

### parseLanguages()

> `protected` **parseLanguages**(): `Promise`\<`string`[]\>

Defined in: [src/loaders/i18n.abstract.loader.ts:214](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L214)

#### Returns

`Promise`\<`string`[]\>

***

### parseTranslations()

> `protected` **parseTranslations**(`eventInfo?`): `Promise`\<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>

Defined in: [src/loaders/i18n.abstract.loader.ts:111](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L111)

#### Parameters

##### eventInfo?

###### event

`string`

###### filePath

`string`

#### Returns

`Promise`\<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>

***

### sanitizeOptions()

> `protected` **sanitizeOptions**(`options`): [`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)

Defined in: [src/loaders/i18n.abstract.loader.ts:230](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L230)

#### Parameters

##### options

[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)

#### Returns

[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)
