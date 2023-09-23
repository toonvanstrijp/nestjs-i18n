---
id: "I18nTranslator"
title: "Interface: I18nTranslator<K>"
sidebar_label: "I18nTranslator"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | `Record`<`string`, `unknown`\> |

## Implemented by

- [`I18nContext`](../classes/I18nContext.md)
- [`I18nService`](../classes/I18nService.md)

## Methods

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

#### Defined in

[src/interfaces/i18n-translator.interface.ts:11](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-translator.interface.ts#L11)

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

#### Defined in

[src/interfaces/i18n-translator.interface.ts:6](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-translator.interface.ts#L6)

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

#### Defined in

[src/interfaces/i18n-translator.interface.ts:16](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-translator.interface.ts#L16)
