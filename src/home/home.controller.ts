import {Body, Controller, Get, HttpStatus, Param, Post, Redirect, Res, Session} from "@nestjs/common";
import {Repository} from "typeorm";
import {User} from "../typeorm/User";
import {InjectRepository} from "@nestjs/typeorm";
import { Response} from "express";
import {Doctor} from "../doctors/entities/doctor.entity";
import {doc} from "prettier";
import {Schedule} from "../doctors/entities/schedule.entity";
import {Hour} from "../doctors/interfaces/hour.interface";
import {RoasterDTO} from "../doctors/dto/roaster.dto";
import {Clinic} from "../doctors/entities/clinic.entity";
import {DoctorClinic} from "../doctors/entities/doctor-clinic.entity";
import {DateTime} from "luxon";

@Controller("home")
export class HomeController {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Doctor)
        private readonly doctorRepository: Repository<Doctor>,
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
        @InjectRepository(Clinic)
        private readonly clinicRepository: Repository<Clinic>,
        @InjectRepository(DoctorClinic)
        private readonly doctorClinic: Repository<DoctorClinic>
    ) {
    }

    @Redirect()
    @Get("welcome")
    async verifyEmail(@Session() session: Record<string, any>, @Res() res : Response) {
        let template = "/home/welcome-doctor";
        if (session["type"] == 2) {
            template = "/patient/home";
        } else if (session["type"] == 3){
            template = "/home/welcome-clinic"
        }
        console.log(session)
        let userId = session["user"];
        let user = await this.userRepository.findOne({where: {id: userId}});
        let doctor = await this.doctorRepository.findOne({where: {id: user!.doctor}})
        // return res.render(template, {layout: "index", user: user, doctor: doctor});
        return res.redirect(301, template);
    }

    @Get("welcome-patient")
    async welcomePatient(@Res() res : Response, @Session() session: Record<string, any>) {
      let id = session['user'];
        let user = await this.userRepository.findOne({where: {id: id}});
        let schedules = await this.scheduleRepository.find({where: { patient : { id: user?.patient}}}) ; //, relations: {doctor: true, clinic: true, patient: true}})
       res.render('welcome-patient', {layout: 'index'}); //, user: user, schedules: schedules});
    }

    pad(num:number, size:number): string {
        let s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    @Get("welcome-clinic")
    async welcomeClinic(@Res() res : Response, @Session() session: Record<string, any>) {
        let id = session['user'];
        let user = await this.userRepository.findOne({where: {id: id}});
        let clinic = await this.clinicRepository.findOne({where: { id: user?.clinic}})
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
        const doctors = await this.doctorRepository.find();

        let schedules = await this.scheduleRepository.find({where: { patient : { id: user?.patient}}}) ; //, relations: {doctor: true, clinic: true, patient: true}})
        console.log(schedules)
        res.render('welcome-clinic', {layout: 'index', doctors: doctors, hours: hours, days: days, clinic: clinic}); //, user: user, schedules: schedules});
    }

    @Get("welcome-doctor")
    async welcomeDoctor(@Res() res : Response, @Session() session: Record<string, any>) {
        let id = session['user'];
        const date = DateTime.now().toFormat("y-LL-dd")
        let user = await this.userRepository.findOne({where: {id: id}});
        let schedules = await this.scheduleRepository.find({where: { date: date }, relations: {patient: true, clinic: true}}) ; //, relations: {doctor: true, clinic: true, patient: true}})
        console.log(schedules)
        res.render('welcome-doctor', {layout: 'index', schedules: schedules, user: user}); //, user: user, schedules: schedules});
    }

    @Post("/clinic/roaster")
    async roaster(@Body() roasterDto : RoasterDTO) {

        console.log(roasterDto);


        const roaster = this.doctorClinic.create({
            doctor: {id: roasterDto.doctor},
            start: roasterDto.open,
            close: roasterDto.close,
            clinic: {id: roasterDto.clinic},
            duration: roasterDto.duration,
            days: roasterDto.days.join(",")
        });

        await this.doctorClinic.save(roaster);
    }
}