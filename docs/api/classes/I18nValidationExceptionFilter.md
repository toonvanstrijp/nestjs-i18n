# Class: I18nValidationExceptionFilter

Defined in: [src/filters/i18n-validation-exception.filter.ts:27](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/filters/i18n-validation-exception.filter.ts#L27)

## Implements

- `ExceptionFilter`

## Constructors

### Constructor

> **new I18nValidationExceptionFilter**(`options?`): `I18nValidationExceptionFilter`

Defined in: [src/filters/i18n-validation-exception.filter.ts:28](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/filters/i18n-validation-exception.filter.ts#L28)

#### Parameters

##### options?

`I18nValidationExceptionFilterOptions` = `...`

#### Returns

`I18nValidationExceptionFilter`

## Methods

### buildResponseBody()

> `protected` **buildResponseBody**(`host`, `exc`, `error`): `Record`\<`string`, `unknown`\>

Defined in: [src/filters/i18n-validation-exception.filter.ts:126](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/filters/i18n-validation-exception.filter.ts#L126)

#### Parameters

##### host

`ArgumentsHost`

##### exc

[`I18nValidationException`](I18nValidationException.md)

##### error

`object` \| `ValidationError`[] \| `string`[]

#### Returns

`Record`\<`string`, `unknown`\>

***

### catch()

> **catch**(`exception`, `host`): `Promise`\<[`I18nValidationException`](I18nValidationException.md) \| `GraphQLError`\>

Defined in: [src/filters/i18n-validation-exception.filter.ts:33](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/filters/i18n-validation-exception.filter.ts#L33)

Method to implement a custom exception filter.

#### Parameters

##### exception

[`I18nValidationException`](I18nValidationException.md)

the class of the exception being handled

##### host

`ArgumentsHost`

used to access an array of arguments for
the in-flight request

#### Returns

`Promise`\<[`I18nValidationException`](I18nValidationException.md) \| `GraphQLError`\>

#### Implementation of

`ExceptionFilter.catch`

***

### flattenValidationErrors()

> `protected` **flattenValidationErrors**(`validationErrors`): `string`[]

Defined in: [src/filters/i18n-validation-exception.filter.ts:115](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/filters/i18n-validation-exception.filter.ts#L115)

#### Parameters

##### validationErrors

`ValidationError`[]

#### Returns

`string`[]

***

### normalizeValidationErrors()

> `protected` **normalizeValidationErrors**(`validationErrors`): `object` \| `ValidationError`[] \| `string`[]

Defined in: [src/filters/i18n-validation-exception.filter.ts:96](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/filters/i18n-validation-exception.filter.ts#L96)

#### Parameters

##### validationErrors

`ValidationError`[]

#### Returns

`object` \| `ValidationError`[] \| `string`[]
