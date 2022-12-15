import { Injectable } from '@nestjs/common';
import { I18nContext } from '../../../src';
import { I18nTranslations } from '../../generated/i18n.generated';
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
    cat.description =
      I18nContext.current<I18nTranslations>().translate('test.cat');
    return cat;
  }
}
