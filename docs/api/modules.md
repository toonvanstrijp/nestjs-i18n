---
id: "modules"
title: "nestjs-i18n"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Classes

- [AcceptLanguageResolver](classes/AcceptLanguageResolver.md)
- [CookieResolver](classes/CookieResolver.md)
- [GraphQLWebsocketResolver](classes/GraphQLWebsocketResolver.md)
- [GrpcMetadataResolver](classes/GrpcMetadataResolver.md)
- [HeaderResolver](classes/HeaderResolver.md)
- [I18nAbstractLoader](classes/I18nAbstractLoader.md)
- [I18nContext](classes/I18nContext.md)
- [I18nJsonLoader](classes/I18nJsonLoader.md)
- [I18nLanguageInterceptor](classes/I18nLanguageInterceptor.md)
- [I18nLoader](classes/I18nLoader.md)
- [I18nMiddleware](classes/I18nMiddleware.md)
- [I18nModule](classes/I18nModule.md)
- [I18nService](classes/I18nService.md)
- [I18nValidationException](classes/I18nValidationException.md)
- [I18nValidationExceptionFilter](classes/I18nValidationExceptionFilter.md)
- [I18nValidationPipe](classes/I18nValidationPipe.md)
- [I18nYamlLoader](classes/I18nYamlLoader.md)
- [QueryResolver](classes/QueryResolver.md)

## Interfaces

- [I18nAbstractLoaderOptions](interfaces/I18nAbstractLoaderOptions.md)
- [I18nAsyncOptions](interfaces/I18nAsyncOptions.md)
- [I18nOptions](interfaces/I18nOptions.md)
- [I18nOptionsFactory](interfaces/I18nOptionsFactory.md)
- [I18nPluralObject](interfaces/I18nPluralObject.md)
- [I18nResolver](interfaces/I18nResolver.md)
- [I18nTranslation](interfaces/I18nTranslation.md)
- [I18nTranslator](interfaces/I18nTranslator.md)
- [I18nValidationExceptionFilterDetailedErrorsOption](interfaces/I18nValidationExceptionFilterDetailedErrorsOption.md)
- [I18nValidationExceptionFilterErrorFormatterOption](interfaces/I18nValidationExceptionFilterErrorFormatterOption.md)
- [OptionsProvider](interfaces/OptionsProvider.md)

## Type Aliases

### Formatter

Ƭ **Formatter**: (`template`: `string`, ...`args`: (`string` \| `Record`<`string`, `string`\>)[]) => `string`

#### Type declaration

