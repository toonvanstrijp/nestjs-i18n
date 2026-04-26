# Class: I18nService\<K\>

Defined in: [src/services/i18n.service.ts:62](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/services/i18n.service.ts#L62)

## Type Parameters

### K

`K` = `Record`\<`string`, `unknown`\>

## Implements

- [`I18nTranslator`](../interfaces/I18nTranslator.md)\<`K`\>
- `OnModuleDestroy`

## Constructors

### Constructor

> **new I18nService**\<`K`\>(`i18nOptions`, `translations`, `supportedLanguages`, `logger`, `loaders`, `languagesSubject`, `translationsSubject`): `I18nService`\<`K`\>

Defined in: [src/services/i18n.service.ts:72](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/services/i18n.service.ts#L72)

#### Parameters

##### i18nOptions

[`I18nOptions`](../interfaces/I18nOptions.md)

##### translations

`Observable`\<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>

##### supportedLanguages

`Observable`\<`string`[]\>

##### logger

`Logger`

##### loaders

[`I18nLoader`](I18nLoader.md)[]

##### languagesSubject

`BehaviorSubject`\<`string`[]\>

##### translationsSubject

`BehaviorSubject`\<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>

#### Returns

`I18nService`\<`K`\>

## Properties

### i18nOptions

> `protected` `readonly` **i18nOptions**: [`I18nOptions`](../interfaces/I18nOptions.md)

Defined in: [src/services/i18n.service.ts:74](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/services/i18n.service.ts#L74)

## Methods

### getSupportedLanguages()

> **getSupportedLanguages**(): `string`[]

Defined in: [src/services/i18n.service.ts:183](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/services/i18n.service.ts#L183)

#### Returns

`string`[]

***

### getTranslations()

> **getTranslations**(): [`I18nTranslation`](../interfaces/I18nTranslation.md)

Defined in: [src/services/i18n.service.ts:187](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/services/i18n.service.ts#L187)

#### Returns

[`I18nTranslation`](../interfaces/I18nTranslation.md)

***

### hbsHelper()

> **hbsHelper**(`key`, `args`, `options`): `string`

Defined in: [src/services/i18n.service.ts:217](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/services/i18n.service.ts#L217)

#### Parameters

##### key

`string`

##### args

`any`

##### options

`any`

#### Returns

`string`

***

### onModuleDestroy()

> **onModuleDestroy**(): `void`

Defined in: [src/services/i18n.service.ts:97](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/services/i18n.service.ts#L97)

#### Returns

`void`

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

***

### refresh()

> **refresh**(`translations?`, `languages?`): `Promise`\<`void`\>

Defined in: [src/services/i18n.service.ts:191](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/services/i18n.service.ts#L191)

#### Parameters

##### translations?

[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`\<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>

##### languages?

`string`[] \| `Observable`\<`string`[]\>

#### Returns

`Promise`\<`void`\>

***

### resolveLanguage()

> **resolveLanguage**(`lang`): `string`

Defined in: [src/services/i18n.service.ts:535](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/services/i18n.service.ts#L535)

#### Parameters

##### lang

`string`

#### Returns

`string`

***

### t()

> **t**\<`P`, `R`\>(`key`, `options?`): `IfAnyOrNever`\<`R`, `string`, `R`\>

Defined in: [src/services/i18n.service.ts:176](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/services/i18n.service.ts#L176)

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

Defined in: [src/services/i18n.service.ts:102](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/services/i18n.service.ts#L102)

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

Defined in: [src/services/i18n.service.ts:594](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/services/i18n.service.ts#L594)

#### Parameters

##### value

`any`

##### options?

[`TranslateOptions`](../interfaces/TranslateOptions.md)

#### Returns

`Promise`\<`ValidationError`[]\>

#### Implementation of

[`I18nTranslator`](../interfaces/I18nTranslator.md).[`validate`](../interfaces/I18nTranslator.md#validate)
