import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
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

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.todoService.getTodo().getOne(Number(id));
  }

  @Put('')
  add(@Body() todo) {
    return this.todoService.getTodo().add(todo);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    this.todoService.getTodo().delete(Number(id));
  }


  @Post('')
  update(@Body() todo: ITodo) {
    return this.todoService.getTodo().update(todo);
  }

}
