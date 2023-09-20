---
id: "HeaderResolver"
title: "Class: HeaderResolver"
sidebar_label: "HeaderResolver"
sidebar_position: 0
custom_edit_url: null
---

## Implements

- [`I18nResolver`](../interfaces/I18nResolver.md)

## Constructors

### constructor

• **new HeaderResolver**(`keys?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keys` | `string`[] | `[]` |

#### Defined in

[src/resolvers/header.resolver.ts:8](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/header.resolver.ts#L8)

## Properties

### keys

• `Private` **keys**: `string`[] = `[]`

#### Defined in

[src/resolvers/header.resolver.ts:10](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/header.resolver.ts#L10)

___

### logger

• `Private` **logger**: `Logger`

#### Defined in

[src/resolvers/header.resolver.ts:7](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/header.resolver.ts#L7)

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

[src/resolvers/header.resolver.ts:13](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/header.resolver.ts#L13)
