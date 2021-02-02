import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import { Observable } from 'rxjs';

export abstract class I18nParser {
  abstract languages(): Promise<string[] | Observable<string[]>>;
  abstract parse(): Promise<
    I18nTranslation | Observable<I18nTranslation>
  >;
}
