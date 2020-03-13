import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import { Observable } from 'rxjs';

export abstract class I18nParser<T = any> {
  protected options: T;
  constructor() {}
  abstract languages(): Promise<string[]> | Observable<string[]>;
  abstract async parse(): Promise<
    I18nTranslation | Observable<I18nTranslation>
  >;
}
