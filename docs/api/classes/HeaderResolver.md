# Class: HeaderResolver

Defined in: [src/resolvers/header.resolver.ts:7](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/resolvers/header.resolver.ts#L7)

## Implements

- [`I18nResolver`](../interfaces/I18nResolver.md)

## Constructors

### Constructor

> **new HeaderResolver**(`keys?`): `HeaderResolver`

Defined in: [src/resolvers/header.resolver.ts:9](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/resolvers/header.resolver.ts#L9)

#### Parameters

##### keys?

`string`[] = `[]`

#### Returns

`HeaderResolver`

## Methods

### resolve()

> **resolve**(`context`): `Promise`\<`string` \| `string`[]\>

Defined in: [src/resolvers/header.resolver.ts:14](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/resolvers/header.resolver.ts#L14)

#### Parameters

##### context

`ExecutionContext`

#### Returns

`Promise`\<`string` \| `string`[]\>

#### Implementation of

[`I18nResolver`](../interfaces/I18nResolver.md).[`resolve`](../interfaces/I18nResolver.md#resolve)
