import type { MatcherFunction } from 'expect';
import Ajv, { JSONSchemaType } from 'ajv';

export const toMatchSchema: MatcherFunction<[schema: JSONSchemaType<unknown>]> =
  function (actual, schema) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    if (validate(actual)) {
      return {
        pass: true,
        message(): string {
          return '';
        },
      };
    } else {
      return {
        pass: false,
        message(): string {
          const errorMessage =
            validate.errors?.map((error) => error.message).join(',') ?? '';
          return `${errorMessage} for data - ${JSON.stringify(actual)}`;
        },
      };
    }
  };

expect.extend({ toMatchSchema });
