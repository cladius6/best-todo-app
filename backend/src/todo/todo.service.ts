import { Injectable } from '@nestjs/common';
import { ITodo } from './interfaces/todo';

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
    const newTodo = {
      id: this.todos.length + 1,
      title: todo.title,
      status: 0,
    };
    this.todos.push(newTodo);
  }

  remove(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  getAll(): ITodo[] {
    return this.todos;
  }
}
