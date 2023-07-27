import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      username: 'user1',
      email: 'user1@sample.com',
      name: 'User 1',
      password: '$2a$10$n9w/fy0/NB.I1lagvk6gleI7tQcOIz/H92tMFWZqHy.0e0AzRHpBK', // password
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user2',
      email: 'user2@sample.com',
      name: 'User 2',
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
