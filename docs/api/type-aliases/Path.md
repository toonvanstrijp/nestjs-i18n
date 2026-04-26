# Type Alias: Path\<T, Depth\>

> **Path**\<`T`, `Depth`\> = \[`T`\] *extends* \[`Record`\<`string`, `any`\>\] ? \{ \[K in PathKeyOf\<T\>\]: 0 extends 1 & T\[K\] ? never : \[T\[K\]\] extends \[Record\<string, any\>\] ? Depth\["length"\] extends 8 ? K : K \| \`$\{K\}.$\{Path\<T\[K\], \[...(...), 1\]\>\}\` : K \}\[`PathKeyOf`\<`T`\>\] : `never`

Defined in: [src/types.ts:12](https://github.com/toonvanstrijp/nestjs-i18n/blob/4e4ebce513fdde29fadb2358f8753744e6022935/src/types.ts#L12)

## Type Parameters

### T

`T`

### Depth

`Depth` *extends* `1`[] = \[\]
