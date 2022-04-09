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
    todo.add({title: 'test'});
    expect(todo.getAll()).toEqual([
      {
        id: 1,
        title: 'test',
        status: 0,
      },
    ]);
  });

  it('should remove a todo item', () => {
    const todo0 = {
      title: 'test',
    };
    todo.add(todo0);
    todo.delete(1);
    expect(todo.getAll()).toEqual([]);
  });

});
