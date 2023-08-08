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
            validate.errors
              ?.map((error) => `${error.instancePath}: ${error.message}`)
              .join(',') ?? '';
          return `${errorMessage}\n\n${JSON.stringify(actual, null, 2)}`;
        },
      };
    }
  };

expect.extend({ toMatchSchema });
