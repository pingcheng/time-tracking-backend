import { JSONSchemaType } from 'ajv';

export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchSchema(schema: JSONSchemaType<unknown>): R;
    }
  }
}
