import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Render, Req, Res, Session} from '@nestjs/common';
import {Doctor} from "./entities/doctor.entity";
import { Response } from "express";
import {ClinicService} from "./clinic.service";
import {ClinicDto} from "./dto/clinic.dto";
import {SelfClinicDto} from "./dto/self-clinic.dto";
import {Hour} from "./interfaces/hour.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../typeorm/User";
import {Repository} from "typeorm";
import {DoctorClinic} from "./entities/doctor-clinic.entity";
import {Clinic} from "./entities/clinic.entity";


@Controller('clinic')
export class ClinicController {
    constructor(private readonly clinicService: ClinicService,
                @InjectRepository(User)
                private readonly userRepository: Repository<User>,
                @InjectRepository(DoctorClinic)
                private readonly doctorClinic: Repository<DoctorClinic>,
                @InjectRepository(Doctor)
                private readonly doctorRepository: Repository<Doctor>,
                @InjectRepository(Clinic)
                private readonly clinicRepository: Repository<Clinic>
    ) {
    }

    @Get("home")
    async clinicHome(@Res() res : Response) {
        const clinics = await this.clinicRepository.find({relations: {doctors: true}});
        return res.render('clinic/home', {layout: 'index', clinics: clinics});
    }

    @Post('register')
    async registerPatient(@Body() createClinic: ClinicDto,
                          @Session() session: Record<string, any>,
                          @Res() res : Response) {
        const user = await this.clinicService.register(createClinic);
        session["user"] = user;
        return res.redirect("/email/send/" + user.id);

    }

    @Post("self-service")
    async roaster(@Body() selfClinic : SelfClinicDto, @Res() res : Response) {

        const doctor = await this.doctorRepository.findOne({where: {id: parseInt(selfClinic.doctor)}, relations: { clinics: true}});
        const clinic = this.clinicRepository.create({
            name: selfClinic.name,
            email: doctor!.email,
            phone: doctor!.phone,
            address: selfClinic.address,
            open: parseInt(selfClinic.open),
            close: parseInt(selfClinic.close),
            days: selfClinic.days.join(",")
        });

        await this.clinicRepository.save(clinic);
        doctor!.clinics = [];
        doctor?.clinics.push(clinic);
        await this.clinicRepository.save(clinic);
        await this.doctorRepository.save(doctor!)

        console.log(selfClinic);
        const roaster = this.doctorClinic.create({
            doctor: {id: parseInt(selfClinic.doctor)},
            start: parseInt(selfClinic.open),
            close: parseInt(selfClinic.close),
            clinic: {id: clinic.id},
            duration: selfClinic.duration,
            days: selfClinic.days.join(",")
        });

        await this.doctorClinic.save(roaster);

        res.render('complete', {layout: 'index'});
    }

    pad(num:number, size:number): string {
        let s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    @Get("register")
    register(@Res() res : Response) {
        const hours : Hour[] = []
        for (let hour: number = 0; hour < 24; hour++) {
            const id = this.pad(hour, 2)
            const name = (hour < 12) ? String(id).concat(" AM") : String(parseInt(id) > 12 ? parseInt(id) - 12 : parseInt(id)).concat(" PM")
            hours.push({id: id, name: name});
        }

        console.log(hours);

        const days = [
            {id: 0, name: "Sun"},
            {id: 1, name: "Mon"},
            {id: 2, name: "Tue"},
            {id: 3, name: "Wed"},
            {id: 4, name: "Thu"},
            {id: 5, name: "Fri"},
            {id: 6, name: "Sat"},
            ];

        return res.render("clinic", {layout: "index", hours: hours, days: days});
    }

    @Get("register/:id")
    registerCombo(@Res() res : Response, @Param("id") doctor : string) {
        const hours : Hour[] = []
        for (let hour: number = 0; hour < 24; hour++) {
            const id = this.pad(hour, 2)
            const name = (hour < 12) ? String(id).concat(" AM") : String(parseInt(id) > 12 ? parseInt(id) - 12 : parseInt(id)).concat(" PM")
            hours.push({id: id, name: name});
        }

        const days = [
            {id: 0, name: "Sun"},
            {id: 1, name: "Mon"},
            {id: 2, name: "Tue"},
            {id: 3, name: "Wed"},
            {id: 4, name: "Thu"},
            {id: 5, name: "Fri"},
            {id: 6, name: "Sat"},
        ];
        return res.render("clinic/register-clinic", {layout: "index", hours: hours, days: days, doc: doctor});
    }

    @Get("location/:id")
    async clinicLocation(@Res() res : Response, @Param("id") id : number) {
        const clinic = await this.clinicRepository.findOne({where: { id : id }})
        return res.render('clinic/location', {layout: 'index', clinic: clinic});
    }
}
