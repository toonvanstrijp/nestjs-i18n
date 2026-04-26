# Type Alias: PathValue\<T, P\>

> **PathValue**\<`T`, `P`\> = `P` *extends* `` `${infer Key}.${infer Rest}` `` ? `Key` *extends* keyof `T` ? `PathValue`\<`T`\[`Key`\], `Rest`\> : `never` : `P` *extends* keyof `T` ? `T`\[`P`\] : `never`

Defined in: [src/types.ts:24](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/types.ts#L24)

## Type Parameters

### T

`T`

### P

`P` *extends* `string`
