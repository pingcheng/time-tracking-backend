import { User } from '@prisma/client';

export const mockedUser: User = {
  id: 1,
  username: 'mocked-user',
  email: 'mocked-user@sample.com',
  name: 'Mocked User',
  password: '$2a$10$n9w/fy0/NB.I1lagvk6gleI7tQcOIz/H92tMFWZqHy.0e0AzRHpBK', // password
  createdAt: new Date(),
  updatedAt: new Date(),
};
