# Class: GrpcMetadataResolver

Defined in: [src/resolvers/grpc-metadata.resolver.ts:7](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/resolvers/grpc-metadata.resolver.ts#L7)

## Implements

- [`I18nResolver`](../interfaces/I18nResolver.md)

## Constructors

### Constructor

> **new GrpcMetadataResolver**(`keys?`): `GrpcMetadataResolver`

Defined in: [src/resolvers/grpc-metadata.resolver.ts:8](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/resolvers/grpc-metadata.resolver.ts#L8)

#### Parameters

##### keys?

`string`[] = `...`

#### Returns

`GrpcMetadataResolver`

## Methods

### resolve()

> **resolve**(`context`): `Promise`\<`string` \| `string`[]\>

Defined in: [src/resolvers/grpc-metadata.resolver.ts:13](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/resolvers/grpc-metadata.resolver.ts#L13)

#### Parameters

##### context

`ExecutionContext`

#### Returns

`Promise`\<`string` \| `string`[]\>

#### Implementation of

[`I18nResolver`](../interfaces/I18nResolver.md).[`resolve`](../interfaces/I18nResolver.md#resolve)
