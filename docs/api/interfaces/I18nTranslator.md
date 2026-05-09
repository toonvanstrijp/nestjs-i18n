# Interface: I18nTranslator\<K\>

Defined in: [src/interfaces/i18n-translator.interface.ts:5](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-translator.interface.ts#L5)

## Type Parameters

### K

`K` = `Record`\<`string`, `unknown`\>

## Methods

### t()

> **t**\<`P`, `R`\>(`key`, `options?`): `IfAnyOrNever`\<`R`, `string`, `R`\>

Defined in: [src/interfaces/i18n-translator.interface.ts:11](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-translator.interface.ts#L11)

#### Type Parameters

##### P

`P` *extends* `string` = `any`

##### R

`R` = [`PathValue`](../type-aliases/PathValue.md)\<`K`, `P`\>

#### Parameters

##### key

`P`

##### options?

[`TranslateOptions`](TranslateOptions.md)

#### Returns

`IfAnyOrNever`\<`R`, `string`, `R`\>

***

### translate()

> **translate**\<`P`, `R`\>(`key`, `options?`): `IfAnyOrNever`\<`R`, `string`, `R`\>

Defined in: [src/interfaces/i18n-translator.interface.ts:6](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-translator.interface.ts#L6)

#### Type Parameters

##### P

`P` *extends* `string` = `any`

##### R

`R` = [`PathValue`](../type-aliases/PathValue.md)\<`K`, `P`\>

#### Parameters

##### key

`P`

##### options?

[`TranslateOptions`](TranslateOptions.md)

#### Returns

`IfAnyOrNever`\<`R`, `string`, `R`\>

***

### validate()

> **validate**(`value`, `options?`): `Promise`\<`ValidationError`[]\>

Defined in: [src/interfaces/i18n-translator.interface.ts:16](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-translator.interface.ts#L16)

#### Parameters

##### value

`any`

##### options?

[`TranslateOptions`](TranslateOptions.md)

#### Returns

`Promise`\<`ValidationError`[]\>
