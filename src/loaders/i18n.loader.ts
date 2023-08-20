import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import { Observable } from 'rxjs';

export abstract class I18nLoader<T> {
  constructor(protected options: T) {}

  abstract languages(): Promise<string[] | Observable<string[]>>;

  abstract load(): Promise<I18nTranslation | Observable<I18nTranslation>>;
}
