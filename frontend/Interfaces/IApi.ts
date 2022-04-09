import { ITasksList } from './ITask';

export interface IApi {
  getTasksList(): Promise<IGetTasksListResponse>;
}

export interface IGetTasksListResponse {
  tasksList: ITasksList;
}
