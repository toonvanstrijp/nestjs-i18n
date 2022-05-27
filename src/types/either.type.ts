import { Only } from './only.type';

export type Either<T, U> = Only<T, U> | Only<U, T>;
