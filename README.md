[![Build Status](https://travis-ci.org/ToonvanStrijp/nestjs-i18n.svg?branch=master)](https://travis-ci.org/ToonvanStrijp/nestjs-i18n) [![Greenkeeper badge](https://badges.greenkeeper.io/ToonvanStrijp/nestjs-i18n.svg)](https://greenkeeper.io/)

## Description
The **i18n** module for [Nest](https://github.com/nestjs/nest).

## Installation
```bash
$ npm i --save nestjs-i18n
```

## Quick Start

### Structure
create a directory and in it define your language keys as directories.
```
i18n
├── en
│   ├── category.json
│   └── auth.json
└── nl
    ├── category.json
    └── auth.json
```

### Translation File
The format of a translation file could look like this:
```json
{
  "HELLO_MESSAGE": "Hello {username}",
  "GOODBYE_MESSAGE": "Goodbye {username}",
  "USER_ADDED_PRODUCT": "{0.username} added {1.productName} to cart",
  "SETUP": {
    "WELCOME": "Welcome {0.username}",
    "GOODBYE": "Goodbye {0.username}"
  },
  "ARRAY": [
    "ONE",
    "TWO",
    "THREE"
  ]
}
```
String formatting is done by: [string-format](https://github.com/davidchambers/string-format)

### Translation Module
To use the translation service we first add the module. **The `I18nModule` has a `@Global()` attribute so you should only import it once**.
```typescript
import { Module } from '@nestjs/common';
import * as path from 'path';
import { I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      path: path.join(__dirname, '/i18n'), 
      filePattern: '*.json',
      fallbackLanguage: 'en',
    }),
  ],
  controllers: []
})
export class AppModule {}
```

#### Using forRootAsync()
```typescript
import { Module } from '@nestjs/common';
import * as path from 'path';
import { I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRootAsync({ 
        useFactory: (config: ConfigurationService) => ({ 
          path: configService.i18nPath, 
          fallbackLanguage: configService.fallbackLanguage, // e.g., 'en'
          filePattern: configService.i18nFilePattern, // e.g., '*.i18n.json'
        }),
        inject: [ConfigurationService] 
    }),
  ],
  controllers: []
})
export class AppModule {}
```

### Language Resolvers
To make it easier to manage in what language to respond you can make use of resolvers
```typescript
@Module({
  imports: [
    I18nModule.forRoot({
      path: path.join(__dirname, '/i18n/'),
      fallbackLanguage: 'en',
      resolvers: [
        new QueryResolver(['lang', 'locale', 'l']),
        new HeaderResolver(),
        new CookieResolver(['lang', 'locale', 'l'])
      ],
    }),
  ],
  controllers: [HelloController],
})
export class AppModule {}
```
Currently, there are two built-in resolvers

| Resolver | Default value |
| ------------- | ------------- |
| `QueryResolver`  | `none` |
| `HeaderResolver`  | `accept-language` |
| `CookieResolver`  | `lang` |

To implement your own resolver (or custom logic) use the `I18nResolver` interface.

### Translating with i18n module
#### `I18nLang` decorator and `I18nService`
```typescript
@Controller()
export class SampleController {

  constructor(
    private readonly i18n: I18nService,
  ) {}

  @Get()
  sample(
    @I18nLang() lang: string
  ) {
    this.i18n.translate('HELLO_MESSAGE', {lang: lang, args: {id: 1, username: 'Toon'}});
    this.i18n.translate('SETUP.WELCOME', {lang: 'en', args: {id: 1, username: 'Toon'}});
    this.i18n.translate('ARRAY.0', {lang: 'en'});
  }
}
```

#### `I18n` decorator
```typescript
@Controller()
export class SampleController {

  @Get()
  sample(
    @I18n() i18n: I18nContext
  ) {
    i18n.translate('HELLO_MESSAGE', {args: {id: 1, username: 'Toon'}})
    i18n.translate('SETUP.WELCOME', {args: {id: 1, username: 'Toon'}});
    i18n.translate('ARRAY.0');
  }
}
```
No need to handle `lang` manually.

#### `I18nRequestScopeService` within a custom service using request scoped translation service
```typescript
@Injectable()
export class SampleService {
  constructor(private readonly i18n: I18nRequestScopeService) {}

  doFancyStuff() {
    this.i18n.translate('HELLO_MESSAGE', {args: {id: 1, username: 'Toon'}})
    this.i18n.translate('SETUP.WELCOME', {args: {id: 1, username: 'Toon'}});
    this.i18n.translate('ARRAY.0');
  }
}
```
To be used within other services like sending E-mails.
The advantage is that you don't have to worry about transporting `lang` from the `Request` to your service. 

**Use with caution!** The `I18nRequestScopeService` uses the `REQUEST` scope and is no singleton. 
This will be inherited to all consumers of `I18nRequestScopeService`!
Read [Nest Docs](https://docs.nestjs.com/fundamentals/injection-scopes) for more information.

**Dont use `I18nRequestScopeService` within controllers.** The `I18n` decorator is a much better solution.     

### Missing Translations
If you require a translation that is missing, `I18n` will log an error. However, you can also write these missing translations to a new file in order to help translating your application later on.

This behaviour can be controlled via the `saveMissing: boolean` attribute when adding the `I18nModule` to your application. Thereby, `true` describes the following behaviour:

Say, you request the translation `mail.registration.subject` in a `de` language, and this specific key is missing. This will create a `de/mail.missing` file in your `i18n` folder and add the following content:
```json
{
  "registration": {
    "subject": ""
  }
}
```

# CLI
To easily check if your i18n folder is correctly structured you can use the following command:
`nest-i18n check <i18n-path>`

example: `nest-i18n check src/i18n`

This is very useful inside a CI environment to prevent releases with missing translations.

# Breaking changes:
- from V4.0.0 on we changed the signature of the `translate` method, the language is now optional, if no language is given it'll fallback to the `fallbackLanguage`

- from V3.0.0 on we load translations based on their directory name instead of file name. Change your translations files to the structure above: [info](https://github.com/ToonvanStrijp/nestjs-i18n#structure)
