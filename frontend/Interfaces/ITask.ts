export enum TaskType {
  All = 'ALL',
  Completed = 'COMPLETED',
  Uncompleted = 'UNCOMPLETED',
}

export type ITasksList = ITask[];
export interface ITask {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}
