# Abstract Class: I18nLoader

Defined in: [src/loaders/i18n.loader.ts:4](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.loader.ts#L4)

## Extended by

- [`I18nAbstractLoader`](I18nAbstractLoader.md)

## Constructors

### Constructor

> **new I18nLoader**(): `I18nLoader`

#### Returns

`I18nLoader`

## Methods

### languages()

> `abstract` **languages**(): `Promise`\<`string`[] \| `Observable`\<`string`[]\>\>

Defined in: [src/loaders/i18n.loader.ts:5](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.loader.ts#L5)

#### Returns

`Promise`\<`string`[] \| `Observable`\<`string`[]\>\>

***

### load()

> `abstract` **load**(): `Promise`\<[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`\<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>\>

Defined in: [src/loaders/i18n.loader.ts:6](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/loaders/i18n.loader.ts#L6)

#### Returns

`Promise`\<[`I18nTranslation`](../interfaces/I18nTranslation.md) \| `Observable`\<[`I18nTranslation`](../interfaces/I18nTranslation.md)\>\>
