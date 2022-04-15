---
sidebar_position: 10
---

# Mailer

To use `nestjs-i18n` with the [**@nestjs-modules/mailer**](https://github.com/nest-modules/mailer) package, you'll need to register the helper function like this:

```typescript title="src/app.module.ts"
@Module({
  imports: [
    I18nModule.forRoot(...I18nOptions),
    MailerModule.forRootAsync({
      inject: [ I18nService ],
      useFactory: (i18n: I18nService) => ({
        transport: {
          ...
        },
        template: {
          dir: path.join(__dirname, '../resources/templates/'),
          adapter: new HandlebarsAdapter({ t: i18n.hbsHelper })
        },
      })
    }),
  ]
})
```

:::warning
This only works if you're using the `HandlebarsAdapter`. If you're using a different adapter good luck... 🤞
:::