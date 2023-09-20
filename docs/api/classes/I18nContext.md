---
id: "I18nContext"
title: "Class: I18nContext<K>"
sidebar_label: "I18nContext"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | `Record`<`string`, `unknown`\> |

## Implements

- [`I18nTranslator`](../interfaces/I18nTranslator.md)<`K`\>

## Constructors

### constructor

• **new I18nContext**<`K`\>(`lang`, `service`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | `Record`<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `lang` | `string` |
| `service` | [`I18nService`](I18nService.md)<`K`\> |

#### Defined in

[src/i18n.context.ts:19](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L19)

## Properties

### id

• `Readonly` **id**: `number`

#### Defined in

[src/i18n.context.ts:13](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L13)

___

### lang

• `Readonly` **lang**: `string`

#### Defined in

[src/i18n.context.ts:20](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L20)

___

### service

• `Readonly` **service**: [`I18nService`](I18nService.md)<`K`\>

#### Defined in

[src/i18n.context.ts:21](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L21)

___

### counter

▪ `Static` `Private` **counter**: `number` = `1`

#### Defined in

[src/i18n.context.ts:12](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L12)

___

### storage

▪ `Static` `Private` **storage**: `AsyncLocalStorage`<[`I18nContext`](I18nContext.md)<`Record`<`string`, `unknown`\>\>\>

#### Defined in

[src/i18n.context.ts:11](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L11)

## Accessors

### i18n

• `get` **i18n**(): [`I18nContext`](I18nContext.md)<`K`\>

#### Returns

[`I18nContext`](I18nContext.md)<`K`\>

#### Defined in

[src/i18n.context.ts:15](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L15)

## Methods

### t

▸ **t**<`P`, `R`\>(`key`, `options?`): `IfAnyOrNever`<`R`, `string`, `R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `string` = `any` |
| `R` | [`PathValue`](../modules.md#pathvalue)<`K`, `P`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `P` |
| `options?` | [`TranslateOptions`](../modules.md#translateoptions) |

#### Returns

`IfAnyOrNever`<`R`, `string`, `R`\>

#### Implementation of

[I18nTranslator](../interfaces/I18nTranslator.md).[t](../interfaces/I18nTranslator.md#t)

#### Defined in

[src/i18n.context.ts:35](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L35)

___

### translate

▸ **translate**<`P`, `R`\>(`key`, `options?`): `IfAnyOrNever`<`R`, `string`, `R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `string` = `any` |
| `R` | [`PathValue`](../modules.md#pathvalue)<`K`, `P`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `P` |
| `options?` | [`TranslateOptions`](../modules.md#translateoptions) |

#### Returns

`IfAnyOrNever`<`R`, `string`, `R`\>

#### Implementation of

[I18nTranslator](../interfaces/I18nTranslator.md).[translate](../interfaces/I18nTranslator.md#translate)

#### Defined in

[src/i18n.context.ts:24](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L24)

___

### validate

▸ **validate**(`value`, `options?`): `Promise`<`ValidationError`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `options?` | [`TranslateOptions`](../modules.md#translateoptions) |

#### Returns

`Promise`<`ValidationError`[]\>

#### Implementation of

[I18nTranslator](../interfaces/I18nTranslator.md).[validate](../interfaces/I18nTranslator.md#validate)

#### Defined in

[src/i18n.context.ts:42](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L42)

___

### create

▸ `Static` **create**(`ctx`, `next`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`I18nContext`](I18nContext.md)<`Record`<`string`, `unknown`\>\> |
| `next` | (...`args`: `any`[]) => `void` |

#### Returns

`void`

#### Defined in

[src/i18n.context.ts:53](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L53)

___

### createAsync

▸ `Static` **createAsync**<`T`\>(`ctx`, `next`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`I18nContext`](I18nContext.md)<`Record`<`string`, `unknown`\>\> |
| `next` | (...`args`: `any`[]) => `Promise`<`T`\> |

#### Returns

`Promise`<`T`\>

#### Defined in

[src/i18n.context.ts:57](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L57)

___

### current

▸ `Static` **current**<`K`\>(`context?`): [`I18nContext`](I18nContext.md)<`K`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | `Record`<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `context?` | `ArgumentsHost` |

#### Returns

[`I18nContext`](I18nContext.md)<`K`\>

#### Defined in

[src/i18n.context.ts:64](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.context.ts#L64)
