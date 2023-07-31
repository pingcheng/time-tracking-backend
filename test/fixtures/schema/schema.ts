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

interface Project {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  owner: Profile;
}

export const projectSchema: JSONSchemaType<Project> = {
  type: 'object',
  required: ['id', 'name', 'createdAt', 'updatedAt', 'owner'],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    owner: profileSchema,
  },
  additionalProperties: false,
};
