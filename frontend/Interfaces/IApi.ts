import { ITasksList } from './ITask';

export interface IGetTasksListResponse {
  tasksList: ITasksList;
}

export interface IApi {
  getTasksList(): Promise<IGetTasksListResponse>;
}
