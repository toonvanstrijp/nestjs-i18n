---
id: "I18nValidationException"
title: "Class: I18nValidationException"
sidebar_label: "I18nValidationException"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `HttpException`

  ↳ **`I18nValidationException`**

## Constructors

### constructor

• **new I18nValidationException**(`errors`, `status?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `errors` | `ValidationError`[] | `undefined` |
| `status` | `HttpStatus` | `HttpStatus.BAD_REQUEST` |

#### Overrides

HttpException.constructor

#### Defined in

[src/interfaces/i18n-validation-error.interface.ts:6](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-validation-error.interface.ts#L6)

## Properties

### cause

• **cause**: `Error`

#### Inherited from

HttpException.cause

#### Defined in

node_modules/@nestjs/common/exceptions/http.exception.d.ts:58

___

### errors

• **errors**: `ValidationError`[]

#### Defined in

[src/interfaces/i18n-validation-error.interface.ts:7](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-validation-error.interface.ts#L7)

___

### message

• **message**: `string`

#### Inherited from

HttpException.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1054

___

### name

• **name**: `string`

#### Inherited from

HttpException.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1053

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

HttpException.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1055

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

HttpException.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

HttpException.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### getResponse

▸ **getResponse**(): `string` \| `object`

#### Returns

`string` \| `object`

#### Inherited from

HttpException.getResponse

#### Defined in

node_modules/@nestjs/common/exceptions/http.exception.d.ts:69

___

### getStatus

▸ **getStatus**(): `number`

#### Returns

`number`

#### Inherited from

HttpException.getStatus

#### Defined in

node_modules/@nestjs/common/exceptions/http.exception.d.ts:70

___

### initCause

▸ **initCause**(): `void`

Configures error chaining support

See:
- https://nodejs.org/en/blog/release/v16.9.0/#error-cause
- https://github.com/microsoft/TypeScript/issues/45167

#### Returns

`void`

#### Inherited from

HttpException.initCause

#### Defined in

node_modules/@nestjs/common/exceptions/http.exception.d.ts:66

___

### initMessage

▸ **initMessage**(): `void`

#### Returns

`void`

#### Inherited from

HttpException.initMessage

#### Defined in

node_modules/@nestjs/common/exceptions/http.exception.d.ts:67

___

### initName

▸ **initName**(): `void`

#### Returns

`void`

#### Inherited from

HttpException.initName

#### Defined in

node_modules/@nestjs/common/exceptions/http.exception.d.ts:68

___

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

HttpException.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4

___

### createBody

▸ `Static` **createBody**(`objectOrErrorMessage`, `description?`, `statusCode?`): `object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectOrErrorMessage` | `string` \| `object` |
| `description?` | `string` |
| `statusCode?` | `number` |

#### Returns

`object`

#### Inherited from

HttpException.createBody

#### Defined in

node_modules/@nestjs/common/exceptions/http.exception.d.ts:71

___

### extractDescriptionAndOptionsFrom

▸ `Static` **extractDescriptionAndOptionsFrom**(`descriptionOrOptions`): `DescriptionAndOptions`

Utility method used to extract the error description and httpExceptionOptions from the given argument.
This is used by inheriting classes to correctly parse both options.

#### Parameters

| Name | Type |
| :------ | :------ |
| `descriptionOrOptions` | `string` \| `HttpExceptionOptions` |

#### Returns

`DescriptionAndOptions`

the error description and the httpExceptionOptions as an object.

#### Inherited from

HttpException.extractDescriptionAndOptionsFrom

#### Defined in

node_modules/@nestjs/common/exceptions/http.exception.d.ts:79

___

### getDescriptionFrom

▸ `Static` **getDescriptionFrom**(`descriptionOrOptions`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `descriptionOrOptions` | `string` \| `HttpExceptionOptions` |

#### Returns

`string`

#### Inherited from

HttpException.getDescriptionFrom

#### Defined in

node_modules/@nestjs/common/exceptions/http.exception.d.ts:72

___

### getHttpExceptionOptionsFrom

▸ `Static` **getHttpExceptionOptionsFrom**(`descriptionOrOptions`): `HttpExceptionOptions`

#### Parameters

| Name | Type |
| :------ | :------ |
| `descriptionOrOptions` | `string` \| `HttpExceptionOptions` |

#### Returns

`HttpExceptionOptions`

#### Inherited from

HttpException.getHttpExceptionOptionsFrom

#### Defined in

node_modules/@nestjs/common/exceptions/http.exception.d.ts:73
