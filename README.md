[![Build Status](https://travis-ci.org/ToonvanStrijp/nestjs-i18n.svg?branch=master)](https://travis-ci.org/ToonvanStrijp/nestjs-i18n) [![Greenkeeper badge](https://badges.greenkeeper.io/ToonvanStrijp/nestjs-i18n.svg)](https://greenkeeper.io/)

## Description

The **i18n** module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm i --save nestjs-i18n
```

## Quick Start

### Structure

This module offers to types of loading in your translations files: `BY_DOMAIN` and `BY_LANGUAGE`.

##### loading: BY_DOMAIN (DEPRECATED) will be removed in V3.0.0
create a directory with your translations files it can be as deeply nested as you would like as long as the keys of the translations are unique. The name of each file should be the language you're targeting.
```
i18n
├── auth
│   ├── en.json
│   └── nl.json
├── company
│   ├── en.json
│   └── nl.json
└── event
    ├── en.json
    ├── nl.json
    │
    └── location
        ├── en.json
        └── nl.json
```

#### loading: BY_LANGUAGE
create a directory and in it define your language keys as directories. When using `BY_LANGUAGE` you can also define global translations. This is useful for things that are the same in each language for example your company name. Each file that is in the root of your i18n folder will be defined globally. You can overwrite global translations by defining them within a language.
```
i18n
├── en
│   ├── category.json
│   └── auth.json
├── nl
│   ├── category.json
│   └── auth.json
└── global.json
```

### Translation file
The format for the translation file could look like this:
```
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

### Translation module
To use the translation service we first add the module. **The `I18nModule` has an `@Global()` attribute so you should only import it once**.
```
import { Module } from '@nestjs/common';
import * as path from 'path';
import { I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({path: path.join(__dirname, '/i18n/'), fallbackLanguage: 'en'}),
  ],
  controllers: []
})
export class AppModule {}

```
#### using forRootAsync
```
import { Module } from '@nestjs/common';
import * as path from 'path';
import { I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRootAsync({ 
        useFactory: (config: ConfigurationService) => (
            { path: configService.i18nPath, fallbackLanguage: 'es' }
        ),
        inject: [ConfigurationService] 
    }),
  ],
  controllers: []
})
export class AppModule {}

```
### Using translation service
```
@Controller()
export class SampleController {

  constructor(
    private readonly i18n: I18nService,
  ) {}

  @Get()
  sample() {
    this.i18n.translate('en', 'HELLO_MESSAGE', {id: 1, username: 'Toon'});
    this.i18n.translate('en', 'SETUP.WELCOME', {id: 1, username: 'Toon'});
    this.i18n.translate('en', 'ARRAY.0');
  }
}
```
