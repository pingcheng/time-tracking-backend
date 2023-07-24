import { OverrideByFactoryOptions } from '@nestjs/testing';
import { mockedUser } from './mockedUsers';
import { mockedProjectWithOwner } from './mockedProject';

export const mockedPrismaServiceFactory: OverrideByFactoryOptions = {
  factory: async () => ({
    user: {
      findUnique: jest.fn().mockResolvedValue(mockedUser),
    },
    project: {
      findUnique: jest.fn().mockResolvedValue(mockedProjectWithOwner),
    },
  }),
};
