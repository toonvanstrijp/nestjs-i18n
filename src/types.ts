import { MiddlewareConsumer } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

export interface NestMiddlewareConsumer extends MiddlewareConsumer {
  httpAdapter: AbstractHttpAdapter;
}

type PathKeyOf<T> = T extends any[]
  ? Exclude<Extract<keyof T, string>, keyof any[]>
  : Extract<keyof T, string>;

export type Path<T, Depth extends 1[] = []> =
  [T] extends [Record<string, any>]
    ? {
        [K in PathKeyOf<T>]: 0 extends 1 & T[K]
          ? never
          : [T[K]] extends [Record<string, any>]
            ? Depth['length'] extends 8
              ? K
              : K | `${K}.${Path<T[K], [...Depth, 1]>}`
            : K;
      }[PathKeyOf<T>]
    : never;

export type PathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? PathValue<T[Key], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

export type IfAnyOrNever<T, Y, N> = 0 extends 1 & T ? Y : [T] extends [never] ? Y : N;
