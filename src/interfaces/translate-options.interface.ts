export interface TranslateOptions {
  lang?: string;
  args?: ({ [k: string]: any } | string)[] | { [k: string]: any };
  defaultValue?: string;
  debug?: boolean;
  useICU?: boolean;
  keySeparator?: string | false;
  nsSeparator?: string | false;
  returnObjects?: boolean;
  joinArrays?: string;
}
