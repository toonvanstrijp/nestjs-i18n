import { I18nTranslation } from '../interfaces';
import { Observable } from 'rxjs';

export abstract class I18nLoader {
  abstract languages(): Promise<string[] | Observable<string[]>>;
  abstract load(): Promise<I18nTranslation | Observable<I18nTranslation>>;
}
