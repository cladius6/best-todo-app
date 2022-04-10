import { Catch, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entity/todo.entity';
import { ITodo, StatusType } from './interfaces/todo';

@Injectable()
export class TodoService {
  private todo;

  constructor(
    @InjectRepository(TodoEntity)
    private todosRepository: Repository<TodoEntity>,
  ) {}

  findAll(): Promise<TodoEntity[]> {
    return this.todosRepository.find();
  }

  async findOne(id: number): Promise<TodoEntity | any> {
      const result = await this.todosRepository.findOne(id);
      if (result === undefined) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Todo not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }else return result;
  }

  async create(newTodo: AddTodoDto): Promise<void> {
    const todo = new TodoEntity();
    todo.title = newTodo.title;
    await this.todosRepository.save(todo);
  }

  async update(todo: UpdateTodoDto): Promise<void | any> {
    try {
      await this.todosRepository.update(todo.id, todo);
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Todo not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async delete(id: number): Promise<void> {
    await this.todosRepository.delete(id);
  }

  async findAllByStatus(status: StatusType): Promise<TodoEntity[]> {
    return this.todosRepository.find({
      where: {
        status: status,
      },
    });
  }
}
