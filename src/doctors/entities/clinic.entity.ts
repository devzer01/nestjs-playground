import {Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Speciality} from "./speciality.entity";
import {Doctor} from "./doctor.entity";

@Entity()
export class Clinic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Doctor, (doctor) => doctor.name, {cascade: true} )
    doctors: Doctor[];
}