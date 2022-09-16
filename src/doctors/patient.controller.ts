import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Render, Req, Res, Session} from '@nestjs/common';
import { PaginationQuery} from "./dto/pagination.dts";
import {CreateDoctor} from "./dto/create-doctor.dto";
import {DoctorsService} from "./doctors.service";
import {SearchDoctorDto} from "./dto/search-doctor.dto";
import {Doctor} from "./entities/doctor.entity";
import {SpecialityService} from "./speciality.service";
import {PatientService} from "./patient.service";
import {PatientDto} from "./dto/patiant.dto";
import { Response } from "express";
import {InjectRepository} from "@nestjs/typeorm";
import {Schedule} from "./entities/schedule.entity";
import {Repository} from "typeorm";
import {User} from "../typeorm/User";

@Controller('patient')
export class PatientController {
    constructor(private readonly patientService: PatientService,
                @InjectRepository(Schedule)
                private readonly scheduleRepository: Repository<Schedule>,
                @InjectRepository(User)
                private readonly userRepository: Repository<User>,
                ) {
    }

    @Post('register')
    async registerPatient(@Body() createPatient: PatientDto,
                          @Session() session: Record<string, any>,
                          @Res() res : Response) {
        const user = await this.patientService.register(createPatient);
        session["user"] = user;
        return res.redirect("/email/send/" + user.id);

    }

    @Get("register")
    register(@Res() res : Response) {
        return res.render("register-patiant", {layout: "index"});
    }

    @Get("home")
    async home(@Res() res : Response, @Session() session : Record<string, any>) {
        const uid = session.user
        const user = await this.userRepository.findOne({where: { id : uid }})
        const schedule = await this.scheduleRepository.find({where: { patient: { id : user?.patient }}, relations: {doctor: true, clinic: true}})
        return res.render('patient/home', {layout: 'index', schedule: schedule});
    }
}
