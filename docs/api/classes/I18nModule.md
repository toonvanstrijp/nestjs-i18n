# Class: I18nModule

Defined in: [src/i18n.module.ts:62](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.module.ts#L62)

## Implements

- `OnModuleInit`
- `OnModuleDestroy`
- `NestModule`

## Constructors

### Constructor

> **new I18nModule**(`i18n`, `translations`, `i18nOptions`, `adapter`, `middleware`): `I18nModule`

Defined in: [src/i18n.module.ts:65](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.module.ts#L65)

#### Parameters

##### i18n

[`I18nService`](I18nService.md)

##### translations

`Observable`\<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>

##### i18nOptions

[`I18nOptions`](../interfaces/I18nOptions.md)

##### adapter

`HttpAdapterHost`

##### middleware

[`I18nMiddleware`](I18nMiddleware.md)

#### Returns

`I18nModule`

## Methods

### configure()

> **configure**(`consumer`): `void`

Defined in: [src/i18n.module.ts:172](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.module.ts#L172)

#### Parameters

##### consumer

`NestMiddlewareConsumer`

#### Returns

`void`

#### Implementation of

`NestModule.configure`

***

### onModuleDestroy()

> **onModuleDestroy**(): `void`

Defined in: [src/i18n.module.ts:167](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.module.ts#L167)

#### Returns

`void`

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

***

### onModuleInit()

> **onModuleInit**(): `Promise`\<`void`\>

Defined in: [src/i18n.module.ts:74](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.module.ts#L74)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleInit.onModuleInit`

***

### forRoot()

> `static` **forRoot**(`options`): `DynamicModule`

Defined in: [src/i18n.module.ts:212](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.module.ts#L212)

#### Parameters

##### options

[`I18nOptions`](../interfaces/I18nOptions.md)

#### Returns

`DynamicModule`

***

### forRootAsync()

> `static` **forRootAsync**(`options`): `DynamicModule`

Defined in: [src/i18n.module.ts:307](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.module.ts#L307)

#### Parameters

##### options

[`I18nAsyncOptions`](../interfaces/I18nAsyncOptions.md)

#### Returns

`DynamicModule`
