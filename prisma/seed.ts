import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
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
