import { ArgumentsHost } from '@nestjs/common';
import { GraphQLError } from 'graphql';

import { I18nValidationException, I18nValidationExceptionFilter } from '../src';

// #776: for GraphQL, catch() must return the GraphQLError itself, not a
// Promise of it, so filters that wrap or extend it keep working.
describe('I18nValidationExceptionFilter with GraphQL', () => {
  const graphqlHost = { getType: () => 'graphql' } as unknown as ArgumentsHost;

  const translatedException = () => {
    return new I18nValidationException(
      [
        {
          property: 'age',
          value: 2,
          children: [],
          constraints: { min: 'age must be at least 10' },
        },
      ],
      400,
      true,
    );
  };

  it('returns a GraphQLError synchronously', () => {
    const result = new I18nValidationExceptionFilter().catch(translatedException(), graphqlHost);

    expect(result).not.toBeInstanceOf(Promise);
    expect(result).toBeInstanceOf(GraphQLError);
    const error = result as GraphQLError;
    expect(error.message).toBe('Bad Request');
    expect(error.extensions).toMatchObject({
      code: 'BAD_USER_INPUT',
      status: 400,
      errors: [{ property: 'age', constraints: { min: 'age must be at least 10' } }],
    });
  });

  it('applies the filter options to the GraphQL error', () => {
    const result = new I18nValidationExceptionFilter({
      detailedErrors: false,
      errorHttpStatusCode: 422,
    }).catch(translatedException(), graphqlHost) as GraphQLError;

    expect(result.extensions).toMatchObject({
      status: 422,
      errors: ['age must be at least 10'],
    });
  });

  it('can be extended to reshape the GraphQL error', () => {
    class CustomFilter extends I18nValidationExceptionFilter {
      catch(exception: I18nValidationException, host: ArgumentsHost) {
        const error = super.catch(exception, host) as GraphQLError;
        return new GraphQLError('Invalid input', {
          extensions: { ...error.extensions, custom: true },
        });
      }
    }

    const result = new CustomFilter().catch(translatedException(), graphqlHost) as GraphQLError;

    expect(result.message).toBe('Invalid input');
    expect(result.extensions).toMatchObject({ code: 'BAD_USER_INPUT', custom: true });
  });
});
