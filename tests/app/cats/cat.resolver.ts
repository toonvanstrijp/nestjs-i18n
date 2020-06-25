import { Resolver, Args, Query } from '@nestjs/graphql';
import { CatService } from './cat.service';
import { I18nLang, I18nService, I18n } from '../../../src/lib';
import { I18nContext } from '../../../src/lib/i18n.context';

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
    cat.description = await this.i18nService.translate('test.cat', {
      lang: lang,
    });
    return cat;
  }

  @Query('catUsingContext')
  async getCatUsingContext(@Args('id') id: number, @I18n() i18n: I18nContext) {
    const cat = await this.catService.findById(id);
    // we manually overwrite this property to indicate a value that is translated!
    cat.description = await i18n.translate('test.cat');
    return cat;
  }
}
