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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { StatusType } from './interfaces/todo';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get('')
  async findAll() {
    const result = await this.todoService.findAll();
    if (result.length === 0) return [];
    return result;
  }

  @Get('completed')
  getAllCompleted() {
    return this.todoService.findAllByStatus(StatusType.Completed);
  }

  @Get('uncompleted')
  getAllUncompleted() {
    return this.todoService.findAllByStatus(StatusType.Active)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.todoService.findOne(id);
  }

  @Put('')
  @UsePipes(new ValidationPipe({ transform: true }))
  async add(@Body() todo: AddTodoDto) {
    return await this.todoService.create(todo);
  }

  @Post('')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Body() todo) {
    return await this.todoService.update(todo);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
      return await this.todoService.delete(id);
  }
}
