import { Injectable } from '@nestjs/common';
import { ITodo, StatusType } from './interfaces/todo';

@Injectable()
export class TodoService {
  private todo;

  constructor() {
    this.todo = new TodoListSingleton();
  }

  getTodo() {
    return this.todo;
  }
}

export class TodoListSingleton {
  private todos = [];

  add(todo) {
    const newTodo: ITodo = {
      id: this.todos.length + 1,
      title: todo.title,
      status: StatusType.Active,
    };
    this.todos.push(newTodo);
  }

  delete(id) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
    } else throw new Error('Todo not found');
  }

  getAll(): ITodo[] {
    return this.todos;
  }

  getAllCompleted(): ITodo[] {
    return this.todos.filter((todo) => todo.status == StatusType.Completed);
  }

  getAllUncompleted(): ITodo[] {
    return this.todos.filter((todo) => todo.status == StatusType.Active);
  }

  getOne(id: number): ITodo {
    const result = this.todos.find((todo) => todo.id === id);
    if (result) {
      return result;
    } else {
      throw new Error('Todo not found');
    }
  }

  update(todo: ITodo) {
    const index = this.todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      this.todos[index] = todo;
    } else throw new Error('Todo not found');
  }
}
