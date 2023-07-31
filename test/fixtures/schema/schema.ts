import { JSONSchemaType } from 'ajv';

interface Profile {
  id: number;
  email: string;
  username: string;
  name: string;
}

export const profileSchema: JSONSchemaType<Profile> = {
  type: 'object',
  required: ['id', 'email', 'username', 'name'],
  properties: {
    id: { type: 'integer' },
    email: { type: 'string' },
    username: { type: 'string' },
    name: { type: 'string' },
  },
  additionalProperties: false,
};
