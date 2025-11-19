import { Resolver, Args, Query, Subscription, Mutation } from '@nestjs/graphql';
import { CatService } from './cat.service';
import {
  I18nLang,
  I18nService,
  I18n,
  I18nValidationException,
  I18nValidationExceptionFilter,
} from '../../../src';
import { I18nContext } from '../../../src/i18n.context';
import { Inject, UseFilters } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CreateCatInput } from './cat.input';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { formatI18nErrors } from '../../../src/utils';

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
  async getCat(@Args('id') id: number) {
    const cat = await this.catService.findById(id);
    return cat;
  }

  @Query('catUsingContext')
  async getCatUsingContext(@Args('id') id: number, @I18n() i18n: I18nContext) {
    const cat = await this.catService.findById(id);
    // we manually overwrite this property to indicate a value that is translated!
    cat.description = i18n.translate('test.cat');
    return cat;
  }

  @Query('catUsingService')
  async getCatUsingService(@Args('id') id: number) {
    const cat = await this.catService.findById(id);
    // we manually overwrite this property to indicate a value that is translated!
    cat.description = this.i18nService.translate('test.cat');
    return cat;
  }

  @Mutation('createCat')
  async create(@Args('createCatInput') args: CreateCatInput): Promise<any> {
    await this.pubSub.publish('catAdded', { catAdded: args.name });
    return args;
  }

  @Subscription('catAdded', {
    resolve: async (payload: any, args: any, ctx: any) => {
      const { catAdded } = payload;
      const i18nService: I18nService = ctx.i18nService;

      return i18nService.translate('test.cat_name', {
        lang: ctx.i18nLang,
        args: { name: catAdded },
      });
    },
  })

  catAdded() {
    return this.pubSub.asyncIterableIterator('catAdded');
  }

  @Mutation('validation')
  async validation(@Args('createCatInput') data: CreateCatInput) {
    // Manually validate the input and throw I18nValidationException
    const inputObject = plainToClass(CreateCatInput, data);
    const errors = await validate(inputObject);
    
    if (errors.length > 0) {
      const i18n = I18nContext.current();
      const formattedErrors = formatI18nErrors(errors, i18n.service, {
        lang: i18n.lang,
      });
      
      const exception = new I18nValidationException(formattedErrors);
      // Set the errors property for GraphQL
      exception.errors = formattedErrors;
      throw exception;
    }
    
    return data;
  }
}
