export interface ParsedLanguage {
  code: string;
  script: string | null;
  region: string | null;
  quality: number;
}

function isString(s: any): s is string {
  return typeof s === 'string';
}

function splitTag(tag: string): { code: string; script: string | null; region: string | null } {
  const bits = tag.split('-');
  const hasScript = /^[A-Za-z]{4}$/.test(bits[1] ?? '');
  return {
    code: bits[0],
    script: hasScript ? bits[1] : null,
    region: (hasScript ? bits[2] : bits[1]) || null
  };
}

export function parse(al: string): ParsedLanguage[] {
  if (!al) return [];
  // Fast split, avoid regex if possible
  const parts = al.split(',');
  const result: ParsedLanguage[] = [];
  for (let i = 0; i < parts.length; i++) {
    const m = parts[i].trim();
    if (!m) continue;
    const bits = m.split(';');
    const quality = bits[1] ? parseFloat(bits[1].split('=')[1]) : 1.0;
    if (!(quality > 0)) continue;
    result.push({ ...splitTag(bits[0]), quality });
  }
  return result.sort((a, b) => b.quality - a.quality);
}

export function pick(
  supportedLanguages: string[],
  acceptLanguage: string | ParsedLanguage[],
  options: { loose?: boolean } = {}
): string | null {
  if (!supportedLanguages || !supportedLanguages.length || !acceptLanguage) {
    return null;
  }
  let parsedAcceptLanguage: ParsedLanguage[];
  if (isString(acceptLanguage)) {
    parsedAcceptLanguage = parse(acceptLanguage);
  } else {
    parsedAcceptLanguage = acceptLanguage;
  }
  const supported = supportedLanguages.map(splitTag);
  for (let i = 0; i < parsedAcceptLanguage.length; i++) {
    const lang = parsedAcceptLanguage[i];
    const langCode = lang.code.toLowerCase();
    const langRegion = lang.region ? lang.region.toLowerCase() : null;
    const langScript = lang.script ? lang.script.toLowerCase() : null;
    for (let j = 0; j < supported.length; j++) {
      const supportedCode = supported[j].code.toLowerCase();
      const supportedScript = supported[j].script?.toLowerCase() ?? null;
      const supportedRegion = supported[j].region?.toLowerCase() ?? null;
      if (
        langCode === supportedCode &&
        (!langScript || (options.loose && !supportedScript) || langScript === supportedScript) &&
        (options.loose || !langRegion || langRegion === supportedRegion)
      ) {
        return supportedLanguages[j];
      }
    }
  }
  return null;
}
