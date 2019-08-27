import { Resolver, Args, Query } from '@nestjs/graphql';
import { CatService } from './cat.service';
import { I18nLang, I18nService } from '../../../src/lib';

@Resolver('Cat')
export class CatResolver {
  constructor(
    private readonly catService: CatService,
    private readonly i18nService: I18nService,
  ) {}

  @Query('cats')
  async getCats() {
    return await this.catService.findAll();
  }

  @Query('cat')
  async getCat(@Args('id') id: number, @I18nLang() lang: string) {
    const cat = await this.catService.findById(id);
    // we manually overwrite this property to indicate a value that is translated!
    cat.description = this.i18nService.translate('test.cat', { lang: lang });
    return cat;
  }
}
