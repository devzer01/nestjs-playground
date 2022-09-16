import {Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Speciality} from "./speciality.entity";
import {Doctor} from "./doctor.entity";
import {Schedule} from "./schedule.entity";
import {scheduled} from "rxjs";

@Entity()
export class Clinic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    address: string

    @Column()
    open: number

    @Column()
    close: number

    @Column()
    name: string;

    @ManyToMany(type => Doctor, doctor => doctor.clinics)
    doctors: Doctor[];

    @Column({nullable: true})
    days: string

    @Column({nullable: true})
    duration: number
}