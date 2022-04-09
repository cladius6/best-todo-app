export enum TasksType {
  All = 'ALL',
  Completed = 'COMPLETED',
  Uncompleted = 'UNCOMPLETED',
}

export type ITasksList = ITodo[];
export interface ITodo {
  id: number;
  title: string;
  description?: string;
  status: boolean;
}
