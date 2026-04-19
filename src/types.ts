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

type IsAny<T> = unknown extends T ? ([keyof T] extends [never] ? false : true) : false;

type StringKeyOf<T> = Extract<keyof T, string>;

type PathKeyOf<T> = T extends any[] ? Exclude<StringKeyOf<T>, keyof any[]> : StringKeyOf<T>;

type PathInternal<T> =
  T extends Record<string, any>
    ? {
        [K in PathKeyOf<T>]: IsAny<T[K]> extends true
          ? never
          : T[K] extends Record<string, any>
            ? K | `${K}.${PathInternal<T[K]>}`
            : K;
      }[PathKeyOf<T>]
    : never;

export type Path<T> = PathInternal<T>;

export type PathValue<T, P extends Path<T>> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Path<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

export type IfAnyOrNever<T, Y, N> = 0 extends 1 & T ? Y : [T] extends [never] ? Y : N;
