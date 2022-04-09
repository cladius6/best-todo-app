import {Body, Controller, Get, Put } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
    constructor(private todoService: TodoService) {}

    @Get('')
    getAll() {
        return this.todoService.getTodo().getAll();
    }

    @Put('')
    add(@Body() todo) {
        return this.todoService.getTodo().add(todo);
    }
}
