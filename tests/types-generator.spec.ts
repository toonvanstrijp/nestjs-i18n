import { join } from 'node:path';
import fs from 'node:fs';

import { generateI18nTypes } from '../src/types-generator';

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

    expect(result.outputPath).toBe(outputPath);
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
});
