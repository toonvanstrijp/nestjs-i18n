---
sidebar_position: 6
---

# gRPC

When using a [hybrid](https://docs.nestjs.com/faq/hybrid-application) nestjs app the interceptors won't run on your grpc service out of the box. To fix this use the `inheritAppConfig` option when connecting your microservice. 

```diff title="src/main.ts"
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.GRPC,
      options: {
        package: 'hero',
        protoPath: join(__dirname, 'app/hero.proto'),
      },
    },
+   { inheritAppConfig: true },
  );
```

:::tip

Don't forget to add the `@Payload()` to your data argument inside the controller. Otherwise nestjs fails to pass down your data correctly.

```typescript title="src/controllers/hero.controller.ts"
@GrpcMethod('HeroesService', 'FindOne')
findOne(@Payload() data: HeroById, @I18n() i18n: I18nContext): Hero {
  const items = [
    {
      id: 1,
      name: i18n.t('test.set-up-password.heading', {
        args: { username: 'John' },
      }),
    },
    { id: 2, name: 'Doe' },
  ];
  return items.find(({ id }) => id === data.id);
}
```

:::

After that use the following `GrpcMetadataResolver` resolver.

```diff title="src/app.module.ts"
  I18nModule.forRoot({
    fallbackLanguage: 'en',
    loaderOptions: {
      path: path.join(__dirname, '/i18n/'),
      watch: true,
    },
    resolvers: [
+     GrpcMetadataResolver
    ],
  })
```