import { Path, PathValue } from '../src';

type Assert<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

describe('Path type', () => {
  it('should support keys that collide with array method names', () => {
    type T = {
      messages: {
        push: {
          'message-one': string;
        };
        map: {
          'message-two': string;
        };
        pop: {
          'message-three': string;
        };
      };
    };

    const pushPath: Path<T> = 'messages.push.message-one';
    const mapPath: Path<T> = 'messages.map.message-two';
    const popPath: Path<T> = 'messages.pop.message-three';

    expect(pushPath).toBe('messages.push.message-one');
    expect(mapPath).toBe('messages.map.message-two');
    expect(popPath).toBe('messages.pop.message-three');
  });

  it('should keep tuple index paths while excluding array prototype keys', () => {
    type T = {
      items: [{ value: string }, { value: string }];
    };

    const validTuplePath: Path<T> = 'items.0.value';
    expect(validTuplePath).toBe('items.0.value');

    type _TuplePathIncludesIndex = Assert<
      Equal<'items.0.value' extends Path<T> ? true : false, true>
    >;
    const typeAssertion: _TuplePathIncludesIndex = true;
    expect(typeAssertion).toBe(true);

    // @ts-expect-error array method names should not become valid path segments
    const invalidPath: Path<T> = 'items.push';
    expect(invalidPath as unknown).toBeDefined();
  });

  it('should cap recursive path expansion depth', () => {
    type Deep = {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: {
                  g: {
                    h: {
                      i: {
                        j: string;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };

    const validAtCap: Path<Deep> = 'a.b.c.d.e.f.g.h.i';
    expect(validAtCap).toBe('a.b.c.d.e.f.g.h.i');

    // @ts-expect-error recursion is intentionally capped to avoid runaway type expansion
    const beyondCap: Path<Deep> = 'a.b.c.d.e.f.g.h.i.j';
    expect(beyondCap as unknown).toBeDefined();
  });

  it('should preserve PathValue inference for regular nested paths', () => {
    type Nested = {
      user: {
        profile: {
          name: string;
        };
      };
    };

    type NameValue = PathValue<Nested, 'user.profile.name'>;
    type _PathValueStillString = Assert<Equal<NameValue, string>>;

    const typeAssertion: _PathValueStillString = true;
    expect(typeAssertion).toBe(true);
  });
});
