import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entity/todo.entity';
import { StatusType } from './interfaces/todo';

@Injectable()
export class TodoService {
  private todo;

  constructor(
    @InjectRepository(TodoEntity)
    private todosRepository: Repository<TodoEntity>,
  ) {}

  async findAll(): Promise<TodoEntity[]> {
    const result = await this.todosRepository.find();
    if (result.length === 0) return [];
    return result;
  }

  async findOne(id: number): Promise<TodoEntity> {
    const result = await this.todosRepository.findOne(id);
    if (result === undefined) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Todo not found',
        },
        HttpStatus.NOT_FOUND,
      );
    } else return result;
  }

  async create(newTodo: AddTodoDto): Promise<void> {
    const todo = new TodoEntity();
    todo.title = newTodo.title;
    await this.todosRepository.save(todo);
  }

  async update(todo: UpdateTodoDto): Promise<void> {
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
    if (await this.todosRepository.findOne(id)) {
      await this.todosRepository.delete(id);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Todo not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findAllByStatus(status: StatusType): Promise<TodoEntity[]> {
    return this.todosRepository.find({
      where: {
        status: status,
      },
    });
  }
}
