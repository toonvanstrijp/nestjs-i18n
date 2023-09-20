---
id: "I18nLanguageInterceptor"
title: "Class: I18nLanguageInterceptor"
sidebar_label: "I18nLanguageInterceptor"
sidebar_position: 0
custom_edit_url: null
---

## Implements

- `NestInterceptor`

## Constructors

### constructor

• **new I18nLanguageInterceptor**(`i18nOptions`, `i18nResolvers`, `i18nService`, `moduleRef`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `i18nOptions` | [`I18nOptions`](../interfaces/I18nOptions.md) |
| `i18nResolvers` | [`I18nOptionResolver`](../modules.md#i18noptionresolver)[] |
| `i18nService` | [`I18nService`](I18nService.md)<`Record`<`string`, `unknown`\>\> |
| `moduleRef` | `ModuleRef` |

#### Defined in

[src/interceptors/i18n-language.interceptor.ts:24](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interceptors/i18n-language.interceptor.ts#L24)

## Properties

### i18nOptions

• `Private` `Readonly` **i18nOptions**: [`I18nOptions`](../interfaces/I18nOptions.md)

#### Defined in

[src/interceptors/i18n-language.interceptor.ts:26](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interceptors/i18n-language.interceptor.ts#L26)

___

### i18nResolvers

• `Private` `Readonly` **i18nResolvers**: [`I18nOptionResolver`](../modules.md#i18noptionresolver)[]

#### Defined in

[src/interceptors/i18n-language.interceptor.ts:28](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interceptors/i18n-language.interceptor.ts#L28)

___

### i18nService

• `Private` `Readonly` **i18nService**: [`I18nService`](I18nService.md)<`Record`<`string`, `unknown`\>\>

#### Defined in

[src/interceptors/i18n-language.interceptor.ts:29](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interceptors/i18n-language.interceptor.ts#L29)

___

### moduleRef

• `Private` `Readonly` **moduleRef**: `ModuleRef`

#### Defined in

[src/interceptors/i18n-language.interceptor.ts:30](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interceptors/i18n-language.interceptor.ts#L30)

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

[src/interceptors/i18n-language.interceptor.ts:86](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interceptors/i18n-language.interceptor.ts#L86)

___

### intercept

▸ **intercept**(`context`, `next`): `Promise`<`Observable`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `ExecutionContext` |
| `next` | `CallHandler`<`any`\> |

#### Returns

`Promise`<`Observable`<`any`\>\>

#### Implementation of

NestInterceptor.intercept

#### Defined in

[src/interceptors/i18n-language.interceptor.ts:33](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interceptors/i18n-language.interceptor.ts#L33)
