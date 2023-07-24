import { Project } from '@prisma/client';
import { mockedAnotherUser, mockedUser } from './mockedUsers';

export const mockedProject: Project = {
  id: 1,
  userId: 1,
  name: 'Testing Project',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockedProjectWithOwner = {
  ...mockedProject,
  owner: mockedUser,
};

export const mockedAnotherProject: Project = {
  id: 2,
  userId: 2,
  name: 'Another Testing Project',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockedAnotherProjectWithOwner = {
  ...mockedAnotherProject,
  owner: mockedAnotherUser,
};
