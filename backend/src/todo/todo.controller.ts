import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ITodo } from './interfaces/todo';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get('')
  getAll() {
    return this.todoService.getTodo().getAll();
  }

  @Get('completed')
  getAllCompleted() {
    return this.todoService.getTodo().getAllCompleted();
  }

  @Get('uncompleted')
  getAllUncompleted() {
    return this.todoService.getTodo().getAllUncompleted();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    try {
      return this.todoService.getTodo().getOne(Number(id));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put('')
  @UsePipes(new ValidationPipe({ transform: true }))
  add(@Body() todo: AddTodoDto) {
    return this.todoService.getTodo().add(todo);
  }

  @Post('')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Body() todo: UpdateTodoDto) {
    return this.todoService.getTodo().update(todo);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    try {
      return this.todoService.getTodo().delete(Number(id));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

}
