---
id: "I18nResolver"
title: "Interface: I18nResolver"
sidebar_label: "I18nResolver"
sidebar_position: 0
custom_edit_url: null
---

## Implemented by

- [`AcceptLanguageResolver`](../classes/AcceptLanguageResolver.md)
- [`CookieResolver`](../classes/CookieResolver.md)
- [`GraphQLWebsocketResolver`](../classes/GraphQLWebsocketResolver.md)
- [`GrpcMetadataResolver`](../classes/GrpcMetadataResolver.md)
- [`HeaderResolver`](../classes/HeaderResolver.md)
- [`QueryResolver`](../classes/QueryResolver.md)

## Methods

### resolve

▸ **resolve**(`context`): `string` \| `string`[] \| `Promise`<`string` \| `string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `ExecutionContext` |

#### Returns

`string` \| `string`[] \| `Promise`<`string` \| `string`[]\>

#### Defined in

[src/interfaces/i18n-language-resolver.interface.ts:4](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-language-resolver.interface.ts#L4)
