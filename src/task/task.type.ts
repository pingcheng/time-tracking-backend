export type CreateTaskDto = {
  name: string;
  description: string;
  userId: number;
  projectId?: number;
};
