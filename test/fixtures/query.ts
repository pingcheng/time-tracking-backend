import { PrismaClient, User } from '@prisma/client';

const prismaClient = new PrismaClient();

export async function getUserByUsername(username: string): Promise<User> {
  const user = await prismaClient.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) throw new Error(`Cannot find user with username - ${username}`);

  return user;
}

export async function listProjectsByUserId(id: number) {
  return prismaClient.project.findMany({
    where: {
      userId: id,
    },
  });
}
