import { join } from 'node:path';
import * as fs from 'node:fs';

const I18N_PATH = join(__dirname, 'i18n');
const GENERATED_PATH = join(__dirname, 'generated', 'cli.generated.ts');

async function runCli(argv: string[]): Promise<{ output: string; exitCode: number }> {
  jest.resetModules();

  const originalArgv = process.argv;

  let output = '';
  let exitCode = 0;
  let exitResolved = false;

  process.argv = ['node', 'nestjs-i18n', ...argv];

  let resolveExit!: () => void;
  const exitPromise = new Promise<void>((resolve) => {
    resolveExit = resolve;
  });

  const mockExit = jest
    .spyOn(process, 'exit')
    .mockImplementation((code?: string | number | null | undefined) => {
      if (!exitResolved) {
        exitResolved = true;
        exitCode = Number(code ?? 0);
        resolveExit();
      }
      return undefined as never;
    });

  const mockWrite = jest
    .spyOn(process.stdout, 'write')
    .mockImplementation((chunk: any) => {
      output += typeof chunk === 'string' ? chunk : String(chunk);
      return true;
    });

  try {
    require('../src/cli/nestjs-i18n');
    // Wait for process.exit (check command) or a timeout (types command doesn't call exit)
    await Promise.race([exitPromise, new Promise((r) => setTimeout(r, 3000))]);
  } finally {
    process.argv = originalArgv;
    mockExit.mockRestore();
    mockWrite.mockRestore();
  }

  return { output, exitCode };
}

describe('CLI', () => {
  afterAll(() => {
    try {
      fs.unlinkSync(GENERATED_PATH);
    } catch (_) {
      // ignore
    }
  });

  describe('types command', () => {
    it('should generate types from json translations', async () => {
      const { output, exitCode } = await runCli([
        'types',
        '--path', I18N_PATH,
        '--out', GENERATED_PATH,
        '--format', 'json',
      ]);

      expect(exitCode).toBe(0);
      expect(output).toContain(GENERATED_PATH);
      expect(fs.existsSync(GENERATED_PATH)).toBe(true);

      const content = fs.readFileSync(GENERATED_PATH, 'utf8');
      expect(content).toContain('export type I18nTranslations =');
    });

    it('should report no changes when content is unchanged', async () => {
      const { output, exitCode } = await runCli([
        'types',
        '--path', I18N_PATH,
        '--out', GENERATED_PATH,
        '--format', 'json',
      ]);

      expect(exitCode).toBe(0);
      expect(output).toContain('No changes detected');
    });

    it('should generate types from yaml translations', async () => {
      const yamlOut = join(__dirname, 'generated', 'cli-yaml.generated.ts');
      try {
        const { exitCode } = await runCli([
          'types',
          '--path', I18N_PATH,
          '--out', yamlOut,
          '--format', 'yaml',
        ]);

        expect(exitCode).toBe(0);
        expect(fs.existsSync(yamlOut)).toBe(true);

        const content = fs.readFileSync(yamlOut, 'utf8');
        expect(content).toContain('export type I18nTranslations =');
      } finally {
        try { fs.unlinkSync(yamlOut); } catch (_) {}
      }
    });

    it('should use alias "t" for types command', async () => {
      const aliasOut = join(__dirname, 'generated', 'cli-alias.generated.ts');
      try {
        const { exitCode } = await runCli([
          't',
          '--path', I18N_PATH,
          '--out', aliasOut,
        ]);

        expect(exitCode).toBe(0);
        expect(fs.existsSync(aliasOut)).toBe(true);
      } finally {
        try { fs.unlinkSync(aliasOut); } catch (_) {}
      }
    });
  });

  describe('check command', () => {
    it('should exit with code 1 when translations are inconsistent', async () => {
      // en has keys that de does not — de is missing keys
      const { output, exitCode } = await runCli([
        'check',
        '--path', I18N_PATH,
        '--format', 'json',
      ]);

      expect(exitCode).toBe(1);
      expect(output).toContain('inconsistencies');
    });

    it('should show missing keys in output when inconsistent', async () => {
      const { output } = await runCli([
        'check',
        '--path', I18N_PATH,
        '--format', 'json',
      ]);

      expect(output).toMatch(/Missing keys/i);
    });

    it('should use alias "c" for check command', async () => {
      const { exitCode } = await runCli([
        'c',
        '--path', I18N_PATH,
        '--format', 'json',
      ]);

      // inconsistent translations → exit 1
      expect(exitCode).toBe(1);
    });

    it('should exit with code 1 when no translation files are found', async () => {
      const emptyDir = join(__dirname, 'generated', 'empty-i18n');
      fs.mkdirSync(emptyDir, { recursive: true });

      try {
        const { output, exitCode } = await runCli([
          'check',
          '--path', emptyDir,
          '--format', 'json',
        ]);

        expect(exitCode).toBe(1);
        expect(output).toContain('No translation files found');
      } finally {
        fs.rmSync(emptyDir, { recursive: true, force: true });
      }
    });

    it('should report consistent when all languages match base', async () => {
      // Create a temporary directory with two fully-matching languages
      const tmpDir = join(__dirname, 'generated', 'consistent-i18n');
      const enDir = join(tmpDir, 'en');
      const frDir = join(tmpDir, 'fr');
      fs.mkdirSync(enDir, { recursive: true });
      fs.mkdirSync(frDir, { recursive: true });

      const translations = { HELLO: 'Hello', NESTED: { KEY: 'value' } };
      fs.writeFileSync(join(enDir, 'test.json'), JSON.stringify(translations));
      fs.writeFileSync(join(frDir, 'test.json'), JSON.stringify({ HELLO: 'Bonjour', NESTED: { KEY: 'valeur' } }));

      try {
        const { output, exitCode } = await runCli([
          'check',
          '--path', tmpDir,
          '--format', 'json',
        ]);

        expect(exitCode).toBe(0);
        expect(output).toContain('consistent');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('should report extra keys when a language has more keys than base', async () => {
      const tmpDir = join(__dirname, 'generated', 'extra-keys-i18n');
      const enDir = join(tmpDir, 'en');
      const frDir = join(tmpDir, 'fr');
      fs.mkdirSync(enDir, { recursive: true });
      fs.mkdirSync(frDir, { recursive: true });

      fs.writeFileSync(join(enDir, 'test.json'), JSON.stringify({ HELLO: 'Hello' }));
      fs.writeFileSync(join(frDir, 'test.json'), JSON.stringify({ HELLO: 'Bonjour', EXTRA: 'Extra' }));

      try {
        const { output, exitCode } = await runCli([
          'check',
          '--path', tmpDir,
          '--format', 'json',
        ]);

        expect(exitCode).toBe(1);
        expect(output).toMatch(/Extra keys/i);
        expect(output).toContain('EXTRA');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });
  });
});
