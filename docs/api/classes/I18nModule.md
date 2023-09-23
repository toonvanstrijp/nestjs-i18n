---
id: "I18nModule"
title: "Class: I18nModule"
sidebar_label: "I18nModule"
sidebar_position: 0
custom_edit_url: null
---

## Implements

- `OnModuleInit`
- `OnModuleDestroy`
- `NestModule`

## Constructors

### constructor

• **new I18nModule**(`i18n`, `translations`, `i18nOptions`, `adapter`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `i18n` | [`I18nService`](I18nService.md)<`Record`<`string`, `unknown`\>\> |
| `translations` | `Observable`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\> |
| `i18nOptions` | [`I18nOptions`](../interfaces/I18nOptions.md) |
| `adapter` | `HttpAdapterHost`<`AbstractHttpAdapter`<`any`, `any`, `any`\>\> |

#### Defined in

[src/i18n.module.ts:67](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L67)

## Properties

### adapter

• `Private` **adapter**: `HttpAdapterHost`<`AbstractHttpAdapter`<`any`, `any`, `any`\>\>

#### Defined in

[src/i18n.module.ts:72](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L72)

___

### i18n

• `Private` `Readonly` **i18n**: [`I18nService`](I18nService.md)<`Record`<`string`, `unknown`\>\>

#### Defined in

[src/i18n.module.ts:68](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L68)

___

### i18nOptions

• `Private` `Readonly` **i18nOptions**: [`I18nOptions`](../interfaces/I18nOptions.md)

#### Defined in

[src/i18n.module.ts:71](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L71)

___

### translations

• `Private` **translations**: `Observable`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>

#### Defined in

[src/i18n.module.ts:70](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L70)

___

### unsubscribe

• `Private` **unsubscribe**: `Subject`<`void`\>

#### Defined in

[src/i18n.module.ts:65](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L65)

## Methods

### configure

▸ **configure**(`consumer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `consumer` | `MiddlewareConsumer` |

#### Returns

`void`

#### Implementation of

NestModule.configure

#### Defined in

[src/i18n.module.ts:152](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L152)

___

### onModuleDestroy

▸ **onModuleDestroy**(): `void`

#### Returns

`void`

#### Implementation of

OnModuleDestroy.onModuleDestroy

#### Defined in

[src/i18n.module.ts:148](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L148)

___

### onModuleInit

▸ **onModuleInit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

OnModuleInit.onModuleInit

#### Defined in

[src/i18n.module.ts:75](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L75)

___

### createAsyncLanguagesProvider

▸ `Static` `Private` **createAsyncLanguagesProvider**(): `Provider`<`any`\>

#### Returns

`Provider`<`any`\>

#### Defined in

[src/i18n.module.ts:376](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L376)

___

### createAsyncLoaderOptionsProvider

▸ `Static` `Private` **createAsyncLoaderOptionsProvider**(): `Provider`<`any`\>

#### Returns

`Provider`<`any`\>

#### Defined in

[src/i18n.module.ts:343](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L343)

___

### createAsyncOptionsProvider

▸ `Static` `Private` **createAsyncOptionsProvider**(`options`): `Provider`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`I18nAsyncOptions`](../interfaces/I18nAsyncOptions.md) |

#### Returns

`Provider`<`any`\>

#### Defined in

[src/i18n.module.ts:319](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L319)

___

### createAsyncTranslationProvider

▸ `Static` `Private` **createAsyncTranslationProvider**(): `Provider`<`any`\>

#### Returns

`Provider`<`any`\>

#### Defined in

[src/i18n.module.ts:353](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L353)

___

### createResolverProviders

▸ `Static` `Private` **createResolverProviders**(`resolvers?`): `Provider`<`any`\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `resolvers?` | [`I18nOptionResolver`](../modules.md#i18noptionresolver)[] |

#### Returns

`Provider`<`any`\>[]

#### Defined in

[src/i18n.module.ts:406](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L406)

___

### forRoot

▸ `Static` **forRoot**(`options`): `DynamicModule`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`I18nOptions`](../interfaces/I18nOptions.md) |

#### Returns

`DynamicModule`

#### Defined in

[src/i18n.module.ts:162](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L162)

___

### forRootAsync

▸ `Static` **forRootAsync**(`options`): `DynamicModule`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`I18nAsyncOptions`](../interfaces/I18nAsyncOptions.md) |

#### Returns

`DynamicModule`

#### Defined in

[src/i18n.module.ts:259](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L259)

___

### sanitizeI18nOptions

▸ `Static` `Private` **sanitizeI18nOptions**<`T`\>(`options`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`I18nOptions`](../interfaces/I18nOptions.md) \| [`I18nAsyncOptions`](../interfaces/I18nAsyncOptions.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `T` |

#### Returns

`T`

#### Defined in

[src/i18n.module.ts:399](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L399)
