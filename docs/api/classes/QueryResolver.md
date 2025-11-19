---
id: "QueryResolver"
title: "Class: QueryResolver"
sidebar_label: "QueryResolver"
sidebar_position: 0
custom_edit_url: null
---

## Implements

- [`I18nResolver`](../interfaces/I18nResolver.md)

## Constructors

### constructor

• **new QueryResolver**(`keys?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keys` | `string`[] | `[]` |

#### Defined in

[src/resolvers/query.resolver.ts:7](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/query.resolver.ts#L7)

## Properties

### keys

• `Private` **keys**: `string`[] = `[]`

#### Defined in

[src/resolvers/query.resolver.ts:7](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/query.resolver.ts#L7)

## Methods

### resolve

▸ **resolve**(`context`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `ExecutionContext` |

#### Returns

`string`

#### Implementation of

[I18nResolver](../interfaces/I18nResolver.md).[resolve](../interfaces/I18nResolver.md#resolve)

#### Defined in

[src/resolvers/query.resolver.ts:9](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/query.resolver.ts#L9)
