# Class: I18nMiddleware

Defined in: [src/middlewares/i18n.middleware.ts:24](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/middlewares/i18n.middleware.ts#L24)

## Implements

- `NestMiddleware`

## Constructors

### Constructor

> **new I18nMiddleware**(`i18nOptions`, `i18nResolvers`, `i18nService`, `messageFormat`, `moduleRef`): `I18nMiddleware`

Defined in: [src/middlewares/i18n.middleware.ts:25](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/middlewares/i18n.middleware.ts#L25)

#### Parameters

##### i18nOptions

[`I18nOptions`](../interfaces/I18nOptions.md)

##### i18nResolvers

[`I18nOptionResolver`](../type-aliases/I18nOptionResolver.md)[]

##### i18nService

[`I18nService`](I18nService.md)

##### messageFormat

`I18nMessageFormat`

##### moduleRef

`ModuleRef`

#### Returns

`I18nMiddleware`

## Methods

### use()

> **use**(`req`, `res`, `next`): `Promise`\<`any`\>

Defined in: [src/middlewares/i18n.middleware.ts:35](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/middlewares/i18n.middleware.ts#L35)

#### Parameters

##### req

`any`

##### res

`any`

##### next

`any`

#### Returns

`Promise`\<`any`\>

#### Implementation of

`NestMiddleware.use`
