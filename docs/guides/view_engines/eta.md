---
sidebar_position: 4
---

# Eta

[**Eta**](https://eta.js.org) is a lightweight, fast EJS-compatible template engine. Unlike EJS, template variables are accessed via the `it` object by default.

## Setup

Install the `eta` package:

```bash
npm install eta
```

Register the Eta engine with Express and set `viewEngine: 'eta'` in `I18nModule`:

```typescript title="src/app.module.ts"
I18nModule.forRoot({
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, '/i18n/'),
  },
  viewEngine: 'eta',
}),
```

Because Eta is not natively registered by NestJS, you need to wire it up on the underlying Express app in your bootstrap:

```typescript title="src/main.ts"
import { Eta } from 'eta';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, ExpressAdapter);

  const viewsDir = join(__dirname, '..', 'views');
  const eta = new Eta({ views: viewsDir });

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.engine('eta', buildEtaEngine(eta));
  expressApp.set('view engine', 'eta');
  expressApp.set('views', viewsDir);

  await app.listen(3000);
}

function buildEtaEngine(eta: Eta) {
  return (filePath, data, cb) => {
    try {
      const fileContent = eta.readFile(filePath);
      const renderedTemplate = eta.renderString(fileContent, data);
      cb(null, renderedTemplate);
    } catch (error) {
      cb(error);
    }
  };
}
```

## Example usage

```json title="src/i18n/en/test.json"
{
  "HELLO": "Hello {username}"
}
```

```typescript title="src/app.controller.ts"
@Controller()
export class AppController {
  @Get('/')
  @Render('index')
  index(): any {
    return { username: 'Toon' };
  }
}
```

In your Eta template, `t` and `i18nLang` are available on the `it` object (injected via `app.locals`):

```html title="views/index.eta"
<%= it.t('test.HELLO', it.i18nLang) %>
```
