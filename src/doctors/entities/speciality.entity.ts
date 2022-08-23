import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Doctor} from "./doctor.entity";

@Entity()
export class Speciality {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Doctor, doctor => doctor.name )
    doctors: Doctor[];
}