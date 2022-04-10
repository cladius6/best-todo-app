export interface ITodo {
  id: number;
  title: string;
  status: StatusType;
}

export interface IAddTodo {
  title: string;
}

export enum StatusType {
  Active = 'Active',
  Completed = 'Completed',
}
