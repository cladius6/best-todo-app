import { Test, TestingModule } from '@nestjs/testing';
import { TodoListSingleton, TodoService } from './todo.service';
import { StatusType } from './interfaces/todo';

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
    todo.add({ title: 'test' });
    expect(todo.getAll()).toEqual([
      {
        id: 1,
        title: 'test',
        status: StatusType.Active,
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

  it('should find a todo item by id', () => {
    todo.add({ title: 'test' });
    expect(todo.getOne(1)).toEqual({
      id: 1,
      title: 'test',
      status: StatusType.Active,
    });
  });

  it('should update a todo item correctly', () => {
    todo.add({ title: 'test' });
    const updatedTodo = {
      id: 1,
      title: 'test2',
      status: StatusType.Completed,
    };
    todo.update(updatedTodo);
    expect(todo.getOne(1)).toEqual({
      id: 1,
      title: 'test2',
      status: StatusType.Completed,
    });
  });
});