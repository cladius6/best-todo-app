import {Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ITodo, StatusType} from "../interfaces/todo";

@Entity()
export class TodoEntity implements ITodo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({
        type: "enum",
        enum: StatusType,
        default: StatusType.Active
    })
    status: StatusType;
}