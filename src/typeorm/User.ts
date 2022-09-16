import { UserEntity } from 'nestjs-session-store';
import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User implements UserEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({nullable: true})
    secondary: string

    @Column()
    username: string;

    @Column()
    name: string;

    @Column()
    password: string

    @Column()
    email: string;

    @Column({nullable: true})
    verified: boolean

    @Column({nullable: true})
    token: string

    @Column({nullable: true})
    type: number

    @Column({nullable: true})
    doctor: number

    @Column({nullable: true})
    patient: number

    @Column({nullable: true})
    clinic: number
}