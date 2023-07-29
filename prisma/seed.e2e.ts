import { PrismaClient } from '@prisma/client';
import { testUser1, testUser2 } from '../test/fixtures/users';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      username: testUser1.username,
      email: testUser1.email,
      name: testUser1.name,
      password: '$2a$10$n9w/fy0/NB.I1lagvk6gleI7tQcOIz/H92tMFWZqHy.0e0AzRHpBK', // password
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: testUser2.username,
      email: testUser2.email,
      name: testUser2.name,
      password: '$2a$10$n9w/fy0/NB.I1lagvk6gleI7tQcOIz/H92tMFWZqHy.0e0AzRHpBK', // password
    },
  });

  await prisma.project.create({
    data: {
      userId: user1.id,
      name: 'Project 1',
    },
  });

  await prisma.project.create({
    data: {
      userId: user2.id,
      name: 'Project 2',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
