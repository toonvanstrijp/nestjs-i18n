import { MiddlewareConsumer } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

export interface NestMiddlewareConsumer extends MiddlewareConsumer {
  httpAdapter: AbstractHttpAdapter;
}

type IsAny<T> = unknown extends T
  ? [keyof T] extends [never]
    ? false
    : true
  : false;

type StringKeyOf<T> = Extract<keyof T, string>;

type PathKeyOf<T> = T extends any[]
  ? Exclude<StringKeyOf<T>, keyof any[]>
  : StringKeyOf<T>;

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
