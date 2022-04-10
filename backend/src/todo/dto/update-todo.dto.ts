import {IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
import { ITodo, StatusType} from "../interfaces/todo";

export class UpdateTodoDto implements ITodo {
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsEnum(StatusType)
    status: StatusType;
}