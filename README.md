[![Build Status](https://travis-ci.org/ToonvanStrijp/nestjs-i18n.svg?branch=master)](https://travis-ci.org/ToonvanStrijp/nestjs-i18n) [![Greenkeeper badge](https://badges.greenkeeper.io/ToonvanStrijp/nestjs-i18n.svg)](https://greenkeeper.io/)
[![Coverage Status](https://coveralls.io/repos/github/ToonvanStrijp/nestjs-i18n/badge.svg?branch=master)](https://coveralls.io/github/ToonvanStrijp/nestjs-i18n?branch=master)

## Description

The **i18n** module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm i --save nestjs-i18n
```

## Versions

To keep your setup working use the correct version of `nestjs-i18n`.

| nestjs-i18n version    | nestjs version |
| ---------------------- | -------------- |
| **v7.0.0** or greather | **v7.0.0**     |
| **v6.0.0** or below    | **v6.0.0**     |

## Quick Start

Build in we have a JSON parser (`I18nJsonParser`) this parser handles to following structure
@Column({ default: false })
activated!: boolean;

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
  "ARRAY": ["ONE", "TWO", "THREE"]
}
```

To get a specific translation the JSON gets flattened by: [flat](https://github.com/hughsk/flat). All the translations are prefixed with the file name (to prevent collisions). Let's say the filename of the translation file is: `user.json`. To use the `HELLO_MESSAGE` translation you would use the following key: `user.HELLO_MESSAGE`.

String formatting is done by: [string-format](https://github.com/davidchambers/string-format)

### nest-cli.json copy i18n

If you've created your project using the `@nestjs/cli` you can edit the `nest-cli.json` to automatically copy your `i18n` folder to your output (`dist`) folder.

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "assets": ["i18n/**/*"]
  }
}
```

### Translation Module

To use the translation service we first add the module. **The `I18nModule` has a `@Global()` attribute so you should only import it once**.

```typescript
import { Module } from '@nestjs/common';
import * as path from 'path';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
    }),
  ],
  controllers: [],
})
export class AppModule {}
```

#### Using forRootAsync()

```typescript
import { Module } from '@nestjs/common';
import * as path from 'path';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigurationService) => ({
        fallbackLanguage: configService.fallbackLanguage, // e.g., 'en'
        parserOptions: {
          path: path.join(__dirname, '/i18n/'),
        },
      }),
      parser: I18nJsonParser,
      inject: [ConfigurationService],
    }),
  ],
  controllers: [],
})
export class AppModule {}
```

## Live reloading / Refreshing translations

To use live reloading use the `watch` option in the `I18nJsonParser`. The `I18nJsonParser` watches the `i18n` folder for changes and when needed updates the `translations` or `languages`.

```typescript
I18nModule.forRoot({
  fallbackLanguage: 'en',
  parser: I18nJsonParser,
  parserOptions: {
    path: path.join(__dirname, '/i18n/'),
    // add this to enable live translations
    watch: true,
  },
});
```

To refresh your translations and languages manually:

```typescript
await this.i18nService.refresh();
```

### Parser

A default JSON parser (`I18nJsonParser`) is included.

To implement your own `I18nParser` take a look at this example [i18n.json.parser.ts](https://github.com/ToonvanStrijp/nestjs-i18n/blob/master/src/lib/parsers/i18n.json.parser.ts).

#### Live translations / languages

To provide live translations you can return an observable within the extended `I18nParser` class. For and implementation example you can take a look at the [i18n.json.parser.ts](https://github.com/ToonvanStrijp/nestjs-i18n/blob/master/src/lib/parsers/i18n.json.parser.ts).

```typescript
export class I18nMysqlParser extends I18nParser {
  constructor(
    @Inject(I18N_PARSER_OPTIONS)
    private options: I18nJsonParserOptions,
  ) {
    super();
  }

  async languages(): Promise<string[] | Observable<string[]>> {
    // for example do a database call here
    return observableOf(['nl', 'en']);
  }

  async parse(): Promise<I18nTranslation | Observable<I18nTranslation>> {
    // for example do a database call here
    return observableOf({
      nl: {
        HELLO: 'Hallo',
      },
      en: {
        HELLO: 'Hello',
      },
    });
  }
}
```

### Language Resolvers

To make it easier to manage in what language to respond you can make use of resolvers

> (note: When using `forRootAsync` you don't return the `resolvers` with the rest of the config. You'll need to provide the `resolvers` like this: [example](#using-forrootasync-1))

```typescript
@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
        new CookieResolver(['lang', 'locale', 'l']),
      ],
    }),
  ],
  controllers: [HelloController],
})
export class AppModule {}
```

Currently, there are four built-in resolvers

| Resolver                 | Default value |
| ------------------------ | ------------- |
| `QueryResolver`          | `none`        |
| `HeaderResolver`         | `none`        |
| `AcceptLanguageResolver` | `N/A`         |
| `CookieResolver`         | `lang`        |

#### Custom resolver

To implement your own resolver (or custom logic) use the `I18nResolver` interface. The resolvers are provided via the nestjs dependency injection, this way you can inject your own services if needed.

```typescript
@Injectable()
export class QueryResolver implements I18nResolver {
  constructor(@I18nResolverOptions() private keys: string[]) {}

