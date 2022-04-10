import {HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entity/todo.entity';
import { ITodo, StatusType } from './interfaces/todo';

@Injectable()
export class TodoService {
  private todo;

  constructor(@InjectRepository(TodoEntity) private todosRepository: Repository<TodoEntity>) {
    this.todo = new TodoListSingleton();
  }

  getTodo() {
    return this.todo;
  }

  findAll(): Promise<TodoEntity[]> {
    return this.todosRepository.find();
  }

  findOne(id: number): Promise<TodoEntity> {
    return this.todosRepository.findOne(id);
  }

  async create(newTodo: AddTodoDto): Promise<void> {
    const todo = new TodoEntity();
    todo.title = newTodo.title;
    await this.todosRepository.save(todo);
  }

  async update(todo: UpdateTodoDto): Promise<void> {
      await this.todosRepository.update(todo.id, todo);
  }

  async delete(id: number): Promise<void> {
    await this.todosRepository.delete(id);
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
    const index = this.todos.findIndex((todo) => todo.id === id);
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