▸ (`template`, `...args`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `template` | `string` |
| `...args` | (`string` \| `Record`<`string`, `string`\>)[] |

##### Returns

`string`

#### Defined in

[src/interfaces/i18n-options.interface.ts:38](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L38)

___

### I18nOptionResolver

Ƭ **I18nOptionResolver**: [`ResolverWithOptions`](modules.md#resolverwithoptions) \| `Type`<[`I18nResolver`](interfaces/I18nResolver.md)\> \| [`I18nResolver`](interfaces/I18nResolver.md)

#### Defined in

[src/interfaces/i18n-options.interface.ts:33](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L33)

___

### I18nOptionsWithoutResolvers

Ƭ **I18nOptionsWithoutResolvers**: `Omit`<[`I18nOptions`](interfaces/I18nOptions.md), ``"resolvers"`` \| ``"loader"``\>

#### Defined in

[src/interfaces/i18n-options.interface.ts:28](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L28)

___

### I18nValidationError

Ƭ **I18nValidationError**: `ValidationError`

#### Defined in

[src/interfaces/i18n-validation-error.interface.ts:3](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-validation-error.interface.ts#L3)

___

### I18nValidationPipeOptions

Ƭ **I18nValidationPipeOptions**: `Omit`<`ValidationPipeOptions`, ``"exceptionFactory"``\>

#### Defined in

[src/pipes/i18n-validation.pipe.ts:9](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/pipes/i18n-validation.pipe.ts#L9)

___

### I18nValidatorOptions

Ƭ **I18nValidatorOptions**: `ValidatorOptions`

#### Defined in

[src/interfaces/i18n-options.interface.ts:78](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L78)

___

### OptionProvider

Ƭ **OptionProvider**<`T`\>: `Omit`<`ClassProvider`<`T`\>, ``"provide"``\> \| `Omit`<`ValueProvider`<`T`\>, ``"provide"``\> \| `Omit`<`FactoryProvider`<`T`\>, ``"provide"``\> \| `Omit`<`ExistingProvider`<`T`\>, ``"provide"``\> \| [`OptionsProvider`](interfaces/OptionsProvider.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Defined in

[src/interfaces/i18n-options.interface.ts:17](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L17)

___

### Path

Ƭ **Path**<`T`\>: keyof `T` extends `string` ? `PathImpl2`<`T`\> extends infer P ? `P` extends `string` \| keyof `T` ? `P` : keyof `T` : keyof `T` : `never`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/types.ts:27](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/types.ts#L27)

___

### PathValue

Ƭ **PathValue**<`T`, `P`\>: `P` extends \`${infer Key}.${infer Rest}\` ? `Key` extends keyof `T` ? `Rest` extends [`Path`](modules.md#path)<`T`[`Key`]\> ? [`PathValue`](modules.md#pathvalue)<`T`[`Key`], `Rest`\> : `never` : `never` : `P` extends keyof `T` ? `T`[`P`] : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `P` | extends [`Path`](modules.md#path)<`T`\> |

#### Defined in

[src/types.ts:35](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/types.ts#L35)

___

### ResolverWithOptions

Ƭ **ResolverWithOptions**: { `use`: `Type`<[`I18nResolver`](interfaces/I18nResolver.md)\>  } & [`OptionProvider`](modules.md#optionprovider)

#### Defined in

[src/interfaces/i18n-options.interface.ts:24](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L24)

___

### TranslateOptions

Ƭ **TranslateOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `args?` | ({ `[k: string]`: `any`;  } \| `string`)[] \| { `[k: string]`: `any`;  } |
| `debug?` | `boolean` |
| `defaultValue?` | `string` |
| `lang?` | `string` |

#### Defined in

[src/services/i18n.service.ts:27](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/services/i18n.service.ts#L27)

## Variables

### I18N\_LANGUAGES

• `Const` **I18N\_LANGUAGES**: ``"I18nLanguages"``

#### Defined in

[src/i18n.constants.ts:3](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.constants.ts#L3)

___

### I18N\_LOADER\_OPTIONS

• `Const` **I18N\_LOADER\_OPTIONS**: ``"I18nLoaderOptions"``

#### Defined in

[src/i18n.constants.ts:6](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.constants.ts#L6)

___

### I18N\_OPTIONS

• `Const` **I18N\_OPTIONS**: ``"I18nOptions"``

#### Defined in

[src/i18n.constants.ts:1](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.constants.ts#L1)

___

### I18N\_RESOLVERS

• `Const` **I18N\_RESOLVERS**: ``"I18nResolvers"``

#### Defined in

[src/i18n.constants.ts:5](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.constants.ts#L5)

___

### I18N\_RESOLVER\_OPTIONS

• `Const` **I18N\_RESOLVER\_OPTIONS**: ``"I18nResolverOptions"``

#### Defined in

[src/i18n.constants.ts:4](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.constants.ts#L4)

___

### I18N\_TRANSLATIONS

• `Const` **I18N\_TRANSLATIONS**: ``"I18nTranslations"``

#### Defined in

[src/i18n.constants.ts:2](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.constants.ts#L2)

___

### logger

• `Const` **logger**: `Logger`

#### Defined in

[src/i18n.module.ts:52](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/i18n.module.ts#L52)

## Functions

### I18n

▸ **I18n**(`...dataOrPipes`): `ParameterDecorator`

Defines HTTP route param decorator

#### Parameters

| Name | Type |
| :------ | :------ |
| `...dataOrPipes` | `any`[] |

#### Returns

`ParameterDecorator`

**`Public Api`**

#### Defined in

node_modules/@nestjs/common/decorators/http/create-route-param-metadata.decorator.d.ts:12

___

### I18nLang

▸ **I18nLang**(`...dataOrPipes`): `ParameterDecorator`

Defines HTTP route param decorator

#### Parameters

| Name | Type |
| :------ | :------ |
| `...dataOrPipes` | `any`[] |

#### Returns

`ParameterDecorator`

**`Public Api`**

#### Defined in

node_modules/@nestjs/common/decorators/http/create-route-param-metadata.decorator.d.ts:12

___

### I18nLanguages

▸ **I18nLanguages**(): (`target`: `object`, `key`: `string` \| `symbol`, `index?`: `number`) => `void`

#### Returns

`fn`

▸ (`target`, `key`, `index?`): `void`

Decorator that marks a constructor parameter as a target for
[Dependency Injection (DI)](https://docs.nestjs.com/providers#dependency-injection).

Any injected provider must be visible within the module scope (loosely
speaking, the containing module) of the class it is being injected into. This
can be done by:

- defining the provider in the same module scope
- exporting the provider from one module scope and importing that module into the
  module scope of the class being injected into
- exporting the provider from a module that is marked as global using the
  `@Global()` decorator

#### Injection tokens
Can be *types* (class names), *strings* or *symbols*. This depends on how the
provider with which it is associated was defined. Providers defined with the
`@Injectable()` decorator use the class name. Custom Providers may use strings
or symbols as the injection token.

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `object` |
| `key` | `string` \| `symbol` |
| `index?` | `number` |

##### Returns

`void`

**`See`**

 - [Providers](https://docs.nestjs.com/providers)
 - [Custom Providers](https://docs.nestjs.com/fundamentals/custom-providers)
 - [Injection Scopes](https://docs.nestjs.com/fundamentals/injection-scopes)

**`Public Api`**

#### Defined in

[src/decorators/i18n-languages.decorator.ts:4](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/decorators/i18n-languages.decorator.ts#L4)

___

### I18nResolverOptions

▸ **I18nResolverOptions**(): `any`

#### Returns

`any`

#### Defined in

[src/decorators/i18n-resolver-options.decorator.ts:8](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/decorators/i18n-resolver-options.decorator.ts#L8)

___

### getContextObject

▸ **getContextObject**(`context?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `context?` | `ExecutionContext` \| `ArgumentsHost` |

#### Returns

`any`

#### Defined in

[src/utils/context.ts:5](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/utils/context.ts#L5)

___

### getI18nResolverOptionsToken

▸ **getI18nResolverOptionsToken**(`target`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | () => `void` |

#### Returns

`string`

#### Defined in

[src/decorators/i18n-resolver-options.decorator.ts:4](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/decorators/i18n-resolver-options.decorator.ts#L4)

___

### i18nValidationErrorFactory

▸ **i18nValidationErrorFactory**(): (`errors`: `ValidationError`[]) => [`I18nValidationException`](classes/I18nValidationException.md)

#### Returns

`fn`

▸ (`errors`): [`I18nValidationException`](classes/I18nValidationException.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `errors` | `ValidationError`[] |

##### Returns

[`I18nValidationException`](classes/I18nValidationException.md)

#### Defined in

[src/utils/util.ts:35](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/utils/util.ts#L35)

___

### i18nValidationMessage

▸ **i18nValidationMessage**<`K`\>(`key`, `args?`): (`a`: `ValidationArguments`) => `string`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | `Record`<`string`, `unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Path`](modules.md#path)<`K`\> |
| `args?` | `any` |

#### Returns

`fn`

▸ (`a`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `ValidationArguments` |

##### Returns

`string`

#### Defined in

[src/utils/util.ts:45](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/utils/util.ts#L45)
