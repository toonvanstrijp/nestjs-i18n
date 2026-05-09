# Class: I18nLanguageInterceptor

Defined in: [src/interceptors/i18n-language.interceptor.ts:22](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interceptors/i18n-language.interceptor.ts#L22)

## Implements

- `NestInterceptor`

## Constructors

### Constructor

> **new I18nLanguageInterceptor**(`i18nOptions`, `i18nResolvers`, `i18nService`, `messageFormat`, `moduleRef`): `I18nLanguageInterceptor`

Defined in: [src/interceptors/i18n-language.interceptor.ts:23](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interceptors/i18n-language.interceptor.ts#L23)

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

`I18nLanguageInterceptor`

## Methods

### intercept()

> **intercept**(`context`, `next`): `Promise`\<`Observable`\<`any`\>\>

Defined in: [src/interceptors/i18n-language.interceptor.ts:33](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interceptors/i18n-language.interceptor.ts#L33)

Method to implement a custom interceptor.

#### Parameters

##### context

`ExecutionContext`

an `ExecutionContext` object providing methods to access the
route handler and class about to be invoked.

##### next

`CallHandler`\<`any`\>

a reference to the `CallHandler`, which provides access to an
`Observable` representing the response stream from the route handler.

#### Returns

`Promise`\<`Observable`\<`any`\>\>

#### Implementation of

`NestInterceptor.intercept`
