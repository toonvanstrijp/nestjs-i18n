import { HeaderResolver } from '../src';

const createHttpContext = (headers: Record<string, string>) =>
  ({
    getType: () => 'http',
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  }) as any;

describe('HeaderResolver', () => {
  it('resolves the language from a header configured with mixed case', async () => {
    // Node.js lowercases the names of incoming request headers.
    const resolver = new HeaderResolver(['X-Custom-Lang']);

    expect(await resolver.resolve(createHttpContext({ 'x-custom-lang': 'nl' }))).toBe('nl');
  });

  it('still resolves the language from a header with the configured case', async () => {
    const resolver = new HeaderResolver(['X-Custom-Lang']);

    expect(await resolver.resolve(createHttpContext({ 'X-Custom-Lang': 'nl' }))).toBe('nl');
  });

  it('uses the first configured header that is present', async () => {
    const resolver = new HeaderResolver(['X-Lang', 'X-Custom-Lang']);

    expect(await resolver.resolve(createHttpContext({ 'x-custom-lang': 'fr' }))).toBe('fr');
  });

  it('returns undefined when none of the configured headers are present', async () => {
    const resolver = new HeaderResolver(['X-Custom-Lang']);

    expect(await resolver.resolve(createHttpContext({}))).toBeUndefined();
  });
});