  resolve(context: ExecutionContext) {
    let req: any;

    switch (context.getType() as string) {
      case 'http':
        req = context.switchToHttp().getRequest();
        break;
      case 'graphql':
        [, , { req }] = context.getArgs();
        break;
    }

    let lang: string;

    if (req) {
      for (const key of this.keys) {
        if (req.query != undefined && req.query[key] !== undefined) {
          lang = req.query[key];
          break;
        }
      }
    }

    return lang;
  }
}
```

To provide initial options to your custom resolver use the `@I18nResolverOptions()` decorator, also provide the resolver as followed:

```typescript
I18nModule.forRoot({
  fallbackLanguage: 'en',
  parser: I18nJsonParser,
  parserOptions: {
    path: path.join(__dirname, '/i18n/'),
  },
  resolvers: [{ use: QueryResolver, options: ['lang', 'locale', 'l'] }],
});
```

#### Using forRootAsync()

```typescript
I18nModule.forRootAsync({
  useFactory: () => {
    return {
      fallbackLanguage: 'en',
      parserOptions: {
        path: path.join(__dirname, '/i18n'),
      },
    };
  },
  parser: I18nJsonParser,
  resolvers: [{ use: QueryResolver, options: ['lang', 'locale', 'l'] }],
});
```

### Translating with i18n module

#### `I18nLang` decorator and `I18nService`

```typescript
@Controller()
export class SampleController {
  constructor(private readonly i18n: I18nService) {}

  @Get()
  async sample(@I18nLang() lang: string) {
    await this.i18n.translate('HELLO_MESSAGE', {
      lang: lang,
      args: { id: 1, username: 'Toon' },
    });
    await this.i18n.translate('SETUP.WELCOME', {
      lang: 'en',
      args: { id: 1, username: 'Toon' },
    });
    await this.i18n.translate('ARRAY.0', { lang: 'en' });
  }
}
```

#### `I18n` decorator

```typescript
@Controller()
export class SampleController {
  @Get()
  async sample(@I18n() i18n: I18nContext) {
    await i18n.translate('HELLO_MESSAGE', {
      args: { id: 1, username: 'Toon' },
    });
    await i18n.translate('SETUP.WELCOME', {
      args: { id: 1, username: 'Toon' },
    });
    await i18n.translate('ARRAY.0');
  }
}
```

No need to handle `lang` manually.

#### `I18nRequestScopeService` within a custom service using request scoped translation service

```typescript
@Injectable()
export class SampleService {
  constructor(private readonly i18n: I18nRequestScopeService) {}

  async doFancyStuff() {
    await this.i18n.translate('HELLO_MESSAGE', {
      args: { id: 1, username: 'Toon' },
    });
    await this.i18n.translate('SETUP.WELCOME', {
      args: { id: 1, username: 'Toon' },
    });
    await this.i18n.translate('ARRAY.0');
  }
}
```

To be used within other services like sending E-mails.
The advantage is that you don't have to worry about transporting `lang` from the `Request` to your service.

**Use with caution!** The `I18nRequestScopeService` uses the `REQUEST` scope and is no singleton.
This will be inherited to all consumers of `I18nRequestScopeService`!
Read [Nest Docs](https://docs.nestjs.com/fundamentals/injection-scopes) for more information.

**Dont use `I18nRequestScopeService` within controllers.** The `I18n` decorator is a much better solution.

# CLI

To easily check if your i18n folder is correctly structured you can use the following command:
`nest-i18n check <i18n-path>`

example: `nest-i18n check src/i18n`

This is very useful inside a CI environment to prevent releases with missing translations.

# Breaking changes:

- from V8.0.0 on we changed the internal `18n-middleware` for an `interceptor` this way we can provide the `ExecutionContext` so that `nestjs-i18n` works on diffrent protocols was well for example (grpc or websockets). This contains one breaking change. It only applies to your code if you've made a custom `resolver`. To resolve this breaking change take look at this [example](#custom-resolver). Instead of providing the `req` in the `resolve` method, change this to take the `ExecutionContext` as argument.

- from V6.0.0 on we implemented the `I18nParser`, by using this we can easily support different formats other than JSON. To migrate to this change look at the [Quick start](#quick-start) above. There are some changes in the declaration of the `I18nModule`. Note: the translate function returns a Promise<string>. So you need to call it using await i18n.translate('HELLO');

- from V4.0.0 on we changed the signature of the `translate` method, the language is now optional, if no language is given it'll fallback to the `fallbackLanguage`

- from V3.0.0 on we load translations based on their directory name instead of file name. Change your translations files to the structure above: [info](https://github.com/ToonvanStrijp/nestjs-i18n#structure)
