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

  it('should return all completed todo items', () => {
    todo.add({ title: 'test'});
    todo.update({ id: 1, title: 'test2', status: StatusType.Completed });
    todo.add({ title: 'test2'});
    todo.update({ id: 2, title: 'test3', status: StatusType.Completed });
    todo.add({ title: 'test3' });
    expect(todo.getAllCompleted()).toEqual([
      {
        id: 1,
        title: 'test2',
        status: StatusType.Completed,
      },
      {
        id: 2,
        title: 'test3',
        status: StatusType.Completed,
      },
    ])
  });

  it('should return all uncompleted todo items', () => {
    todo.add({ title: 'test'});
    todo.update({ id: 1, title: 'test2', status: StatusType.Completed });
    todo.add({ title: 'test2'});
    todo.add({ title: 'test3' });
    expect(todo.getAllUncompleted()).toEqual([
      {
        id: 2,
        title: 'test2',
        status: StatusType.Active,
      },
      {
        id: 3,
        title: 'test3',
        status: StatusType.Active,
      },
    ])
  })

  it('should throw an error when trying to get a todo item by id that does not exist', () => {
    expect(() => todo.getOne(1)).toThrowError('Todo not found');
  });
});
