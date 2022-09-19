import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Speciality} from "./entities/speciality.entity";
import {Clinic} from "./entities/clinic.entity";
import {Doctor} from "./entities/doctor.entity";
import {DoctorsController} from "./doctors.controller";
import {DoctorsService} from "./doctors.service";
import {MongooseModule} from "@nestjs/mongoose";
import {LogRequest, RequestSchema} from "./schemas/request.schema";
import {DoctorSubscriber} from "./subscriber";
import {SpecialityService} from "./speciality.service";
import {PatientController} from "./patient.controller";
import {PatientService} from "./patient.service";
import {Patient} from "./entities/patient.entity";
import {EmailModule} from "../email/email.module";
import {BullModule} from "@nestjs/bull";
import {User} from "../typeorm/User";
import {Schedule} from "./entities/schedule.entity";
import {Calendar} from "./entities/calendar.entity";
import {ClinicController} from "./clinic.controller";
import {ClinicService} from "./clinic.service";
import {DoctorClinic} from "./entities/doctor-clinic.entity";
import { ServeStaticModule } from '@nestjs/serve-static';
import {join} from "path";


@Module({
    imports: [
        TypeOrmModule.forFeature([Doctor, Clinic, Speciality, Patient, User, Schedule, Calendar, DoctorClinic]),
        MongooseModule.forFeature([{ name: LogRequest.name, schema: RequestSchema }])],

    controllers: [DoctorsController, PatientController, ClinicController],
    providers: [SpecialityService, DoctorsService, PatientService, DoctorsController, DoctorSubscriber, ClinicService],
    exports: [DoctorsController]
})
export class DoctorsModule {}
