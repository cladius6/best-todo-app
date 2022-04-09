import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {
  private readonly todo;

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
    todo.id = this.todos.length + 1;
    this.todos.push(todo);
  }

  remove(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  getAll() {
    return this.todos;
  }
}
