---
id: "I18nMiddleware"
title: "Class: I18nMiddleware"
sidebar_label: "I18nMiddleware"
sidebar_position: 0
custom_edit_url: null
---

## Implements

- `NestMiddleware`

## Constructors

### constructor

• **new I18nMiddleware**(`i18nOptions`, `i18nResolvers`, `i18nService`, `moduleRef`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `i18nOptions` | [`I18nOptions`](../interfaces/I18nOptions.md) |
| `i18nResolvers` | [`I18nOptionResolver`](../modules.md#i18noptionresolver)[] |
| `i18nService` | [`I18nService`](I18nService.md)<`Record`<`string`, `unknown`\>\> |
| `moduleRef` | `ModuleRef` |

#### Defined in

[src/middlewares/i18n.middleware.ts:29](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/middlewares/i18n.middleware.ts#L29)

## Properties

### i18nOptions

• `Private` `Readonly` **i18nOptions**: [`I18nOptions`](../interfaces/I18nOptions.md)

#### Defined in

[src/middlewares/i18n.middleware.ts:31](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/middlewares/i18n.middleware.ts#L31)

___

### i18nResolvers

• `Private` `Readonly` **i18nResolvers**: [`I18nOptionResolver`](../modules.md#i18noptionresolver)[]

#### Defined in

[src/middlewares/i18n.middleware.ts:33](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/middlewares/i18n.middleware.ts#L33)

___

### i18nService

• `Private` `Readonly` **i18nService**: [`I18nService`](I18nService.md)<`Record`<`string`, `unknown`\>\>

#### Defined in

[src/middlewares/i18n.middleware.ts:34](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/middlewares/i18n.middleware.ts#L34)

___

### moduleRef

• `Private` `Readonly` **moduleRef**: `ModuleRef`

#### Defined in

[src/middlewares/i18n.middleware.ts:35](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/middlewares/i18n.middleware.ts#L35)

## Methods

### getResolver

▸ `Private` **getResolver**(`r`): `Promise`<[`I18nResolver`](../interfaces/I18nResolver.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | [`I18nOptionResolver`](../modules.md#i18noptionresolver) |

#### Returns

`Promise`<[`I18nResolver`](../interfaces/I18nResolver.md)\>

#### Defined in

[src/middlewares/i18n.middleware.ts:78](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/middlewares/i18n.middleware.ts#L78)

___

### use

▸ **use**(`req`, `res`, `next`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |
| `next` | `any` |

#### Returns

`Promise`<`any`\>

#### Implementation of

NestMiddleware.use

#### Defined in

[src/middlewares/i18n.middleware.ts:38](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/middlewares/i18n.middleware.ts#L38)
