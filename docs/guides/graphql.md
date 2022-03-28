---
sidebar_position: 5
---

# GraphQL

When using GraphQL `nestjs-i18n` works out of the box in most cases. With normal requests you can add headers etc. so the resolvers still work like you would expect. But when using GraphQL subscriptions this requires additional steps.

To fix this change your `GraphQLModule` configuration.

```diff title="src/app.module.ts"
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    subscriptions: {
      'graphql-ws': true,
    },
    typePaths: ['*/**/*.graphql'],
+   context: (ctx) => ctx,
    path: '/graphql',
  })
```

:::caution

It's recommened to use `graphql-ws` instead of `subscriptions-transport-ws` (**[read more](https://github.com/apollographql/subscriptions-transport-ws)**). If you're still using `subscriptions-transport-ws` you should re-configure your `GraphQLModule`.

```diff title="src/app.module.ts"
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    subscriptions: {
+     'subscriptions-transport-ws': {
+       onConnect: (params) => ({ connectionParams: params }),
+       path: '/graphql'
      }
    },
    typePaths: ['*/**/*.graphql'],
+   context: (ctx) => ctx,
    path: '/graphql',
  })
```
:::

After that use the following `GraphQLWebsocketResolver` resolver.

```diff title="src/app.module.ts"
  I18nModule.forRoot({
    fallbackLanguage: 'en',
    loaderOptions: {
      path: path.join(__dirname, '/i18n/'),
      watch: true,
    },
    resolvers: [
+     GraphQLWebsocketResolver,
      { use: QueryResolver, options: ['lang'] },
      AcceptLanguageResolver,
    ],
  })
```