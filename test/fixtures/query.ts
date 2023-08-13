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

export async function getProjectById(id: number) {
  const project = await prismaClient.project.findUnique({
    where: {
      id,
    },
  });

  if (!project) throw new Error(`Cannot find project with id - ${id}`);

  return project;
}

export async function listProjectsByUserId(id: number) {
  return prismaClient.project.findMany({
    where: {
      userId: id,
    },
  });
}

export async function listTasksByUserId(id: number) {
  return prismaClient.task.findMany({
    where: {
      userId: id,
    },
  });
}

export async function getTaskById(id: number) {
  return prismaClient.task.findUnique({
    where: {
      id,
    },
  });
}
