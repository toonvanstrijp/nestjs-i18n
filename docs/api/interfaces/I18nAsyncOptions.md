---
id: "I18nAsyncOptions"
title: "Interface: I18nAsyncOptions"
sidebar_label: "I18nAsyncOptions"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Pick`<`ModuleMetadata`, ``"imports"``\>

  ↳ **`I18nAsyncOptions`**

## Properties

### imports

• `Optional` **imports**: (`Type`<`any`\> \| `DynamicModule` \| `Promise`<`DynamicModule`\> \| `ForwardReference`<`any`\>)[]

Optional list of imported modules that export the providers which are
required in this module.

#### Inherited from

Pick.imports

#### Defined in

node_modules/@nestjs/common/interfaces/modules/module-metadata.interface.d.ts:18

___

### inject

• `Optional` **inject**: `any`[]

#### Defined in

[src/interfaces/i18n-options.interface.ts:74](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L74)

___

### loader

• `Optional` **loader**: `Type`<[`I18nLoader`](../classes/I18nLoader.md)\>

#### Defined in

[src/interfaces/i18n-options.interface.ts:73](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L73)

___

### logging

• `Optional` **logging**: `boolean`

#### Defined in

[src/interfaces/i18n-options.interface.ts:75](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L75)

___

### name

• `Optional` **name**: `string`

#### Defined in

[src/interfaces/i18n-options.interface.ts:66](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L66)

___

### resolvers

• `Optional` **resolvers**: [`I18nOptionResolver`](../modules.md#i18noptionresolver)[]

#### Defined in

[src/interfaces/i18n-options.interface.ts:72](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L72)

___

### useClass

• `Optional` **useClass**: `Type`<[`I18nOptionsFactory`](I18nOptionsFactory.md)\>

#### Defined in

[src/interfaces/i18n-options.interface.ts:68](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L68)

___

### useExisting

• `Optional` **useExisting**: `Type`<[`I18nOptionsFactory`](I18nOptionsFactory.md)\>

#### Defined in

[src/interfaces/i18n-options.interface.ts:67](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L67)

___

### useFactory

• `Optional` **useFactory**: (...`args`: `any`[]) => [`I18nOptionsWithoutResolvers`](../modules.md#i18noptionswithoutresolvers) \| `Promise`<[`I18nOptionsWithoutResolvers`](../modules.md#i18noptionswithoutresolvers)\>

#### Type declaration

▸ (`...args`): [`I18nOptionsWithoutResolvers`](../modules.md#i18noptionswithoutresolvers) \| `Promise`<[`I18nOptionsWithoutResolvers`](../modules.md#i18noptionswithoutresolvers)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

[`I18nOptionsWithoutResolvers`](../modules.md#i18noptionswithoutresolvers) \| `Promise`<[`I18nOptionsWithoutResolvers`](../modules.md#i18noptionswithoutresolvers)\>

#### Defined in

[src/interfaces/i18n-options.interface.ts:69](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/interfaces/i18n-options.interface.ts#L69)
