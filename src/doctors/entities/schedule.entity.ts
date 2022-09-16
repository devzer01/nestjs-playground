import {Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Clinic} from "./clinic.entity";
import {Patient} from "./patient.entity";
import {Doctor} from "./doctor.entity";
import {Calendar} from "./calendar.entity";


@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => Clinic, (clinic) => clinic.id)
    clinic: Clinic;

    @ManyToOne(type => Patient, (patient) => patient.id)
    patient: Patient

    @ManyToOne(type => Doctor, (doctor) => doctor.id)
    doctor: Doctor

    @Column({nullable: true})
    start: number

    @Column({nullable: true})
    date: string

    @Column({nullable: true})
    slot: number
}