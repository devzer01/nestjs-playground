import {Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class LogRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}