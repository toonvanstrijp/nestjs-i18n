---
sidebar_position: 7
---

# DTO Validation

To use `nestjs-i18n` in your DTO validation you first need to follow the [**nestjs instructions**](https://docs.nestjs.com/techniques/validation). After that you need to use the `i18nValidationErrorFactory` function in your `ValidationPipe`.

```typescript title="src/main.ts"
import { i18nValidationErrorFactory } from 'nestjs-i18n';

app.useGlobalPipes(
  new ValidationPipe({
    exceptionFactory: i18nValidationErrorFactory,
  }),
);
```

### DTO definition

Inside your DTO class define all your properties and validators. The important thing here is to use the `i18nValidationMessage` helper function inside the `message` property.

```typescript title="src/dto/create-user.dto.ts"
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ExtraUserDto {
  @IsBoolean({ message: 'validation.INVALID_BOOLEAN' })
  subscribeToEmail: string;

  @Min(5, {
    message: i18nValidationMessage('validation.MIN', { message: 'COOL' }),
  })
  min: number;

  @Max(10, {
    message: i18nValidationMessage('validation.MAX', { message: 'SUPER' }),
  })
  max: number;
}

export class CreateUserDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  password: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => ExtraUserDto)
  extra: ExtraUserDto;
}
```

:::tip

By using the `i18nValidationMessage` helper function you can pass in extra arguments or make use of internal `class-validator` properties such as `property`, `value`, `constraints.0`.

:::

### Translations

Inside your translation you now can use `class-validator` properties such as `property`, `value` and `constraints.0`.

```json title="src/i18n/en/validation.json"
{
  "NOT_EMPTY": "{property} cannot be empty",
  "INVALID_EMAIL": "email is invalid",
  "INVALID_BOOLEAN": "{property} is not a boolean",
  "MIN": "{property} with value: \"{value}\" needs to be at least {constraints.0}, ow and {message}",
  "MAX": "{property} with value: \"{value}\" needs to be less than {constraints.0}, ow and {message}"
}
```

### Filter

For `nestjs-i18n` to translate the `class-validator` errors add the `I18nValidationExceptionFilter` on your controller or globally.

```typescript title="src/app.controller.ts"
import { I18nValidationExceptionFilter } from 'nestjs-i18n';

@Post()
@UseFilters(new I18nValidationExceptionFilter())
create(@Body() createUserDto: CreateUserDto): any {
    return 'This action adds a new user';
}
```

```typescript title="src/main.ts"
import { I18nValidationExceptionFilter } from 'nestjs-i18n';

app.useGlobalFilters(new I18nValidationExceptionFilter());
```

#### I18nValidationExceptionFilterOptions

`I18nValidationExceptionFilter` also takes an argument of type `I18nValidationExceptionFilterOptions`

| Name                  | Type                                    | Required | Default | Description                                                            |
| --------------------- | --------------------------------------- | -------- | ------- | ---------------------------------------------------------------------- |
| `detailedErrors`      | `boolean`                               | false    | `true`  | Simplify error messages                                                |
| `errorFormatter`      | `(errors: ValidationError[]) => object` | false    |         | Return the validation errors in a format that you specify.             |
| `errorHttpStatusCode` | `HttpStatus`                            | false    | `400`   | Change the default http status code for the `I18nValidationException`. |

:::info

Note that only one of the properties `detailedErrors` and `errorFormatter` can be used at the time.

:::

### Response

Now your validation errors are being translated 🎉!

```json title="response"
{
  "statusCode": 400,
  "errors": [
    {
      "property": "email",
      "children": [],
      "constraints": {
        "isEmail": "email is invalid",
        "isNotEmpty": "email cannot be empty"
      }
    },
    {
      "property": "password",
      "children": [],
      "constraints": { "isNotEmpty": "password cannot be empty" }
    },
    {
      "property": "extra",
      "children": [
        {
          "property": "subscribeToEmail",
          "children": [],
          "constraints": {
            "isBoolean": "subscribeToEmail is not a boolean"
          }
        },
        {
          "property": "min",
          "children": [],
          "constraints": {
            "min": "min with value: \"1\" needs to be at least 5, ow and COOL"
          }
        },
        {
          "property": "max",
          "children": [],
          "constraints": {
            "max": "max with value: \"100\" needs to be less than 10, ow and SUPER"
          }
        }
      ],
      "constraints": {}
    }
  ]
}
```

:::tip

If you want a different output, create your own interceptor! For an example look at the [`I18nValidationExceptionFilter`](http://google.com).

:::
