---
id: "I18nValidationExceptionFilter"
title: "Class: I18nValidationExceptionFilter"
sidebar_label: "I18nValidationExceptionFilter"
sidebar_position: 0
custom_edit_url: null
---

## Implements

- `ExceptionFilter`

## Constructors

### constructor

• **new I18nValidationExceptionFilter**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `I18nValidationExceptionFilterOptions` |

#### Defined in

[src/filters/i18n-validation-exception.filter.ts:23](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/filters/i18n-validation-exception.filter.ts#L23)

## Properties

### options

• `Private` `Readonly` **options**: `I18nValidationExceptionFilterOptions`

#### Defined in

[src/filters/i18n-validation-exception.filter.ts:24](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/filters/i18n-validation-exception.filter.ts#L24)

## Methods

### catch

▸ **catch**(`exception`, `host`): [`I18nValidationException`](I18nValidationException.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `exception` | [`I18nValidationException`](I18nValidationException.md) |
| `host` | `ArgumentsHost` |

#### Returns

[`I18nValidationException`](I18nValidationException.md)

#### Implementation of

ExceptionFilter.catch

#### Defined in

[src/filters/i18n-validation-exception.filter.ts:28](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/filters/i18n-validation-exception.filter.ts#L28)

___

### flattenValidationErrors

▸ `Protected` **flattenValidationErrors**(`validationErrors`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `validationErrors` | `ValidationError`[] |

#### Returns

`string`[]

#### Defined in

[src/filters/i18n-validation-exception.filter.ts:79](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/filters/i18n-validation-exception.filter.ts#L79)

___

### isWithErrorFormatter

▸ `Private` **isWithErrorFormatter**(`options`): options is I18nValidationExceptionFilterErrorFormatterOption

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `I18nValidationExceptionFilterOptions` |

#### Returns

options is I18nValidationExceptionFilterErrorFormatterOption

#### Defined in

[src/filters/i18n-validation-exception.filter.ts:55](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/filters/i18n-validation-exception.filter.ts#L55)

___

### normalizeValidationErrors

▸ `Protected` **normalizeValidationErrors**(`validationErrors`): `object` \| `string`[] \| `ValidationError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `validationErrors` | `ValidationError`[] |

#### Returns

`object` \| `string`[] \| `ValidationError`[]

#### Defined in

[src/filters/i18n-validation-exception.filter.ts:61](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/filters/i18n-validation-exception.filter.ts#L61)
