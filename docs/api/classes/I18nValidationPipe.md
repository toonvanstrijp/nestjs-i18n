# Class: I18nValidationPipe

Defined in: [src/pipes/i18n-validation.pipe.ts:14](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/pipes/i18n-validation.pipe.ts#L14)

## Extends

- `ValidationPipe`

## Constructors

### Constructor

> **new I18nValidationPipe**(`options?`): `I18nValidationPipe`

Defined in: [src/pipes/i18n-validation.pipe.ts:15](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/pipes/i18n-validation.pipe.ts#L15)

#### Parameters

##### options?

[`I18nValidationPipeOptions`](../type-aliases/I18nValidationPipeOptions.md)

#### Returns

`I18nValidationPipe`

#### Overrides

`ValidationPipe.constructor`

## Properties

### errorHttpStatusCode

> `protected` **errorHttpStatusCode**: `ErrorHttpStatusCode`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:33

#### Inherited from

`ValidationPipe.errorHttpStatusCode`

***

### exceptionFactory

> `protected` **exceptionFactory**: (`errors`) => `any`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:35

#### Parameters

##### errors

`ValidationError`[]

#### Returns

`any`

#### Inherited from

`ValidationPipe.exceptionFactory`

***

### expectedType

> `protected` **expectedType**: `Type`\<`any`\>

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:34

#### Inherited from

`ValidationPipe.expectedType`

***

### isDetailedOutputDisabled?

> `protected` `optional` **isDetailedOutputDisabled?**: `boolean`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:30

#### Inherited from

`ValidationPipe.isDetailedOutputDisabled`

***

### isTransformEnabled

> `protected` **isTransformEnabled**: `boolean`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:29

#### Inherited from

`ValidationPipe.isTransformEnabled`

***

### transformOptions

> `protected` **transformOptions**: `ClassTransformOptions`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:32

#### Inherited from

`ValidationPipe.transformOptions`

***

### validateCustomDecorators

> `protected` **validateCustomDecorators**: `boolean`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:36

#### Inherited from

`ValidationPipe.validateCustomDecorators`

***

### validatorOptions

> `protected` **validatorOptions**: `ValidatorOptions`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:31

#### Inherited from

`ValidationPipe.validatorOptions`

## Methods

### createExceptionFactory()

> **createExceptionFactory**(): (`validationErrors?`) => `unknown`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:41

#### Returns

(`validationErrors?`) => `unknown`

#### Inherited from

`ValidationPipe.createExceptionFactory`

***

### flattenValidationErrors()

> `protected` **flattenValidationErrors**(`validationErrors`): `string`[]

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:48

#### Parameters

##### validationErrors

`ValidationError`[]

#### Returns

`string`[]

#### Inherited from

`ValidationPipe.flattenValidationErrors`

***

### isPrimitive()

> `protected` **isPrimitive**(`value`): `boolean`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:46

#### Parameters

##### value

`unknown`

#### Returns

`boolean`

#### Inherited from

`ValidationPipe.isPrimitive`

***

### loadTransformer()

> `protected` **loadTransformer**(`transformerPackage?`): `TransformerPackage`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:39

#### Parameters

##### transformerPackage?

`TransformerPackage`

#### Returns

`TransformerPackage`

#### Inherited from

`ValidationPipe.loadTransformer`

***

### loadValidator()

> `protected` **loadValidator**(`validatorPackage?`): `ValidatorPackage`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:38

#### Parameters

##### validatorPackage?

`ValidatorPackage`

#### Returns

`ValidatorPackage`

#### Inherited from

`ValidationPipe.loadValidator`

***

### mapChildrenToValidationErrors()

> `protected` **mapChildrenToValidationErrors**(`error`, `parentPath?`): `ValidationError`[]

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:49

#### Parameters

##### error

`ValidationError`

##### parentPath?

`string`

#### Returns

`ValidationError`[]

#### Inherited from

`ValidationPipe.mapChildrenToValidationErrors`

***

### prependConstraintsWithParentProp()

> `protected` **prependConstraintsWithParentProp**(`parentPath`, `error`): `ValidationError`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:50

#### Parameters

##### parentPath

`string`

##### error

`ValidationError`

#### Returns

`ValidationError`

#### Inherited from

`ValidationPipe.prependConstraintsWithParentProp`

***

### stripProtoKeys()

> `protected` **stripProtoKeys**(`value`): `void`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:45

#### Parameters

##### value

`any`

#### Returns

`void`

#### Inherited from

`ValidationPipe.stripProtoKeys`

***

### toEmptyIfNil()

> `protected` **toEmptyIfNil**\<`T`, `R`\>(`value`, `metatype`): `string` \| `object` \| `R`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:44

#### Type Parameters

##### T

`T` = `any`

##### R

`R` = `T`

#### Parameters

##### value

`T`

##### metatype

`object` \| `Type`\<`unknown`\>

#### Returns

`string` \| `object` \| `R`

#### Inherited from

`ValidationPipe.toEmptyIfNil`

***

### toValidate()

> `protected` **toValidate**(`metadata`): `boolean`

Defined in: [src/pipes/i18n-validation.pipe.ts:22](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/pipes/i18n-validation.pipe.ts#L22)

#### Parameters

##### metadata

`ArgumentMetadata`

#### Returns

`boolean`

#### Overrides

`ValidationPipe.toValidate`

***

### transform()

> **transform**(`value`, `metadata`): `Promise`\<`any`\>

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:40

Method to implement a custom pipe.  Called with two parameters

#### Parameters

##### value

`any`

argument before it is received by route handler method

##### metadata

`ArgumentMetadata`

contains metadata about the value

#### Returns

`Promise`\<`any`\>

#### Inherited from

`ValidationPipe.transform`

***

### transformPrimitive()

> `protected` **transformPrimitive**(`value`, `metadata`): `any`

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:43

#### Parameters

##### value

`any`

##### metadata

`ArgumentMetadata`

#### Returns

`any`

#### Inherited from

`ValidationPipe.transformPrimitive`

***

### validate()

> `protected` **validate**(`object`, `validatorOptions?`): `ValidationError`[] \| `Promise`\<`ValidationError`[]\>

Defined in: node\_modules/.pnpm/@nestjs+common@11.1.19\_class-transformer@0.5.1\_class-validator@0.15.1\_reflect-metadata@0.2.2\_rxjs@7.8.2/node\_modules/@nestjs/common/pipes/validation.pipe.d.ts:47

#### Parameters

##### object

`object`

##### validatorOptions?

`ValidatorOptions`

#### Returns

`ValidationError`[] \| `Promise`\<`ValidationError`[]\>

#### Inherited from

`ValidationPipe.validate`
