---
id: "I18nLoader"
title: "Class: I18nLoader"
sidebar_label: "I18nLoader"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- **`I18nLoader`**

  ↳ [`I18nAbstractLoader`](I18nAbstractLoader.md)

## Constructors

### constructor

• **new I18nLoader**()

## Methods

### languages

▸ `Abstract` **languages**(): `Promise`<`string`[] \| `Observable`<`string`[]\>\>

#### Returns

`Promise`<`string`[] \| `Observable`<`string`[]\>\>

#### Defined in

[src/loaders/i18n.loader.ts:5](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.loader.ts#L5)

___

### load

▸ `Abstract` **load**(): `Promise`<[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>\>

#### Returns

`Promise`<[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>\>

#### Defined in

[src/loaders/i18n.loader.ts:6](https://github.com/toonvanstrijp/nestjs-i18n/blob/085d31c/src/loaders/i18n.loader.ts#L6)
