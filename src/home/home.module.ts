import { Module } from '@nestjs/common';
import {HomeController} from "./home.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Doctor} from "../doctors/entities/doctor.entity";
import {Clinic} from "../doctors/entities/clinic.entity";
import {Speciality} from "../doctors/entities/speciality.entity";
import {Patient} from "../doctors/entities/patient.entity";
import {User} from "../typeorm/User";
import {Schedule} from "../doctors/entities/schedule.entity";
import {DoctorClinic} from "../doctors/entities/doctor-clinic.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Doctor, Schedule, Clinic, DoctorClinic])],
    controllers: [HomeController]
})
export class HomeModule {}
