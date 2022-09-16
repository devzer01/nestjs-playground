import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Clinic} from "./clinic.entity";
import {Patient} from "./patient.entity";
import {Doctor} from "./doctor.entity";
import {Schedule} from "./schedule.entity";
import {scheduled} from "rxjs";


@Entity()
export class DoctorClinic {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => Doctor, (doctor) => doctor.id)
    doctor: Doctor

    @Column()
    start: number

    @Column()
    close: number

    @ManyToOne(type => Clinic, (clinic) => clinic.id)
    clinic: Clinic

    @Column()
    duration: number

    @Column()
    days: string

    available: boolean
}