import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAllByStatus(status: StatusType): Promise<TodoEntity[]> {
    return this.todosRepository.find({
      where: {
        status: status,
      },
    });
  }
}
