import {Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Speciality} from "./speciality.entity";
import {Clinic} from "./clinic.entity";

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @JoinTable()
    @ManyToMany(type => Speciality, (speciality) => speciality.id, {cascade: true} )
    speciality: Speciality[];

    @JoinTable()
    @ManyToMany(type => Clinic, clinic => clinic.doctors, {cascade: true})
    clinics: Clinic[];

    @Column({default: 0})
    recommendation: number

    @Column({nullable: true})
    address: string

    @Column({nullable: true})
    password: string;

    @Column({nullable: true})
    area: string

    @Column({nullable: true})
    free: string

    remark: string

    locations: string[]
}