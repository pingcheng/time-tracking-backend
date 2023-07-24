import { OverrideByFactoryOptions } from '@nestjs/testing';

export const mockedPrismaServiceFactory: OverrideByFactoryOptions = {
  factory: async () => ({
    user: {
      findUnique: jest.fn(),
    },
    project: jest.fn(),
  }),
};
