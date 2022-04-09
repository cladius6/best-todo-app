import { ITasksList } from './ITodo';

export interface IApi {
  getTasksList(): Promise<IGetTasksListResponse>;
}

export interface IGetTasksListResponse {
  tasksList: ITasksList;
}
