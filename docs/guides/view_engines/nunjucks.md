---
sidebar_position: 5
---

# Nunjucks

To enable [**nunjucks**](https://mozilla.github.io/nunjucks/) support, set `viewEngine: 'nunjucks'` in `I18nModule` and configure a Nunjucks renderer for your HTTP adapter.

## Express setup

```typescript title="src/main.ts"
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const viewsDir = join(__dirname, '..', 'views');
  const nunjucks = require('nunjucks');
  const expressApp = app.getHttpAdapter().getInstance();

  nunjucks.configure(viewsDir, {
    autoescape: true,
    noCache: true,
    express: expressApp,
  });

  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('njk');

  await app.listen(3000);
}
```

## Fastify setup

```typescript title="src/main.ts"
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setViewEngine({
    engine: {
      nunjucks: require('nunjucks'),
    },
    templates: join(__dirname, '..', 'views'),
    viewExt: 'njk',
  });

  await app.listen(3000);
}
```

## Module setup

```typescript title="src/app.module.ts"
I18nModule.forRoot({
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, '/i18n/'),
  },
  viewEngine: 'nunjucks',
}),
```

## Template usage

`nestjs-i18n` injects `t` and `i18nLang` into locals, so in `.njk` templates:

```html title="views/index.njk"
{{ t('test.HELLO', i18nLang) }}
```
