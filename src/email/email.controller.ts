import { InjectQueue } from '@nestjs/bull';
import {Controller, Get, Param, Post, Res} from '@nestjs/common';
import { Queue } from 'bull';
import {MailService} from "./mail.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../typeorm/User";
import { Response } from "express";
import {Speciality} from "../doctors/entities/speciality.entity";
import {Doctor} from "../doctors/entities/doctor.entity";

@Controller('email')
export class EmailController {
    constructor(
        @InjectQueue('email') private readonly emailQue: Queue,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Speciality)
        private readonly specialityRepository: Repository<Speciality>,
        @InjectRepository(Doctor)
        private readonly doctorRepository: Repository<Doctor>
        ) {}

    @Get('send/:id')
    async transcode(@Param("id") id: number, @Res() res: Response) {
        const user = await this.userRepository.findOne({where: {id: id}})
        console.log(user);
        await this.emailQue.add('send', {
            subject: 'info@lk.com',
            user: user
        });
        if (user?.doctor !== null) {
            const doctor = await this.doctorRepository.findOne({where: { id: user!.doctor }})
            const specialities = await this.specialityRepository.find();
            return res.render('specialization', {layout: 'index', specialities: specialities, doctor: doctor});
        }

        //return res.render('confirm', {layout: 'index'});
    }
}