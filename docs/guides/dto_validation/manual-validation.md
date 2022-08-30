---
sidebar_position: 2
---

# Manual validation

To manually validate DTO and get the `I18nValidationError[]` you can make use of the `I18nContext` or `I18nService`.

### I18nContext
```typescript title="src/app.controller.ts"
import { Controller, Get } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class AppController {
  @Get()
  async getHello(@I18n() i18n: I18nContext) {
    let newUserCreateDto = new CreateUserDto();
    let errors = await i18n.validate(newUserCreateDto);
    if (errors > 0) {
      return 'error'
    }
    return 'good';
  }
}
```

### I18nService
```typescript title="src/code.ts"
import { I18n, I18nService } from 'nestjs-i18n';

@Controller()
export class Service {
  constructor(i18nService: I18nService) {}

  async validateUser(): bool {
    let user = new CreateUserDto();
    let newUserCreateDto = new CreateUserDto();
    let errors = await i18n.validate(newUserCreateDto);
    if (errors > 0) {
      return false;
    }
    return true;
  }
}
```