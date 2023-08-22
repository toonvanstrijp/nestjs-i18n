import { Module } from '@nestjs/common';
import { CatResolver } from './cat.resolver';
import { CatService } from './cat.service';
import { PubSub } from 'graphql-subscriptions';
import { CatController } from './cat.controller';

@Module({
  providers: [
    CatService,
    CatResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  controllers: [CatController],
})
export class CatModule {}
