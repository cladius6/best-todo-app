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

  delete(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
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
    return this.todos.find((todo) => todo.id === id);
  }

  update(todo: ITodo) {
    const index = this.todos.findIndex((t) => t.id === todo.id);
    this.todos[index] = todo;
  }
}
