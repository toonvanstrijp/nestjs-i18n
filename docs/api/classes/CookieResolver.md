---
id: "CookieResolver"
title: "Class: CookieResolver"
sidebar_label: "CookieResolver"
sidebar_position: 0
custom_edit_url: null
---

Simple resolver to fetch language/locale from cookie

## Implements

- [`I18nResolver`](../interfaces/I18nResolver.md)

## Constructors

### constructor

• **new CookieResolver**(`cookieNames?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cookieNames` | `string`[] |

#### Defined in

[src/resolvers/cookie.resolver.ts:11](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/cookie.resolver.ts#L11)

## Properties

### cookieNames

• `Private` `Readonly` **cookieNames**: `string`[]

#### Defined in

[src/resolvers/cookie.resolver.ts:13](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/cookie.resolver.ts#L13)

## Methods

### resolve

▸ **resolve**(`context`): `string` \| `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `ExecutionContext` |

#### Returns

`string` \| `string`[]

#### Implementation of

[I18nResolver](../interfaces/I18nResolver.md).[resolve](../interfaces/I18nResolver.md#resolve)

#### Defined in

[src/resolvers/cookie.resolver.ts:16](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/cookie.resolver.ts#L16)
