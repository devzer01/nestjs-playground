import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Clinic} from "./clinic.entity";
import {Patient} from "./patient.entity";
import {Doctor} from "./doctor.entity";
import {Schedule} from "./schedule.entity";
import {scheduled} from "rxjs";


@Entity()
export class Calendar {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    date: string

    @OneToOne(type => Clinic, {cascade: true})
    @JoinColumn()
    clinic: Clinic;

    @OneToMany(type => Schedule, (schedule) => schedule.id)
    appointments: Schedule[]

    @Column()
    start: number
}