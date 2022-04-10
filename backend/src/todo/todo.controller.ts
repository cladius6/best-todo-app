import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
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
  getOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.todoService.getTodo().getOne(id);
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
    try {
      return this.todoService.getTodo().update(todo);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.todoService.getTodo().delete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
