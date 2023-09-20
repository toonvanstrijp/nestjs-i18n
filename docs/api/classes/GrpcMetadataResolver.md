---
id: "GrpcMetadataResolver"
title: "Class: GrpcMetadataResolver"
sidebar_label: "GrpcMetadataResolver"
sidebar_position: 0
custom_edit_url: null
---

## Implements

- [`I18nResolver`](../interfaces/I18nResolver.md)

## Constructors

### constructor

• **new GrpcMetadataResolver**(`keys?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `string`[] |

#### Defined in

[src/resolvers/grpc-metadata.resolver.ts:7](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/grpc-metadata.resolver.ts#L7)

## Properties

### keys

• `Private` **keys**: `string`[]

#### Defined in

[src/resolvers/grpc-metadata.resolver.ts:9](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/grpc-metadata.resolver.ts#L9)

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

[src/resolvers/grpc-metadata.resolver.ts:12](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/resolvers/grpc-metadata.resolver.ts#L12)
