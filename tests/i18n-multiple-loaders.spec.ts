import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import { I18nModule, I18nService, I18nJsonLoader } from '../src';

describe('i18n multiple loaders', () => {
  describe('forRoot with multiple loaders', () => {
    let i18nService: I18nService;
    let module: TestingModule;

    beforeAll(async () => {
      module = await Test.createTestingModule({
        imports: [
          I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaders: [
              new I18nJsonLoader({
                path: path.join(__dirname, '/i18n-multi-loaders/loader1'),
                watch: false,
              }),
              new I18nJsonLoader({
                path: path.join(__dirname, '/i18n-multi-loaders/loader2'),
                watch: false,
              }),
            ],
          }),
        ],
      }).compile();

      i18nService = module.get(I18nService);
      await module.init();
    });

    afterAll(async () => {
      await module.close();
    });

    it('should merge translations from multiple loaders', () => {
      // From loader1
      expect(i18nService.translate('core.greeting', { lang: 'en' })).toBe(
        'Hello',
      );
      expect(i18nService.translate('core.greeting', { lang: 'nl' })).toBe(
        'Hallo',
      );

      // From loader2
      expect(i18nService.translate('features.feature.name', { lang: 'en' })).toBe(
        'Feature',
      );
      expect(i18nService.translate('features.feature.name', { lang: 'nl' })).toBe(
        'Functie',
      );

      // From loader2 French (only in loader2)
      expect(i18nService.translate('features.feature.name', { lang: 'fr' })).toBe(
        'Caractéristique',
      );
    });

    it('should merge nested translations correctly', () => {
      // Loader1 has core.common
      expect(i18nService.translate('core.common.yes', { lang: 'en' })).toBe(
        'Yes',
      );
      expect(i18nService.translate('core.common.no', { lang: 'en' })).toBe('No');

      // Loader2 also has common.cancel, should merge
      expect(i18nService.translate('features.common.cancel', { lang: 'en' })).toBe(
        'Cancel',
      );
    });

    it('should combine languages from multiple loaders', async () => {
      const languages = i18nService.getSupportedLanguages();

      // Should have en, nl from loader1 and en, nl, fr from loader2
      expect(languages).toContain('en');
      expect(languages).toContain('nl');
      expect(languages).toContain('fr');
    });

    it('should fallback to fallbackLanguage if lang not found', () => {
      expect(
        i18nService.translate('core.greeting', { lang: 'de' })
      ).toBe('Hello');
    });
  });

  describe('forRootAsync with multiple loaders', () => {
    let i18nService: I18nService;
    let module: TestingModule;

    beforeAll(async () => {
      module = await Test.createTestingModule({
        imports: [
          I18nModule.forRootAsync({
            useFactory: () => ({
              fallbackLanguage: 'en',
              loaders: [
                new I18nJsonLoader({
                  path: path.join(__dirname, '/i18n-multi-loaders/loader1'),
                  watch: false,
                }),
                new I18nJsonLoader({
                  path: path.join(__dirname, '/i18n-multi-loaders/loader2'),
                  watch: false,
                }),
              ],
            }),
          }),
        ],
      }).compile();

      i18nService = module.get(I18nService);
      await module.init();
    });

    afterAll(async () => {
      await module.close();
    });

    it('should merge translations from multiple loaders in async mode', () => {
      expect(i18nService.translate('core.greeting', { lang: 'en' })).toBe(
        'Hello',
      );
      expect(i18nService.translate('features.feature.name', { lang: 'en' })).toBe(
        'Feature',
      );
    });

    it('should merge languages in async mode', async () => {
      const languages = i18nService.getSupportedLanguages();

      expect(languages).toContain('en');
      expect(languages).toContain('nl');
      expect(languages).toContain('fr');
    });
  });

  describe('backward compatibility with legacy API', () => {
    let i18nService: I18nService;
    let module: TestingModule;

    beforeAll(async () => {
      module = await Test.createTestingModule({
        imports: [
          I18nModule.forRoot({
            fallbackLanguage: 'en',
            loader: I18nJsonLoader,
            loaderOptions: {
              path: path.join(__dirname, '/i18n-multi-loaders/loader1'),
            },
          }),
        ],
      }).compile();

      i18nService = module.get(I18nService);
      await module.init();
    });

    afterAll(async () => {
      await module.close();
    });

    it('should still work with legacy loader + loaderOptions API', () => {
      expect(i18nService.translate('core.greeting', { lang: 'en' })).toBe(
        'Hello',
      );
      expect(i18nService.translate('core.greeting', { lang: 'nl' })).toBe(
        'Hallo',
      );
    });
  });

  describe('loaders-utils merge behavior', () => {
    let i18nService: I18nService;
    let module: TestingModule;

    beforeAll(async () => {
      module = await Test.createTestingModule({
        imports: [
          I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaders: [
              new I18nJsonLoader({
                path: path.join(__dirname, '/i18n-multi-loaders/loader1'),
                watch: false,
              }),
              new I18nJsonLoader({
                path: path.join(__dirname, '/i18n-multi-loaders/loader2'),
                watch: false,
              }),
            ],
          }),
        ],
      }).compile();

      i18nService = module.get(I18nService);
      await module.init();
    });

    afterAll(async () => {
      await module.close();
    });

    it('should deeply merge nested objects from multiple loaders', () => {
      // Both loaders have "common" object with different keys
      // Loader1: common.yes, common.no
      // Loader2: common.cancel
      expect(i18nService.translate('core.common.yes', { lang: 'en' })).toBe(
        'Yes',
      );
      expect(i18nService.translate('core.common.no', { lang: 'en' })).toBe('No');
      expect(
        i18nService.translate('features.common.cancel', { lang: 'en' })
      ).toBe('Cancel');
    });

    it('should support refresh with multiple loaders', async () => {
      const originalGreeting = i18nService.translate('core.greeting', {
        lang: 'en',
      });
      expect(originalGreeting).toBe('Hello');

      // Refresh should work without errors
      await i18nService.refresh();

      // Should still have the same translation
      expect(i18nService.translate('core.greeting', { lang: 'en' })).toBe(
        'Hello',
      );
    });
  });
});
