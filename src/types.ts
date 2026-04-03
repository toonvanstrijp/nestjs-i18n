import { MiddlewareConsumer } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

/**
 * This interface can be augmented by users to add types to `nestjs-i18n` default I18nTypeOptions.
 *
 * Usage:
 * ```ts
 * // nestjs-i18n.d.ts
 * import 'nestjs-i18n';
 * declare module 'nestjs-i18n' {
 *   interface I18nCustomTypeOptions {
 *     resources: {
 *       custom: {
 *         foo: 'foo';
 *       };
 *     };
 *   }
 * }
 * ```
 */
export interface I18nCustomTypeOptions {}

type $MergeBy<T, K> = Omit<T, keyof K> & K;

export type I18nTypeOptions = $MergeBy<
  {
    resources: Record<string, unknown>;
  },
  I18nCustomTypeOptions
>;

export interface NestMiddlewareConsumer extends MiddlewareConsumer {
  httpAdapter: AbstractHttpAdapter;
}

type IsAny<T> = unknown extends T
  ? [keyof T] extends [never]
    ? false
    : true
  : false;

type IsArray<T> = T extends any[] ? true : false;

type ExcludeArrayKeys<T> =
  IsArray<T> extends true ? Exclude<keyof T, keyof any[]> : keyof T;

type PathImpl<T, Key extends keyof T> = Key extends string
  ? IsAny<T[Key]> extends true
    ? never
    : T[Key] extends Record<string, any>
      ?
          | `${Key}.${PathImpl<T[Key], ExcludeArrayKeys<T[Key]>> & string}`
          | `${Key}.${ExcludeArrayKeys<T[Key]> & string}`
      : never
  : never;

type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

export type Path<T> = keyof T extends string
  ? PathImpl2<T> extends infer P
    ? P extends string | keyof T
      ? P
      : keyof T
    : keyof T
  : never;

export type PathValue<
  T,
  P extends Path<T>,
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Path<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

export type IfAnyOrNever<T, Y, N> = 0 extends 1 & T
  ? Y
  : [T] extends [never]
    ? Y
    : N;
