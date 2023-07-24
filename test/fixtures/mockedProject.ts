import { Project } from '@prisma/client';
import { mockedUser } from './mockedUsers';

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
