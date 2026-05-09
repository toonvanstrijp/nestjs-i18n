# Class: I18nYamlLoader

Defined in: [src/loaders/i18n.yaml.loader.ts:8](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.yaml.loader.ts#L8)

## Extends

- [`I18nAbstractLoader`](I18nAbstractLoader.md)

## Constructors

### Constructor

> **new I18nYamlLoader**(`options`): `I18nYamlLoader`

Defined in: [src/loaders/i18n.abstract.loader.ts:42](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L42)

#### Parameters

##### options

[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)

#### Returns

`I18nYamlLoader`

#### Inherited from

[`I18nAbstractLoader`](I18nAbstractLoader.md).[`constructor`](I18nAbstractLoader.md#constructor)

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

#### Inherited from

[`I18nAbstractLoader`](I18nAbstractLoader.md).[`assignPrefixedTranslation`](I18nAbstractLoader.md#assignprefixedtranslation)

***

### formatData()

> **formatData**(`data`): `unknown`

Defined in: [src/loaders/i18n.yaml.loader.ts:16](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.yaml.loader.ts#L16)

#### Parameters

##### data

`any`

#### Returns

`unknown`

#### Overrides

[`I18nAbstractLoader`](I18nAbstractLoader.md).[`formatData`](I18nAbstractLoader.md#formatdata)

***

### getDefaultOptions()

> **getDefaultOptions**(): `Partial`\<[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)\>

Defined in: [src/loaders/i18n.yaml.loader.ts:9](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.yaml.loader.ts#L9)

#### Returns

`Partial`\<[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)\>

#### Overrides

[`I18nAbstractLoader`](I18nAbstractLoader.md).[`getDefaultOptions`](I18nAbstractLoader.md#getdefaultoptions)

***

### languages()

> **languages**(): `Promise`\<`string`[] \| `Observable`\<`string`[]\>\>

Defined in: [src/loaders/i18n.abstract.loader.ts:67](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L67)

#### Returns

`Promise`\<`string`[] \| `Observable`\<`string`[]\>\>

#### Inherited from

[`I18nAbstractLoader`](I18nAbstractLoader.md).[`languages`](I18nAbstractLoader.md#languages)

***

### load()

> **load**(): `Promise`\<[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`\<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>\>

Defined in: [src/loaders/i18n.abstract.loader.ts:89](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L89)

#### Returns

`Promise`\<[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`\<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>\>

#### Inherited from

[`I18nAbstractLoader`](I18nAbstractLoader.md).[`load`](I18nAbstractLoader.md#load)

***

### onModuleDestroy()

> **onModuleDestroy**(): `Promise`\<`void`\>

Defined in: [src/loaders/i18n.abstract.loader.ts:61](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L61)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`I18nAbstractLoader`](I18nAbstractLoader.md).[`onModuleDestroy`](I18nAbstractLoader.md#onmoduledestroy)

***

### parseLanguages()

> `protected` **parseLanguages**(): `Promise`\<`string`[]\>

Defined in: [src/loaders/i18n.abstract.loader.ts:214](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L214)

#### Returns

`Promise`\<`string`[]\>

#### Inherited from

[`I18nAbstractLoader`](I18nAbstractLoader.md).[`parseLanguages`](I18nAbstractLoader.md#parselanguages)

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

#### Inherited from

[`I18nAbstractLoader`](I18nAbstractLoader.md).[`parseTranslations`](I18nAbstractLoader.md#parsetranslations)

***

### sanitizeOptions()

> `protected` **sanitizeOptions**(`options`): [`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)

Defined in: [src/loaders/i18n.abstract.loader.ts:230](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.abstract.loader.ts#L230)

#### Parameters

##### options

[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)

#### Returns

[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)

#### Inherited from

[`I18nAbstractLoader`](I18nAbstractLoader.md).[`sanitizeOptions`](I18nAbstractLoader.md#sanitizeoptions)
