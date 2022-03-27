import { Resolver, Args, Query, Subscription, Mutation } from '@nestjs/graphql';
import { CatService } from './cat.service';
import { I18nLang, I18nService, I18n } from '../../../src';
import { I18nContext } from '../../../src/i18n.context';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Resolver('Cat')
export class CatResolver {
  constructor(
    private readonly catService: CatService,
    private readonly i18nService: I18nService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Query('cats')
  async getCats() {
    return await this.catService.findAll();
  }

  @Query('cat')
  async getCat(@Args('id') id: number, @I18nLang() lang: string) {
    const cat = await this.catService.findById(id);
    // we manually overwrite this property to indicate a value that is translated!
    cat.description = this.i18nService.translate('test.cat', {
      lang: lang,
    });
    return cat;
  }

  @Query('catUsingContext')
  async getCatUsingContext(@Args('id') id: number, @I18n() i18n: I18nContext) {
    const cat = await this.catService.findById(id);
    // we manually overwrite this property to indicate a value that is translated!
    cat.description = i18n.translate('test.cat');
    return cat;
  }

  @Mutation('createCat')
  async create(@Args('createCatInput') args: any): Promise<any> {
    await this.pubSub.publish('catAdded', { catAdded: args.name });
    return args;
  }

  @Subscription('catAdded', {resolve: async (payload: any, args: any, ctx: any) => {
    const {catAdded} = payload;
    const i18nService: I18nService = ctx.i18nService;

    return i18nService.translate('test.cat_name', {lang: ctx.i18nLang, args: {name: catAdded}});
  }})
  catAdded() {
    return this.pubSub.asyncIterator('catAdded');
  }
}
