# Class: I18nContext\<K\>

Defined in: [src/i18n.context.ts:9](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L9)

## Type Parameters

### K

`K` = `Record`\<`string`, `unknown`\>

## Implements

- [`I18nTranslator`](../interfaces/I18nTranslator.md)\<`K`\>

## Constructors

### Constructor

> **new I18nContext**\<`K`\>(`lang`, `service`, `messageFormat`): `I18nContext`\<`K`\>

Defined in: [src/i18n.context.ts:18](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L18)

#### Parameters

##### lang

`string`

##### service

[`I18nService`](I18nService.md)\<`K`\>

##### messageFormat

`I18nMessageFormat`

#### Returns

`I18nContext`\<`K`\>

## Properties

### id

> `readonly` **id**: `number`

Defined in: [src/i18n.context.ts:12](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L12)

***

### lang

> `readonly` **lang**: `string`

Defined in: [src/i18n.context.ts:19](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L19)

***

### messageFormat

> `readonly` **messageFormat**: `I18nMessageFormat`

Defined in: [src/i18n.context.ts:21](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L21)

***

### service

> `readonly` **service**: [`I18nService`](I18nService.md)\<`K`\>

Defined in: [src/i18n.context.ts:20](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L20)

## Accessors

### i18n

#### Get Signature

> **get** **i18n**(): `I18nContext`\<`K`\>

Defined in: [src/i18n.context.ts:14](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L14)

##### Returns

`I18nContext`\<`K`\>

## Methods

### t()

> **t**\<`P`, `R`\>(`key`, `options?`): `IfAnyOrNever`\<`R`, `string`, `R`\>

Defined in: [src/i18n.context.ts:55](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L55)

#### Type Parameters

##### P

`P` *extends* `string` = `any`

##### R

`R` = [`PathValue`](../type-aliases/PathValue.md)\<`K`, `P`\>

#### Parameters

##### key

`P`

##### options?

[`TranslateOptions`](../interfaces/TranslateOptions.md)

#### Returns

`IfAnyOrNever`\<`R`, `string`, `R`\>

#### Implementation of

[`I18nTranslator`](../interfaces/I18nTranslator.md).[`t`](../interfaces/I18nTranslator.md#t)

***

### translate()

> **translate**\<`P`, `R`\>(`key`, `options?`): `IfAnyOrNever`\<`R`, `string`, `R`\>

Defined in: [src/i18n.context.ts:24](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L24)

#### Type Parameters

##### P

`P` *extends* `string` = `any`

##### R

`R` = [`PathValue`](../type-aliases/PathValue.md)\<`K`, `P`\>

#### Parameters

##### key

`P`

##### options?

[`TranslateOptions`](../interfaces/TranslateOptions.md)

#### Returns

`IfAnyOrNever`\<`R`, `string`, `R`\>

#### Implementation of

[`I18nTranslator`](../interfaces/I18nTranslator.md).[`translate`](../interfaces/I18nTranslator.md#translate)

***

### validate()

> **validate**(`value`, `options?`): `Promise`\<`ValidationError`[]\>

Defined in: [src/i18n.context.ts:62](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L62)

#### Parameters

##### value

`any`

##### options?

[`TranslateOptions`](../interfaces/TranslateOptions.md)

#### Returns

`Promise`\<`ValidationError`[]\>

#### Implementation of

[`I18nTranslator`](../interfaces/I18nTranslator.md).[`validate`](../interfaces/I18nTranslator.md#validate)

***

### create()

> `static` **create**(`ctx`, `next`): `void`

Defined in: [src/i18n.context.ts:70](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L70)

#### Parameters

##### ctx

`I18nContext`

##### next

(...`args`) => `void`

#### Returns

`void`

***

### createAsync()

> `static` **createAsync**\<`T`\>(`ctx`, `next`): `Promise`\<`T`\>

Defined in: [src/i18n.context.ts:74](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L74)

#### Type Parameters

##### T

`T`

#### Parameters

##### ctx

`I18nContext`

##### next

(...`args`) => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

***

### current()

> `static` **current**\<`K`\>(`context?`): `I18nContext`\<`K`\>

Defined in: [src/i18n.context.ts:78](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/i18n.context.ts#L78)

#### Type Parameters

##### K

`K` = `Record`\<`string`, `unknown`\>

#### Parameters

##### context?

`ArgumentsHost`

#### Returns

`I18nContext`\<`K`\>
