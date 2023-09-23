---
id: "I18nService"
title: "Class: I18nService<K>"
sidebar_label: "I18nService"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | `Record`<`string`, `unknown`\> |

## Implements

- [`I18nTranslator`](../interfaces/I18nTranslator.md)<`K`\>
- `OnModuleDestroy`

## Constructors

### constructor

• **new I18nService**<`K`\>(`i18nOptions`, `translations`, `supportedLanguages`, `logger`, `loader`, `languagesSubject`, `translationsSubject`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | `Record`<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `i18nOptions` | [`I18nOptions`](../interfaces/I18nOptions.md) |
| `translations` | `Observable`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\> |
| `supportedLanguages` | `Observable`<`string`[]\> |
| `logger` | `Logger` |
| `loader` | [`I18nLoader`](I18nLoader.md) |
| `languagesSubject` | `BehaviorSubject`<`string`[]\> |
| `translationsSubject` | `BehaviorSubject`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\> |

#### Defined in

[src/services/i18n.service.ts:44](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L44)

## Properties

### i18nOptions

• `Protected` `Readonly` **i18nOptions**: [`I18nOptions`](../interfaces/I18nOptions.md)

#### Defined in

[src/services/i18n.service.ts:46](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L46)

___

### languagesSubject

• `Private` `Readonly` **languagesSubject**: `BehaviorSubject`<`string`[]\>

#### Defined in

[src/services/i18n.service.ts:54](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L54)

___

### loader

• `Private` `Readonly` **loader**: [`I18nLoader`](I18nLoader.md)

#### Defined in

[src/services/i18n.service.ts:52](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L52)

___

### logger

• `Private` `Readonly` **logger**: `Logger`

#### Defined in

[src/services/i18n.service.ts:51](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L51)

___

### pluralRules

• `Private` **pluralRules**: `Map`<`string`, `PluralRules`\>

#### Defined in

[src/services/i18n.service.ts:40](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L40)

___

### supportedLanguages

• `Private` **supportedLanguages**: `string`[]

#### Defined in

[src/services/i18n.service.ts:38](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L38)

___

### translations

• `Private` **translations**: [`I18nTranslation`](../interfaces/I18nTranslation.md)

#### Defined in

[src/services/i18n.service.ts:39](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L39)

___

### translationsSubject

• `Private` `Readonly` **translationsSubject**: `BehaviorSubject`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>

#### Defined in

[src/services/i18n.service.ts:56](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L56)

___

### unsubscribe

• `Private` **unsubscribe**: `Subject`<`void`\>

#### Defined in

[src/services/i18n.service.ts:42](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L42)

## Methods

### getFallbackLanguage

▸ `Private` **getFallbackLanguage**(`lang`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `lang` | `string` |

#### Returns

`string`

#### Defined in

[src/services/i18n.service.ts:138](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L138)

___

### getNestedTranslations

▸ `Private` **getNestedTranslations**(`translation`): { `args`: `any` ; `index`: `number` ; `key`: `string` ; `length`: `number`  }[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `translation` | `string` |

#### Returns

{ `args`: `any` ; `index`: `number` ; `key`: `string` ; `length`: `number`  }[]

#### Defined in

[src/services/i18n.service.ts:332](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L332)

___

### getPluralObject

▸ `Private` **getPluralObject**(`translation`): [`I18nPluralObject`](../interfaces/I18nPluralObject.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `translation` | `any` |

#### Returns

[`I18nPluralObject`](../interfaces/I18nPluralObject.md)

#### Defined in

[src/services/i18n.service.ts:322](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L322)

___

### getSupportedLanguages

▸ **getSupportedLanguages**(): `string`[]

#### Returns

`string`[]

#### Defined in

[src/services/i18n.service.ts:161](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L161)

___

### getTranslations

▸ **getTranslations**(): [`I18nTranslation`](../interfaces/I18nTranslation.md)

#### Returns

[`I18nTranslation`](../interfaces/I18nTranslation.md)

#### Defined in

[src/services/i18n.service.ts:165](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L165)

___

### hbsHelper

▸ **hbsHelper**<`P`\>(`key`, `args`, `options`): `IfAnyOrNever`<[`PathValue`](../modules.md#pathvalue)<`K`, `P`\>, `string`, [`PathValue`](../modules.md#pathvalue)<`K`, `P`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `string` = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `P` |
| `args` | `any` |
| `options` | `any` |

#### Returns

`IfAnyOrNever`<[`PathValue`](../modules.md#pathvalue)<`K`, `P`\>, `string`, [`PathValue`](../modules.md#pathvalue)<`K`, `P`\>\>

#### Defined in

[src/services/i18n.service.ts:195](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L195)

___

### onModuleDestroy

▸ **onModuleDestroy**(): `void`

#### Returns

`void`

#### Implementation of

OnModuleDestroy.onModuleDestroy

#### Defined in

[src/services/i18n.service.ts:68](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L68)

___

### refresh

▸ **refresh**(`translations?`, `languages?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `translations?` | [`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\> |
| `languages?` | `string`[] \| `Observable`<`string`[]\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/services/i18n.service.ts:169](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L169)

___

### resolveLanguage

▸ **resolveLanguage**(`lang`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `lang` | `string` |

#### Returns

`string`

#### Defined in

[src/services/i18n.service.ts:306](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L306)

___

### t

▸ **t**<`P`, `R`\>(`key`, `options?`): `IfAnyOrNever`<`R`, `string`, `R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `string` = `any` |
| `R` | [`PathValue`](../modules.md#pathvalue)<`K`, `P`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `P` |
| `options?` | [`TranslateOptions`](../modules.md#translateoptions) |

#### Returns

`IfAnyOrNever`<`R`, `string`, `R`\>

#### Implementation of

[I18nTranslator](../interfaces/I18nTranslator.md).[t](../interfaces/I18nTranslator.md#t)

#### Defined in

[src/services/i18n.service.ts:154](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L154)

___

### translate

▸ **translate**<`P`, `R`\>(`key`, `options?`): `IfAnyOrNever`<`R`, `string`, `R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `string` = `any` |
| `R` | [`PathValue`](../modules.md#pathvalue)<`K`, `P`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `P` |
| `options?` | [`TranslateOptions`](../modules.md#translateoptions) |

#### Returns

`IfAnyOrNever`<`R`, `string`, `R`\>

#### Implementation of

[I18nTranslator](../interfaces/I18nTranslator.md).[translate](../interfaces/I18nTranslator.md#translate)

#### Defined in

[src/services/i18n.service.ts:73](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L73)

___

### translateObject

▸ `Private` **translateObject**(`key`, `translations`, `lang`, `options?`, `rootTranslations?`): `string` \| [`I18nTranslation`](../interfaces/I18nTranslation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `translations` | `string` \| [`I18nTranslation`](../interfaces/I18nTranslation.md) |
| `lang` | `string` |
| `options?` | [`TranslateOptions`](../modules.md#translateoptions) |
| `rootTranslations?` | `string` \| [`I18nTranslation`](../interfaces/I18nTranslation.md) |

#### Returns

`string` \| [`I18nTranslation`](../interfaces/I18nTranslation.md)

#### Defined in

[src/services/i18n.service.ts:208](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L208)

___

### validate

▸ **validate**(`value`, `options?`): `Promise`<`ValidationError`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `options?` | [`TranslateOptions`](../modules.md#translateoptions) |

#### Returns

`Promise`<`ValidationError`[]\>

#### Implementation of

[I18nTranslator](../interfaces/I18nTranslator.md).[validate](../interfaces/I18nTranslator.md#validate)

#### Defined in

[src/services/i18n.service.ts:364](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L364)
