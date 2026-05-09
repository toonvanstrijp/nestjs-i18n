# Mailer

This guide shows a complete setup for using `nestjs-i18n` with
[`@nestjs-modules/mailer`](https://github.com/nest-modules/mailer) and Handlebars templates.

## 1. Configure `I18nModule` and `MailerModule`

Register the `t` helper on the Handlebars adapter using `i18n.hbsHelper`.

```typescript title="src/app.module.ts"
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { I18nModule, I18nService, HeaderResolver } from 'nestjs-i18n';
import path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-lang'])],
    }),
    MailerModule.forRootAsync({
      inject: [I18nService],
      useFactory: (i18n: I18nService) => ({
        transport: {
          // your SMTP config
        },
        defaults: {
          from: '"No Reply" <no-reply@example.com>',
        },
        template: {
          dir: path.join(__dirname, 'mail/templates'),
          adapter: new HandlebarsAdapter({ t: i18n.hbsHelper }),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class AppModule {}
```

## 2. Add translations with parameters

```json title="src/i18n/en/mail.json"
{
  "opening": {
    "withName": "Hello {firstName}!"
  },
  "resetPassword": {
    "subject": "Reset your password",
    "line": "Click this link to reset your password: {url}"
  }
}
```

```json title="src/i18n/nl/mail.json"
{
  "opening": {
    "withName": "Hallo {firstName}!"
  },
  "resetPassword": {
    "subject": "Wachtwoord opnieuw instellen",
    "line": "Klik op deze link om je wachtwoord opnieuw in te stellen: {url}"
  }
}
```

## 3. Use `t` in `.hbs` templates

Use `this` as the helper arguments object so template context fields are available for placeholders.

```handlebars title="src/mail/templates/reset-password.hbs"
<h1>{{ t 'mail.opening.withName' this }}</h1>
<p>{{ t 'mail.resetPassword.line' this }}</p>
```

`firstName` and `url` come from the mail `context` object.

## 4. Send mail with `i18nLang` in context

When rendering email templates, pass `i18nLang` in `context`.
This is how the `hbsHelper` determines language.

```typescript title="src/mail/mail.service.ts"
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(input: {
    to: string;
    lang: string;
    firstName: string;
    resetUrl: string;
  }) {
    await this.mailerService.sendMail({
      to: input.to,
      template: 'reset-password',
      context: {
        i18nLang: input.lang,
        firstName: input.firstName,
        url: input.resetUrl,
      },
    });
  }
}
```

## Notes

- `i18nLang` is required in mail template context when using `i18n.hbsHelper`.
- If `i18nLang` is omitted, translation falls back to your configured fallback language.
- This helper wiring is for Handlebars (`HandlebarsAdapter`).
