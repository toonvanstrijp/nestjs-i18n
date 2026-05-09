import { formatI18nErrors } from '../../src/utils';

describe('util helpers', () => {
  describe('formatI18nErrors', () => {
    it('keeps JSON args intact when constraint payload contains pipe characters', () => {
      const translate = jest.fn(() => 'translated');

      const errors = [
        {
          property: 'email',
          value: 'test|value@example.com',
          target: {},
          children: [],
          constraints: {
            isEmail:
              'validation.INVALID|{"value":"test|value@example.com","constraints":[]}',
          },
        },
      ];

      const formatted = formatI18nErrors(errors as any, { translate } as any);

      expect(translate).toHaveBeenCalledWith('validation.INVALID', {
        args: expect.objectContaining({
          value: 'test|value@example.com',
          constraints: {},
        }),
      });
      expect(formatted[0].constraints?.isEmail).toBe('translated');
    });
  });
});
