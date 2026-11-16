import { parse, pick } from '../../src/utils/accept-language-parser';

const resolve = (supported: string[], header: string) =>
  pick(supported, header) ?? pick(supported, header, { loose: true });

describe('accept-language-parser', () => {
  it('treats a 4-letter second subtag as a script', () => {
    expect(parse('zh-Hant, sr-Latn-RS, es-419')).toEqual([
      { code: 'zh', script: 'Hant', region: null, quality: 1 },
      { code: 'sr', script: 'Latn', region: 'RS', quality: 1 },
      { code: 'es', script: null, region: '419', quality: 1 },
    ]);
  });

  it('matches script-only supported languages', () => {
    expect(resolve(['zh-Hans', 'zh-Hant'], 'zh-Hant-HK')).toBe('zh-Hant');
    expect(resolve(['sr-Cyrl', 'sr-Latn'], 'sr-Latn-RS')).toBe('sr-Latn');
    expect(resolve(['zh-Hans-CN', 'zh-Hant-TW'], 'zh-Hant-HK, zh-Hant;q=0.9')).toBe('zh-Hant-TW');
  });

  it('keeps the script check in loose mode', () => {
    expect(pick(['sr-Cyrl'], 'sr-Latn', { loose: true })).toBeNull();
    expect(pick(['sr'], 'sr-Latn', { loose: true })).toBe('sr');
  });

  it('ignores languages with q=0', () => {
    expect(parse('de, fr;q=0')).toEqual([{ code: 'de', script: null, region: null, quality: 1 }]);
    expect(resolve(['en', 'fr'], 'fr;q=0')).toBeNull();
    expect(resolve(['en', 'fr'], 'de, fr;q=0')).toBeNull();
  });

  it('still matches region-only tags', () => {
    expect(resolve(['zh-CN', 'zh-TW'], 'zh-TW')).toBe('zh-TW');
    expect(resolve(['en-US', 'en-GB'], 'en-AU')).toBe('en-US');
  });
});
