---
sidebar_position: 2
---

# Resolvers


The `resolvers` option is used to configure resolvers. The resolvers takes in array of resolvers so you can add in any number of resolvers you like.
`nestjs-i18n` comes with a set of built-in resolvers.

| Name                       | Default value                |
| -------------------------- | ---------------------------- |
| `QueryResolver`            | `['lang']`                   |
| `HeaderResolver`           | `[]`                         |
| `AcceptLanguageResolver`   | `{matchType: 'strict-loose'` |
| `CookieResolver`           | `lang`                       |
| `GraphQLWebsocketResolver` | `N/A`                        |
| `GrpcMetadataResolver`     | `['lang']`                   |

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

If you need to implement a custom resolver, your resolver needs to extend  `src/interfaces/i18n-language-resolver.interface.ts` interface. Also you can check the `src/resolvers` to see how the default resolvers are implemented.

:::

### Example: Custom resolver coming soon
