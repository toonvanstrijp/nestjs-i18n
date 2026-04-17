import { I18nModule, logger } from '../src/i18n.module';

describe('i18n module', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs an info-level message when no resolvers are provided', () => {
    const logSpy = jest.spyOn(logger, 'log').mockImplementation();
    const errorSpy = jest.spyOn(logger, 'error').mockImplementation();

    (I18nModule as any).createResolverProviders();

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('No resolvers provided.'),
    );
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
