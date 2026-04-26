describe('cli main', () => {
  const originalArgv = process.argv;

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    process.argv = originalArgv;
  });

  async function loadCliWithMocks(overrides?: {
    generateResult?: { output: string; written: boolean };
    checkResult?: {
      ok: boolean;
      languages: string[];
      missingByLanguage: Record<string, string[]>;
      totalMissing: number;
    };
  }) {
    const generateI18nTypes = jest.fn().mockResolvedValue(
      overrides?.generateResult ?? {
        output: 'generated.ts',
        written: true,
      },
    );

    const checkI18nTranslations = jest.fn().mockResolvedValue(
      overrides?.checkResult ?? {
        ok: true,
        languages: ['en', 'nl'],
        missingByLanguage: { en: [], nl: [] },
        totalMissing: 0,
      },
    );

    jest.doMock('../src/types-generator', () => ({
      generateI18nTypes,
    }));

    jest.doMock('../src/cli/check-translations', () => ({
      checkI18nTranslations,
    }));

    const cli = await import('../src/cli/nestjs-i18n');

    return {
      cli,
      generateI18nTypes,
      checkI18nTranslations,
    };
  }

  it('runs generate mode and prints success output', async () => {
    const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    process.argv = ['node', 'cli', '-p', 'src/i18n', '-o', 'out.ts'];

    const { cli, generateI18nTypes, checkI18nTranslations } = await loadCliWithMocks();

    await cli.main();

    expect(generateI18nTypes).toHaveBeenCalledWith({
      path: 'src/i18n',
      output: 'out.ts',
      format: 'json',
      filePattern: '*.json',
      includeSubfolders: true,
      watch: false,
    });
    expect(checkI18nTranslations).not.toHaveBeenCalled();
    expect(stdoutSpy).toHaveBeenCalledWith('✅ Types generated in: generated.ts\n');
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it('prints no-change output when generation does not write', async () => {
    const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    process.argv = ['node', 'cli'];

    const { cli } = await loadCliWithMocks({
      generateResult: {
        output: 'generated.ts',
        written: false,
      },
    });

    await cli.main();

    expect(stdoutSpy).toHaveBeenCalledWith('ℹ️ No changes detected in: generated.ts\n');
  });

  it('prints unknown option warnings before generating', async () => {
    const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    process.argv = ['node', 'cli', '--unknown'];

    const { cli } = await loadCliWithMocks();

    await cli.main();

    expect(stderrSpy).toHaveBeenCalledWith('⚠️ Unknown option: --unknown\n');
    expect(stdoutSpy).toHaveBeenCalledWith('✅ Types generated in: generated.ts\n');
  });

  it('runs check mode and prints success summary', async () => {
    const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    process.argv = ['node', 'cli', 'check', '-p', 'src/i18n'];

    const { cli, generateI18nTypes, checkI18nTranslations } = await loadCliWithMocks({
      checkResult: {
        ok: true,
        languages: ['en', 'nl'],
        missingByLanguage: { en: [], nl: [] },
        totalMissing: 0,
      },
    });

    await cli.main();

    expect(checkI18nTranslations).toHaveBeenCalledWith({
      path: 'src/i18n',
      format: 'json',
      filePattern: '*.json',
      includeSubfolders: true,
      watch: false,
    });
    expect(generateI18nTypes).not.toHaveBeenCalled();
    expect(stdoutSpy).toHaveBeenNthCalledWith(1, '🔎 Found languages: en, nl\n');
    expect(stdoutSpy).toHaveBeenNthCalledWith(
      2,
      '✅ All languages contain the same translation keys.\n',
    );
  });

  it('warns that watch is ignored in check mode', async () => {
    const stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    process.argv = ['node', 'cli', 'check', '-p', 'src/i18n', '--watch'];

    const { cli } = await loadCliWithMocks();

    await cli.main();

    expect(stderrSpy).toHaveBeenCalledWith('⚠️ --watch is ignored in check mode.\n');
  });

  it('prints missing keys and exits with code 1 when check fails', async () => {
    const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`exit:${code ?? 0}`);
    }) as never);

    process.argv = ['node', 'cli', 'check', '-p', 'src/i18n'];

    const { cli } = await loadCliWithMocks({
      checkResult: {
        ok: false,
        languages: ['en', 'nl'],
        missingByLanguage: {
          en: [],
          nl: ['test.ONLY_EN_KEY', 'test.nested.title'],
        },
        totalMissing: 2,
      },
    });

    await expect(cli.main()).rejects.toThrow('exit:1');

    expect(stdoutSpy).toHaveBeenCalledWith('✅ en: complete\n');
    expect(stdoutSpy).toHaveBeenCalledWith('❌ nl: 2 missing keys\n');
    expect(stdoutSpy).toHaveBeenCalledWith('   - test.ONLY_EN_KEY\n');
    expect(stdoutSpy).toHaveBeenCalledWith('   - test.nested.title\n');
    expect(stderrSpy).toHaveBeenCalledWith('❌ Check failed with 2 missing entries.\n');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
