import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@sample.com',
    },
    update: {},
    create: {
      email: 'admin@sample.com',
      username: 'admin',
      name: 'Admin',
      password: '$2a$10$n9w/fy0/NB.I1lagvk6gleI7tQcOIz/H92tMFWZqHy.0e0AzRHpBK', // password
    },
  });

  // project
  const projectName = 'Get started';
  const adminProject = await prisma.project.create({
    data: {
      userId: admin.id,
      name: projectName,
    },
  });

  // task
  await prisma.task.createMany({
    data: [
      {
        userId: admin.id,
        projectId: undefined,
        name: 'Task 1',
        description: 'Task with no project',
      },
      {
        userId: admin.id,
        projectId: adminProject.id,
        name: 'Task 2',
        description: 'Task with project',
      },
    ],
  });

  const user = await prisma.user.upsert({
    where: {
      email: 'user@sample.com',
    },
    update: {},
    create: {
      email: 'user@sample.com',
      username: 'user',
      name: 'User',
      password: '$2a$10$n9w/fy0/NB.I1lagvk6gleI7tQcOIz/H92tMFWZqHy.0e0AzRHpBK', // password
    },
  });

  await prisma.project.create({
    data: {
      userId: user.id,
      name: "User's project",
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
