import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import {EmailController} from "./email.controller";
import {EmailService} from "./email.service";
import {MailService} from "./mail.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Doctor} from "../doctors/entities/doctor.entity";
import {Clinic} from "../doctors/entities/clinic.entity";
import {Speciality} from "../doctors/entities/speciality.entity";
import {Patient} from "../doctors/entities/patient.entity";
import {User} from "../typeorm/User";


@Module({
    imports: [
        TypeOrmModule.forFeature([Doctor, Clinic, Speciality, Patient, User]),
        BullModule.registerQueue({
            name: 'email',
        })
    ],
    controllers: [EmailController],
    providers: [EmailService, MailService],
})
export class EmailModule {}