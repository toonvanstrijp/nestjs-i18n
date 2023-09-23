---
id: "I18nValidationPipe"
title: "Class: I18nValidationPipe"
sidebar_label: "I18nValidationPipe"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `ValidationPipe`

  ↳ **`I18nValidationPipe`**

## Constructors

### constructor

• **new I18nValidationPipe**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`I18nValidationPipeOptions`](../modules.md#i18nvalidationpipeoptions) |

#### Overrides

ValidationPipe.constructor

#### Defined in

[src/pipes/i18n-validation.pipe.ts:15](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/pipes/i18n-validation.pipe.ts#L15)

## Properties

### errorHttpStatusCode

• `Protected` **errorHttpStatusCode**: `ErrorHttpStatusCode`

#### Inherited from

ValidationPipe.errorHttpStatusCode

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:33

___

### exceptionFactory

• `Protected` **exceptionFactory**: (`errors`: `ValidationError`[]) => `any`

#### Type declaration

▸ (`errors`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `errors` | `ValidationError`[] |

##### Returns

`any`

#### Inherited from

ValidationPipe.exceptionFactory

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:35

___

### expectedType

• `Protected` **expectedType**: `Type`<`any`\>

#### Inherited from

ValidationPipe.expectedType

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:34

___

### isDetailedOutputDisabled

• `Protected` `Optional` **isDetailedOutputDisabled**: `boolean`

#### Inherited from

ValidationPipe.isDetailedOutputDisabled

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:30

___

### isTransformEnabled

• `Protected` **isTransformEnabled**: `boolean`

#### Inherited from

ValidationPipe.isTransformEnabled

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:29

___

### transformOptions

• `Protected` **transformOptions**: `ClassTransformOptions`

#### Inherited from

ValidationPipe.transformOptions

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:32

___

### validateCustomDecorators

• `Protected` **validateCustomDecorators**: `boolean`

#### Inherited from

ValidationPipe.validateCustomDecorators

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:36

___

### validatorOptions

• `Protected` **validatorOptions**: `ValidatorOptions`

#### Inherited from

ValidationPipe.validatorOptions

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:31

## Methods

### createExceptionFactory

▸ **createExceptionFactory**(): (`validationErrors?`: `ValidationError`[]) => `unknown`

#### Returns

`fn`

▸ (`validationErrors?`): `unknown`

##### Parameters

| Name | Type |
| :------ | :------ |
| `validationErrors?` | `ValidationError`[] |

##### Returns

`unknown`

#### Inherited from

ValidationPipe.createExceptionFactory

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:41

___

### flattenValidationErrors

▸ `Protected` **flattenValidationErrors**(`validationErrors`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `validationErrors` | `ValidationError`[] |

#### Returns

`string`[]

#### Inherited from

ValidationPipe.flattenValidationErrors

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:48

___

### isPrimitive

▸ `Protected` **isPrimitive**(`value`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`boolean`

#### Inherited from

ValidationPipe.isPrimitive

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:46

___

### loadTransformer

▸ `Protected` **loadTransformer**(`transformerPackage?`): `TransformerPackage`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transformerPackage?` | `TransformerPackage` |

#### Returns

`TransformerPackage`

#### Inherited from

ValidationPipe.loadTransformer

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:39

___

### loadValidator

▸ `Protected` **loadValidator**(`validatorPackage?`): `ValidatorPackage`

#### Parameters

| Name | Type |
| :------ | :------ |
| `validatorPackage?` | `ValidatorPackage` |

#### Returns

`ValidatorPackage`

#### Inherited from

ValidationPipe.loadValidator

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:38

___

### mapChildrenToValidationErrors

▸ `Protected` **mapChildrenToValidationErrors**(`error`, `parentPath?`): `ValidationError`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `ValidationError` |
| `parentPath?` | `string` |

#### Returns

`ValidationError`[]

#### Inherited from

ValidationPipe.mapChildrenToValidationErrors

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:49

___

### prependConstraintsWithParentProp

▸ `Protected` **prependConstraintsWithParentProp**(`parentPath`, `error`): `ValidationError`

#### Parameters

| Name | Type |
| :------ | :------ |
| `parentPath` | `string` |
| `error` | `ValidationError` |

#### Returns

`ValidationError`

#### Inherited from

ValidationPipe.prependConstraintsWithParentProp

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:50

___

### stripProtoKeys

▸ `Protected` **stripProtoKeys**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

ValidationPipe.stripProtoKeys

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:45

___

### toEmptyIfNil

▸ `Protected` **toEmptyIfNil**<`T`, `R`\>(`value`): {} \| `R`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

{} \| `R`

#### Inherited from

ValidationPipe.toEmptyIfNil

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:44

___

### toValidate

▸ `Protected` **toValidate**(`metadata`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `metadata` | `ArgumentMetadata` |

#### Returns

`boolean`

#### Overrides

ValidationPipe.toValidate

#### Defined in

[src/pipes/i18n-validation.pipe.ts:22](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/pipes/i18n-validation.pipe.ts#L22)

___

### transform

▸ **transform**(`value`, `metadata`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `metadata` | `ArgumentMetadata` |

#### Returns

`Promise`<`any`\>

#### Inherited from

ValidationPipe.transform

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:40

___

### transformPrimitive

▸ `Protected` **transformPrimitive**(`value`, `metadata`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `metadata` | `ArgumentMetadata` |

#### Returns

`any`

#### Inherited from

ValidationPipe.transformPrimitive

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:43

___

### validate

▸ `Protected` **validate**(`object`, `validatorOptions?`): `ValidationError`[] \| `Promise`<`ValidationError`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `object` |
| `validatorOptions?` | `ValidatorOptions` |

#### Returns

`ValidationError`[] \| `Promise`<`ValidationError`[]\>

#### Inherited from

ValidationPipe.validate

#### Defined in

node_modules/@nestjs/common/pipes/validation.pipe.d.ts:47
