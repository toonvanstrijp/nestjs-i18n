---
id: "I18nJsonLoader"
title: "Class: I18nJsonLoader"
sidebar_label: "I18nJsonLoader"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`I18nAbstractLoader`](I18nAbstractLoader.md)

  ↳ **`I18nJsonLoader`**

## Constructors

### constructor

• **new I18nJsonLoader**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md) |

#### Inherited from

[I18nAbstractLoader](I18nAbstractLoader.md).[constructor](I18nAbstractLoader.md#constructor)

#### Defined in

[src/loaders/i18n.abstract.loader.ts:38](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L38)

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

#### Inherited from

[I18nAbstractLoader](I18nAbstractLoader.md).[assignPrefixedTranslation](I18nAbstractLoader.md#assignprefixedtranslation)

#### Defined in

[src/loaders/i18n.abstract.loader.ts:149](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L149)

___

### formatData

▸ **formatData**(`data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`any`

#### Overrides

[I18nAbstractLoader](I18nAbstractLoader.md).[formatData](I18nAbstractLoader.md#formatdata)

#### Defined in

[src/loaders/i18n.json.loader.ts:14](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.json.loader.ts#L14)

___

### getDefaultOptions

▸ **getDefaultOptions**(): `Partial`<[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)\>

#### Returns

`Partial`<[`I18nAbstractLoaderOptions`](../interfaces/I18nAbstractLoaderOptions.md)\>

#### Overrides

[I18nAbstractLoader](I18nAbstractLoader.md).[getDefaultOptions](I18nAbstractLoader.md#getdefaultoptions)

#### Defined in

[src/loaders/i18n.json.loader.ts:8](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.json.loader.ts#L8)

___

### languages

▸ **languages**(): `Promise`<`string`[] \| `Observable`<`string`[]\>\>

#### Returns

`Promise`<`string`[] \| `Observable`<`string`[]\>\>

#### Inherited from

[I18nAbstractLoader](I18nAbstractLoader.md).[languages](I18nAbstractLoader.md#languages)

#### Defined in

[src/loaders/i18n.abstract.loader.ts:60](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L60)

___

### load

▸ **load**(): `Promise`<[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>\>

#### Returns

`Promise`<[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>\>

#### Inherited from

[I18nAbstractLoader](I18nAbstractLoader.md).[load](I18nAbstractLoader.md#load)

#### Defined in

[src/loaders/i18n.abstract.loader.ts:70](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L70)

___

### onModuleDestroy

▸ **onModuleDestroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[I18nAbstractLoader](I18nAbstractLoader.md).[onModuleDestroy](I18nAbstractLoader.md#onmoduledestroy)

#### Defined in

[src/loaders/i18n.abstract.loader.ts:54](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L54)

___

### parseLanguages

▸ `Protected` **parseLanguages**(): `Promise`<`string`[]\>

#### Returns

`Promise`<`string`[]\>

#### Inherited from

[I18nAbstractLoader](I18nAbstractLoader.md).[parseLanguages](I18nAbstractLoader.md#parselanguages)

#### Defined in

[src/loaders/i18n.abstract.loader.ts:170](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L170)

___

### parseTranslations

▸ `Protected` **parseTranslations**(): `Promise`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>

#### Returns

`Promise`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>

#### Inherited from

[I18nAbstractLoader](I18nAbstractLoader.md).[parseTranslations](I18nAbstractLoader.md#parsetranslations)

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

#### Inherited from

[I18nAbstractLoader](I18nAbstractLoader.md).[sanitizeOptions](I18nAbstractLoader.md#sanitizeoptions)

#### Defined in

[src/loaders/i18n.abstract.loader.ts:177](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.abstract.loader.ts#L177)
