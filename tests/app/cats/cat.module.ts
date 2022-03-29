import { Module } from '@nestjs/common';
import { CatResolver } from './cat.resolver';
import { CatService } from './cat.service';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    CatService,
    CatResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class CatModule {}
