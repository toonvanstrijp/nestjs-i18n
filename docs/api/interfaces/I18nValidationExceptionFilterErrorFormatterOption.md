# Interface: I18nValidationExceptionFilterErrorFormatterOption

Defined in: [src/interfaces/i18n-validation-exception-filter.interface.ts:13](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-validation-exception-filter.interface.ts#L13)

## Extends

- `I18nValidationExceptionFilterCommonErrorsOption`

## Properties

### errorFormatter?

> `optional` **errorFormatter?**: (`errors`) => `object`

Defined in: [src/interfaces/i18n-validation-exception-filter.interface.ts:15](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-validation-exception-filter.interface.ts#L15)

#### Parameters

##### errors

`ValidationError`[]

#### Returns

`object`

***

### errorHttpStatusCode?

> `optional` **errorHttpStatusCode?**: `number`

Defined in: [src/interfaces/i18n-validation-exception-filter.interface.ts:5](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-validation-exception-filter.interface.ts#L5)

#### Inherited from

`I18nValidationExceptionFilterCommonErrorsOption.errorHttpStatusCode`

***

### responseBodyFormatter?

> `optional` **responseBodyFormatter?**: (`host`, `exc`, `formattedErrors`) => `Record`\<`string`, `unknown`\>

Defined in: [src/interfaces/i18n-validation-exception-filter.interface.ts:16](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/interfaces/i18n-validation-exception-filter.interface.ts#L16)

#### Parameters

##### host

`ArgumentsHost`

##### exc

[`I18nValidationException`](../classes/I18nValidationException.md)

##### formattedErrors

`object`

#### Returns

`Record`\<`string`, `unknown`\>
