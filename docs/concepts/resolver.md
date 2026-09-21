---
sidebar_position: 2
---

# Resolvers

The `resolvers` option is used to configure resolvers. The resolvers takes in array of resolvers so you can add in any number of resolvers you like.
`nestjs-i18n` comes with a set of built-in resolvers.

| Name                       | Default value                 |
| -------------------------- | ----------------------------- |
| `QueryResolver`            | `['lang']`                    |
| `HeaderResolver`           | `[]`                          |
| `AcceptLanguageResolver`   | `{matchType: 'strict-loose'}` |
| `CookieResolver`           | `lang`                        |
| `GraphQLWebsocketResolver` | `N/A`                         |
| `GrpcMetadataResolver`     | `['lang']`                    |

```typescript title="src/app.module.ts"
       I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
          resolvers: [
            new QueryResolver(['lang', 'l']),
            new HeaderResolver(['x-custom-lang']),
            new CookieResolver(),
            AcceptLanguageResolver,
          ],
        }),
```

:::tip

If you need to implement a custom resolver, your resolver needs to extend `src/interfaces/i18n-language-resolver.interface.ts` interface. Also you can check the `src/resolvers` to see how the default resolvers are implemented.

:::

### Example: Custom resolver

```typescript title="user-language.resolver.ts"
import { ExecutionContext, Injectable } from "@nestjs/common";
import { I18nResolver } from "nestjs-i18n";
import { ExecutionContextType } from "nestjs-i18n/dist/i18n.constants";

@Injectable()
export class UserLanguageResolver implements I18nResolver {
  async resolve(
    context: ExecutionContext,
  ): Promise<string | string[] | undefined> {
    let req: any;

    switch (context.getType() as string) {
      case ExecutionContextType.HTTP:
        req = context.switchToHttp().getRequest();
        break;
      case ExecutionContextType.WS: {
        const client: any = context.switchToWs().getClient();
        req =
          client?.handshake ?? client?.upgradeReq ?? client?.request ?? client;
        break;
      }
      default:
        return undefined;
    }

    const language = req.raw
      ? req.raw.headers?.["x-user-language"]
      : req?.headers?.["x-user-language"];

    return language;
  }
}
```
