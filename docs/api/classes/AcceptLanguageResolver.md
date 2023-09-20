---
id: "AcceptLanguageResolver"
title: "Class: AcceptLanguageResolver"
sidebar_label: "AcceptLanguageResolver"
sidebar_position: 0
custom_edit_url: null
---

## Implements

- [`I18nResolver`](../interfaces/I18nResolver.md)

## Constructors

### constructor

• **new AcceptLanguageResolver**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `AcceptLanguageResolverOptions` |

#### Defined in

[src/resolvers/accept-language.resolver.ts:12](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/accept-language.resolver.ts#L12)

## Properties

### options

• `Private` **options**: `AcceptLanguageResolverOptions`

#### Defined in

[src/resolvers/accept-language.resolver.ts:14](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/accept-language.resolver.ts#L14)

## Methods

### resolve

▸ **resolve**(`context`): `Promise`<`string` \| `string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `ExecutionContext` |

#### Returns

`Promise`<`string` \| `string`[]\>

#### Implementation of

[I18nResolver](../interfaces/I18nResolver.md).[resolve](../interfaces/I18nResolver.md#resolve)

#### Defined in

[src/resolvers/accept-language.resolver.ts:19](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/accept-language.resolver.ts#L19)
