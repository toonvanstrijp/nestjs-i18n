# Class: CookieResolver

Defined in: [src/resolvers/cookie.resolver.ts:11](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/resolvers/cookie.resolver.ts#L11)

Simple resolver to fetch language/locale from cookie

## Implements

- [`I18nResolver`](../interfaces/I18nResolver.md)

## Constructors

### Constructor

> **new CookieResolver**(`cookieNames?`): `CookieResolver`

Defined in: [src/resolvers/cookie.resolver.ts:12](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/resolvers/cookie.resolver.ts#L12)

#### Parameters

##### cookieNames?

`string`[] = `...`

#### Returns

`CookieResolver`

## Methods

### resolve()

> **resolve**(`context`): `string` \| `string`[]

Defined in: [src/resolvers/cookie.resolver.ts:17](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/resolvers/cookie.resolver.ts#L17)

#### Parameters

##### context

`ExecutionContext`

#### Returns

`string` \| `string`[]

#### Implementation of

[`I18nResolver`](../interfaces/I18nResolver.md).[`resolve`](../interfaces/I18nResolver.md#resolve)
