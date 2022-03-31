<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs-i18n.com/img/logo.svg" width="600" alt="nestjs-i18n Logo" /></a>
</p>
<p align="center">
  The i18n library for <a href="https://nestjs.com" target="_blank">nestjs</a>. It makes working with languages in your nestjs project easy. Everything is made to be highly configurable. You can write and plug-in your own language resolvers or loaders.
  <p align="center">
    <a href="https://www.npmjs.com/package/nestjs-i18n" target="_blank"><img alt="npm version" src="https://img.shields.io/npm/v/nestjs-i18n" /></a>
    <a href="https://www.npmjs.com/package/nestjs-i18n" target="_blank"><img alt="NPM" src="https://img.shields.io/npm/l/nestjs-i18n" /></a>
    <a href="https://github.com/toonvanstrijp/nestjs-i18n/actions/workflows/test.yaml" target="_blank"><img src="https://github.com/toonvanstrijp/nestjs-i18n/actions/workflows/test.yaml/badge.svg?branch=main" /></a>
    <a href="https://www.npmjs.com/package/nestjs-i18n" target="_blank"><img alt="npm downloads" src="https://img.shields.io/npm/dm/nestjs-i18n" /></a>
     <a href="https://coveralls.io/github/toonvanstrijp/nestjs-i18n?branch=main" target="_blank"><img alt="coverage" src="https://coveralls.io/repos/github/toonvanstrijp/nestjs-i18n/badge.svg?branch=main" /></a>
  </p>
</p>

## Getting started

To get started follow the [quickstart](https://nestjs-i18n.com/quick-start), or take a look at the docs at [nestjs-i18n.com](https://nestjs-i18n.com/). 

## License
nestjs-i18n is MIT licensed.

## Breaking changes:

- from V9.0.0 on we renamed the `parser` property to `loader`. The `translate` function no longer returns a promise 🎉. A lot of new features and new docs, see [nestjs-i18n.com](https://nestjs-i18n.com/).

- from V8.0.0 on we changed the internal `18n-middleware` for an `interceptor` this way we can provide the `ExecutionContext` so that `nestjs-i18n` works on diffrent protocols was well for example (grpc or websockets). This contains one breaking change. It only applies to your code if you've made a custom `resolver`. To resolve this breaking change take look at this [example](#custom-resolver). Instead of providing the `req` in the `resolve` method, change this to take the `ExecutionContext` as argument.

- from V6.0.0 on we implemented the `I18nParser`, by using this we can easily support different formats other than JSON. To migrate to this change look at the [Quick start](#quick-start) above. There are some changes in the declaration of the `I18nModule`. Note: the translate function returns a Promise<string>. So you need to call it using await i18n.translate('HELLO');

- from V4.0.0 on we changed the signature of the `translate` method, the language is now optional, if no language is given it'll fallback to the `fallbackLanguage`

- from V3.0.0 on we load translations based on their directory name instead of file name. Change your translations files to the structure above: [info](https://github.com/ToonvanStrijp/nestjs-i18n#structure)
