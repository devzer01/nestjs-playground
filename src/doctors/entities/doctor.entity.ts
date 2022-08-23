import {Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Speciality} from "./speciality.entity";
import {Clinic} from "./clinic.entity";

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @JoinTable()
    @ManyToMany(type => Speciality, (speciality) => speciality.name, {cascade: true} )
    speciality: Speciality[];

    @JoinTable()
    @ManyToMany(type => Clinic, (clinic) => clinic.name, {cascade: true} )
    clinics: Clinic[];

    @Column({default: 0})
    recommendation: number
}