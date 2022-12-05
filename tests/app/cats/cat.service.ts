import { Injectable } from '@nestjs/common';
import { RequestContext } from '../../../src/utils/context';
import { CatModel } from './cat.model';

@Injectable()
export class CatService {
  private cats: CatModel[] = [
    {
      id: 1,
      name: 'foo',
      age: 4,
    },
    {
      id: 2,
      name: 'bar',
      age: 6,
    },
  ];

  constructor() {}

  findAll(): CatModel[] {
    return this.cats;
  }

  findById(id: number): CatModel {
    const cat = this.cats.find((cat) => cat.id === id);
    cat.description = RequestContext.getI18nContext().translate('test.cat');
    return cat;
  }
}
