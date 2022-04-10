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
    return this.todoService.getTodo().getAllCompleted();
  }

  @Get('uncompleted')
  getAllUncompleted() {
    return this.todoService.getTodo().getAllUncompleted();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.todoService.findOne(id);
    if (result === undefined) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return result;
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
