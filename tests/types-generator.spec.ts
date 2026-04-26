import { join } from 'node:path';
import fs from 'node:fs';

import { generateI18nTypes } from '../src/types-generator';
import { checkI18nTranslations } from '../src/cli/check-translations';

describe('types generator', () => {
  const outputPath = join(__dirname, 'generated', 'types-generator.generated.ts');

  afterAll(() => {
    try {
      fs.unlinkSync(outputPath);
    } catch {
      // ignore
    }
  });

  it('should generate types from json translations without booting the app', async () => {
    const result = await generateI18nTypes({
      path: join(__dirname, 'i18n'),
      output: outputPath,
      format: 'json',
      watch: false,
    });

    expect(result.output).toBe(outputPath);
    expect(result.written).toBe(true);

    const generatedContent = fs.readFileSync(outputPath, 'utf8');
    expect(generatedContent).toContain('export type I18nTranslations =');
    expect(generatedContent).toContain('"test": {');
  });

  it('should not rewrite file when generated content is unchanged', async () => {
    const result = await generateI18nTypes({
      path: join(__dirname, 'i18n'),
      output: outputPath,
      format: 'json',
      watch: false,
    });

    expect(result.written).toBe(false);
  });

  it('should generate types from yaml translations', async () => {
    const yamlOutputPath = join(__dirname, 'generated', 'types-generator-yaml.generated.ts');

    try {
      const result = await generateI18nTypes({
        path: join(__dirname, 'i18n'),
        output: yamlOutputPath,
        format: 'yaml',
        watch: false,
      });

      expect(result.written).toBe(true);
      const generatedContent = fs.readFileSync(yamlOutputPath, 'utf8');
      expect(generatedContent).toContain('export type I18nTranslations =');
      expect(generatedContent).toContain('"test": {');
    } finally {
      try {
        fs.unlinkSync(yamlOutputPath);
      } catch {
        // ignore
      }
    }
  });

  it('should fail check when language keys are missing', async () => {
    const fixtureRoot = join(__dirname, 'generated', 'check-fixture-missing');
    const enDir = join(fixtureRoot, 'en');
    const nlDir = join(fixtureRoot, 'nl');

    try {
      fs.mkdirSync(enDir, { recursive: true });
      fs.mkdirSync(nlDir, { recursive: true });

      fs.writeFileSync(
        join(enDir, 'common.json'),
        JSON.stringify({ hello: 'Hello', nested: { title: 'Title' } }),
      );
      fs.writeFileSync(join(nlDir, 'common.json'), JSON.stringify({ hello: 'Hallo' }));

      const result = await checkI18nTranslations({
        path: fixtureRoot,
        format: 'json',
        watch: false,
      });

      expect(result.ok).toBe(false);
      expect(result.missingByLanguage.nl).toContain('common.nested.title');
    } finally {
      fs.rmSync(fixtureRoot, { recursive: true, force: true });
    }
  });

  it('should pass check when language keys are complete', async () => {
    const fixtureRoot = join(__dirname, 'generated', 'check-fixture-complete');
    const enDir = join(fixtureRoot, 'en');
    const nlDir = join(fixtureRoot, 'nl');

    try {
      fs.mkdirSync(enDir, { recursive: true });
      fs.mkdirSync(nlDir, { recursive: true });

      fs.writeFileSync(
        join(enDir, 'common.json'),
        JSON.stringify({ hello: 'Hello', nested: { title: 'Title' } }),
      );
      fs.writeFileSync(
        join(nlDir, 'common.json'),
        JSON.stringify({ hello: 'Hallo', nested: { title: 'Titel' } }),
      );

      const result = await checkI18nTranslations({
        path: fixtureRoot,
        format: 'json',
        watch: false,
      });

      expect(result.ok).toBe(true);
      expect(result.totalMissing).toBe(0);
    } finally {
      fs.rmSync(fixtureRoot, { recursive: true, force: true });
    }
  });

  it('should detect real missing keys but not global shared keys', async () => {
    const result = await checkI18nTranslations({
      path: join(__dirname, 'i18n'),
      format: 'json',
      watch: false,
    });

    expect(result.ok).toBe(false);
    expect(result.missingByLanguage.nl).toContain('test.ONLY_EN_KEY');
    expect(result.missingByLanguage.nl).not.toContain('APP_NAME');
  });

  it('should treat arrays as leaf keys during checks', async () => {
    const fixtureRoot = join(__dirname, 'generated', 'check-fixture-arrays');
    const enDir = join(fixtureRoot, 'en');
    const nlDir = join(fixtureRoot, 'nl');

    try {
      fs.mkdirSync(enDir, { recursive: true });
      fs.mkdirSync(nlDir, { recursive: true });

      fs.writeFileSync(
        join(enDir, 'common.json'),
        JSON.stringify({ items: ['one', 'two'], nested: { labels: ['a'] } }),
      );
      fs.writeFileSync(join(nlDir, 'common.json'), JSON.stringify({ items: ['een', 'twee'] }));

      const result = await checkI18nTranslations({
        path: fixtureRoot,
        format: 'json',
        watch: false,
      });

      expect(result.ok).toBe(false);
      expect(result.missingByLanguage.nl).toContain('common.nested.labels');
      expect(result.missingByLanguage.nl).not.toContain('common.items.0');
    } finally {
      fs.rmSync(fixtureRoot, { recursive: true, force: true });
    }
  });
});
