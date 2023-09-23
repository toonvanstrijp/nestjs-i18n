---
id: "I18nAbstractLoader"
title: "Class: I18nAbstractLoader"
sidebar_label: "I18nAbstractLoader"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`I18nLoader`](I18nLoader.md)

  ↳ **`I18nAbstractLoader`**

  ↳↳ [`I18nJsonLoader`](I18nJsonLoader.md)

  ↳↳ [`I18nYamlLoader`](I18nYamlLoader.md)

## Implements

- `OnModuleDestroy`

## Constructors

### constructor

• **new I18nAbstractLoader**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md) |

#### Overrides

[I18nLoader](I18nLoader.md).[constructor](I18nLoader.md#constructor)

#### Defined in

[src/loaders/i18n.abstract.loader.ts:38](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L38)

## Properties

### events

• `Private` **events**: `Subject`<`string`\>

#### Defined in

[src/loaders/i18n.abstract.loader.ts:36](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L36)

___

### options

• `Private` **options**: [`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)

#### Defined in

[src/loaders/i18n.abstract.loader.ts:40](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L40)

___

### watcher

• `Private` `Optional` **watcher**: `FSWatcher`

#### Defined in

[src/loaders/i18n.abstract.loader.ts:34](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L34)

## Methods

### assignPrefixedTranslation

▸ `Protected` **assignPrefixedTranslation**(`translations`, `prefix`, `property`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `translations` | `string` \| [`I18nTranslation`](../interfaces/I18nTranslation.md) |
| `prefix` | `string`[] |
| `property` | `string` |
| `value` | `string` |

#### Returns

`void`

#### Defined in

[src/loaders/i18n.abstract.loader.ts:149](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L149)

___

### formatData

▸ `Abstract` **formatData**(`data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[src/loaders/i18n.abstract.loader.ts:188](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L188)

___

### getDefaultOptions

▸ `Abstract` **getDefaultOptions**(): `Partial`<[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)\>

#### Returns

`Partial`<[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)\>

#### Defined in

[src/loaders/i18n.abstract.loader.ts:189](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L189)

___

### languages

▸ **languages**(): `Promise`<`string`[] \| `Observable`<`string`[]\>\>

#### Returns

`Promise`<`string`[] \| `Observable`<`string`[]\>\>

#### Overrides

[I18nLoader](I18nLoader.md).[languages](I18nLoader.md#languages)

#### Defined in

[src/loaders/i18n.abstract.loader.ts:60](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L60)

___

### load

▸ **load**(): `Promise`<[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>\>

#### Returns

`Promise`<[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>\>

#### Overrides

[I18nLoader](I18nLoader.md).[load](I18nLoader.md#load)

#### Defined in

[src/loaders/i18n.abstract.loader.ts:70](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L70)

___

### onModuleDestroy

▸ **onModuleDestroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

OnModuleDestroy.onModuleDestroy

#### Defined in

[src/loaders/i18n.abstract.loader.ts:54](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L54)

___

### parseLanguages

▸ `Protected` **parseLanguages**(): `Promise`<`string`[]\>

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/loaders/i18n.abstract.loader.ts:170](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L170)

___

### parseTranslations

▸ `Protected` **parseTranslations**(): `Promise`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>

#### Returns

`Promise`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>

#### Defined in

[src/loaders/i18n.abstract.loader.ts:80](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L80)

___

### sanitizeOptions

▸ `Protected` **sanitizeOptions**(`options`): [`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md) |

#### Returns

[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)

#### Defined in

[src/loaders/i18n.abstract.loader.ts:177](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L177)
