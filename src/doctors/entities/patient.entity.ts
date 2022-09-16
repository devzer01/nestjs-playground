import {Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {inspect} from "util";
import {Schedule} from "./schedule.entity";


@Entity()
export class Patient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column({nullable: true})
    address: string

    @Column({nullable: true})
    nic: string

}