import {
  getDefaultPattern,
  parseArgs,
  printHelp,
  renderHelp,
  renderLogoWithVersion,
} from '../src/cli/nestjs-i18n';

describe('cli', () => {
  it('should parse generate defaults', () => {
    const result = parseArgs([]);

    expect(result.warnings).toEqual([]);
    expect(result.options).toMatchObject({
      mode: 'generate',
      path: 'i18n',
      out: 'generated.ts',
      format: 'json',
      includeSubfolders: true,
      watch: false,
    });
  });

  it('should parse check mode with flags', () => {
    const result = parseArgs([
      'check',
      '-p',
      'src/i18n',
      '--format',
      'yaml',
      '--pattern',
      '*.{yaml,yml}',
      '--no-include-subfolders',
    ]);

    expect(result.warnings).toEqual([]);
    expect(result.options).toMatchObject({
      mode: 'check',
      path: 'src/i18n',
      format: 'yaml',
      pattern: '*.{yaml,yml}',
      includeSubfolders: false,
      watch: false,
    });
  });

  it('should parse alias flags and explicit generate mode', () => {
    const result = parseArgs(['generate', '--check', '-p', 'translations', '-w']);

    expect(result.warnings).toEqual([]);
    expect(result.options).toMatchObject({
      mode: 'check',
      path: 'translations',
      watch: true,
    });
  });

  it('should allow later flags to override earlier ones', () => {
    const result = parseArgs([
      '-p',
      'first',
      '--path',
      'second',
      '--include-subfolders',
      '--no-include-subfolders',
    ]);

    expect(result.options.path).toBe('second');
    expect(result.options.includeSubfolders).toBe(false);
  });

  it('should collect unknown option warnings', () => {
    const result = parseArgs(['--unknown']);

    expect(result.warnings).toEqual(['Unknown option: --unknown']);
  });

  it('should reject positional arguments', () => {
    expect(() => parseArgs(['check', 'src/i18n'])).toThrow(
      'Unexpected positional argument "src/i18n". Use flags (for example: -p <dir>).',
    );
  });

  it('should reject missing option values', () => {
    expect(() => parseArgs(['-p'])).toThrow('Missing value for -p. Use --help to see valid usage.');
  });

  it('should reject flags whose value is another flag', () => {
    expect(() => parseArgs(['--path', '--watch'])).toThrow(
      'Missing value for --path. Use --help to see valid usage.',
    );
  });

  it('should reject unsupported formats', () => {
    expect(() => parseArgs(['--format', 'toml'])).toThrow(
      'Unsupported format "toml". Use json or yaml.',
    );
  });

  it('should resolve default patterns by format', () => {
    expect(getDefaultPattern('json')).toBe('*.json');
    expect(getDefaultPattern('yaml')).toBe('*.{yaml,yml}');
  });

  it('should render help with logo, version, defaults, and check usage', () => {
    const help = renderHelp();

    expect(help).toContain('Generate TypeScript translation key types for nestjs-i18n.');
    expect(help).toContain('nestjs-i18n check -p <dir> [options]');
    expect(help).toContain(
      '--include-subfolders        Scan nested language folders (default: true)',
    );
    expect(help).toContain(
      '--watch                     Watch translation files and regenerate on changes (default: false)',
    );
    expect(help).toContain('check mode exits with code 1 when missing keys are found');
    expect(help).toMatch(/v\d+\.\d+\.\d+/);
  });

  it('should append version to the right side of the first logo line', () => {
    const rendered = renderLogoWithVersion('AA\nBB', 'v1.2.3');
    const lines = rendered.split('\n');

    expect(lines[0]).toBe('AA  v1.2.3');
    expect(lines[1]).toBe('BB');
  });

  it('should print help and exit when help flag is used', () => {
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`exit:${code ?? 0}`);
    }) as never);

    expect(() => parseArgs(['--help'])).toThrow('exit:0');
    expect(writeSpy).toHaveBeenCalled();

    writeSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('should write rendered help output', () => {
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

    printHelp();

    expect(writeSpy).toHaveBeenCalledWith(renderHelp());
    writeSpy.mockRestore();
  });
});
