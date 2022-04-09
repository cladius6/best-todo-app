export interface ITodo {
  id: number;
  title: string;
  status: StatusType;
}

export enum StatusType {
  Active = 'Active',
  Completed = 'Completed',
}
