import { JSONSchemaType } from 'ajv';

interface HasOwner {
  owner: Profile;
}

interface HasProject {
  project: Project | null;
}

interface Profile {
  id: number;
  email: string;
  username: string;
  name: string;
}

interface Project {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
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

export const projectSchema: JSONSchemaType<Project & HasOwner> = {
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

export const taskSchema: JSONSchemaType<Task & HasOwner & HasProject> = {
  type: 'object',
  required: [
    'id',
    'name',
    'description',
    'createdAt',
    'updatedAt',
    'owner',
    'project',
  ],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    description: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    owner: profileSchema,
    project: {
      type: 'object',
      nullable: true,
      required: ['id', 'name', 'createdAt', 'updatedAt'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};
