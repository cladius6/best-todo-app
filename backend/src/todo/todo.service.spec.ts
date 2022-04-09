import { Test, TestingModule } from '@nestjs/testing';
import { TodoListSingleton, TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let todo: TodoListSingleton;

  beforeEach(async () => {
    service = new TodoService();
    todo = service.getTodo();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a todo item', () => {
    const todo0 = {
      title: 'test',
      status: 0,
    };
    todo.add(todo0);
    expect(todo.getAll()).toEqual([todo0]);
  });

  it('should remove a todo item', () => {
    const todo0 = {
      title: 'test',
      status: 0,
    };
    todo.add(todo0);
    todo.remove(1);
    expect(todo.getAll()).toEqual([]);
  });

});
