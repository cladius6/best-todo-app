import { IsNotEmpty, IsString } from 'class-validator';
import { IAddTodo } from '../interfaces/todo';

export class AddTodoDto implements IAddTodo {
  @IsString()
  @IsNotEmpty()
  title: string;
}
