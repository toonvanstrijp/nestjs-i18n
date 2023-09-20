---
id: "I18nValidationExceptionFilterErrorFormatterOption"
title: "Interface: I18nValidationExceptionFilterErrorFormatterOption"
sidebar_label: "I18nValidationExceptionFilterErrorFormatterOption"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `I18nValidationExceptionFilterCommonErrorsOption`

  ↳ **`I18nValidationExceptionFilterErrorFormatterOption`**

## Properties

### errorFormatter

• `Optional` **errorFormatter**: (`errors`: `ValidationError`[]) => `object`

#### Type declaration

▸ (`errors`): `object`

##### Parameters

| Name | Type |
| :------ | :------ |
| `errors` | `ValidationError`[] |

##### Returns

`object`

#### Defined in

[src/interfaces/i18n-validation-exception-filter.interface.ts:14](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-validation-exception-filter.interface.ts#L14)

___

### errorHttpStatusCode

• `Optional` **errorHttpStatusCode**: `number`

#### Inherited from

I18nValidationExceptionFilterCommonErrorsOption.errorHttpStatusCode

#### Defined in

[src/interfaces/i18n-validation-exception-filter.interface.ts:4](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-validation-exception-filter.interface.ts#L4)
