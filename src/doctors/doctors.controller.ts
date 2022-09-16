import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Render, Req, Res, Session} from '@nestjs/common';
import { PaginationQuery} from "./dto/pagination.dts";
import {CreateDoctor} from "./dto/create-doctor.dto";
import {DoctorsService} from "./doctors.service";
import {SearchDoctorDto} from "./dto/search-doctor.dto";
import {Doctor} from "./entities/doctor.entity";
import {SpecialityService} from "./speciality.service";
import { Request } from 'express';
import {ClinicDto} from "./dto/clinic.dto";
import { DateTime } from "luxon"
import { Response } from "express";
import {CalendarDate, CalendarMonth} from "typescript-calendar-date";
import Handlebars from "handlebars";
import {InjectRepository} from "@nestjs/typeorm";
import {DoctorClinic} from "./entities/doctor-clinic.entity";
import {Like, Repository} from "typeorm";
import {Schedule} from "./entities/schedule.entity";
import {User} from "../typeorm/User";
import {doc} from "prettier";
const moment = require("moment/moment");


@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService,
                private readonly specialityService: SpecialityService,
                @InjectRepository(DoctorClinic)
                private readonly doctorClinicRepository: Repository<DoctorClinic>,
                @InjectRepository(Schedule)
                private readonly scheduleRepository: Repository<Schedule>,
                @InjectRepository(Doctor)
                private readonly doctorRepository: Repository<Doctor>,
                @InjectRepository(User)
                private readonly userRepository: Repository<User>
                ) {
    }

    @Get()
    findAll(@Query() paginationQuery: PaginationQuery): Promise<Doctor[]> {
        const {limit, offset} = paginationQuery
        return this.doctorsService.findAll(paginationQuery);

    }

    @Post("upload")
    uploadCoffee(@Body() createCoffeeDto : CreateDoctor) {
        return this.doctorsService.create(createCoffeeDto);
    }

    pad(num:number, size:number): string {
        let s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    @Get("reserve/:day/:doctor")
    async reserveDoctorLocation(@Param("doctor") id: number, @Res() res : Response, @Param("day") day : string) {
        const doctor = await this.doctorsService.findOne(id)
        const date = DateTime.fromISO(day).toFormat('y-LL-dd');
        const dayOfWeek = String(parseInt(DateTime.fromISO(day).toFormat('E')) - 1);
        const clinics = await this.doctorClinicRepository.find({where: {doctor: {id: doctor.id}}, relations: {clinic: true}})
        const x = await this.scheduleRepository.find({where: {doctor: { id: id}, date: date}}); //, clinic: {id: 29}}})
        const schedule = clinics.map((clinic) => {
            const holiday = clinic.days.split((",")).filter((day) => day === dayOfWeek);
            const slotCount = ((clinic.close - clinic.start) * 60) / clinic.duration
            let startSlot = clinic.start * 60;

            const blocks: any[] = []
            for (let i = 0; i < slotCount; i++) {
                let hour = Math.floor(startSlot / 60);
                let mins = startSlot % 60;
                const block = {id: i, time: String(hour).concat(":").concat(String(this.pad(mins, 2)))};
                blocks.push(block);
                startSlot += clinic!.duration
            }

            let slots = blocks.map((block) => {
                let found = x.find((slot) => slot.slot == block.id);
                let avail = false;
                if (found === undefined) {
                    avail = true
                }
                if (holiday.length === 0) {
                    avail = false
                }
                return {id: block.id, time: block.time, available: avail, clinic: clinic, doctor: doctor,
                    closed: undefined
                }
            });
            const allday = slots.filter((day) => !day.available)
            console.log(allday.length)
            let available = false
            if ( allday.length == slots.length ) {
                available = true
            }

            return {clinic: clinic, slots: slots, available: available};
        });
        // @ts-ignore
        //console.log(schedule.pop().slots)
        // console.log(schedule)
        return res.render('reserve', {layout: 'index', schedule: schedule})
    }

    @Get("search")
    async doctorSearch(@Res() res : Response) {
        const specialities = await this.specialityService.findAll();
        console.log(specialities);
        return res.render('search-doctor',
            {layout: 'index', specialities: specialities});
    }

    @Post("search")
    async performSearch(@Body() request: any, @Res() res : Response) {
        console.log(request.speciality);
        console.log(request.area);
        const specialities = await this.specialityService.find(parseInt(request.speciality))
        const doctors = await this.doctorsService.findBySpeciality(specialities!)
        const docs = doctors.map((doctor) => {
            let d = Object.assign({}, doctor);
            d.free = doctor.speciality[0].name;
            return d;
        })
        console.log(specialities);
        console.log(doctors);
        return res.render('search-result',
            {layout: 'index', doctors: docs});
    }

    @Get('search/:name')
    searchDoctor(@Param("name") name : string) {
        return this.doctorsService.search(name);
    }

    @Get("book")
    @Render("book")
    async bookDoctor() {
        const clinics = await this.doctorsService.getClinics();
        const slots = await this.mergeSlots();
        return {"clinic": clinics, slots: slots};
    }

    async mergeSlots() {
        const occupied = this.doctorsService.getSchedule("2022-05-05", 6);
        const blocks = [{id: 1}, {id: 2}, {id: 3}, {id: 4}]
        return occupied.then((slots) => {
            console.log(slots)
            return blocks.map((block) => {
               let found = slots.find((slot) => slot.slot == block.id);
               console.log(found)
               let avail = false;
               if (found === undefined) {
                   avail = true
               }
               console.log(avail);
               return {id: block.id, available: avail, clinic: 6}
            });
        })
    }

    @Get("reserve/:slot/:clinic/:doctor")
    async reserveDoctor(@Res() res: Response, @Param("slot") slot : number, @Param("clinic") clinic : number, @Param("doctor") id : number, @Session() session: Record<string, any>) {
        console.log(session);
        const patient = await this.doctorsService.findPatient(session["user"]);
        const doctor = await this.doctorsService.findOne(id);
        const oClinic = await this.doctorsService.findClinic(clinic);
        const start = DateTime.now();
        const today = start.toFormat('y-LL-dd');
        await this.doctorsService.reserve(slot, clinic, patient!, doctor, today);
        res.render('confirm-appointment', {layout: 'index', doctor: doctor, clinic: oClinic});
    }

    @Post('register')
    async registerDoctor(@Body() createDoctor: CreateDoctor,
                         @Session() session: Record<string, any>,
                         @Req() res: Request) {
        const doctor = await this.doctorsService.register(createDoctor);
        session["user"] = doctor;
        return res.res?.redirect("/email/send/" + doctor.id);
    }

    @Post('clinic')
    async registerClinic(@Body() clinicDto: ClinicDto,
                         @Session() session: Record<string, any>,
                         @Req() res: Request) {
        const doctor = await this.doctorsService.registerClinic(clinicDto);
        session["user"] = doctor;
        return res.res?.redirect("/email/send/" + doctor.id);
    }

    @Get("clinic/:id")
    returnDoctorList(@Param("id") id: number) {
        return this.doctorsService.getDoctors(id).then((clinic) => {
            console.log(clinic);
            return clinic!.doctors;
        });
    }


    @Get("/register")
    register(@Res() res: Response) {
        return res.render("register-doctor", {layout: "index", message: "foobar", })
    }

    @Get("speciality")
    async speciality(@Res() res : Response) {
        const specialities = await this.specialityService.findAll();
        return res.render('doctors/speciality', {layout: 'index', speciality: specialities})
    }

    @Post("speciality")
    async setSpeciality(@Body() request: any, @Session() session : Record<string, any>, @Res() res : Response) {
        const id = request.speciality.replace("speciality-", "");
        const doc = request.doctor;
        const speciality = await this.specialityService.find(id)
        const doctor = await this.doctorRepository.findOne({ where: { id: doc }, relations: {speciality: true}})
        doctor!.speciality.push(speciality!)
        await this.doctorRepository.save(doctor!)
        return res.redirect("/clinic/register/" + doctor!.id)
    }

    @Post("search-speciality")
    async searchSpeciality(@Body() request: any, @Res() res : Response) {
        let doctors = await this.doctorRepository.find({where: { speciality: { id: request.speciality }}, relations: {speciality: true, clinics: true}});
        let docs = doctors.map((doc) => { doc.locations = doc.clinics.map((clinic) => "<a href='/clinic/" + clinic.id + "/" + doc.id + "'>" + clinic.name + "</a>"); doc.remark = doc.locations.join(","); return doc;});
        const speciality = await this.specialityService.find(request.speciality)
        console.log(docs)
        return res.render('doctors/search', {layout: 'index', doctors: docs, speciality: speciality})
    }

    @Get("schedule")
    setSchedule() {
        this.doctorsService.setSchedule().then((e) => console.log("called"));
    }

    @Get("reserve/:doctor")
    async calender(@Res() res: Response, doctor: number) {
        const calendar = [];
        const today = moment();
        const startDay = today.clone().startOf('month').startOf('week');
        const endDay = today.clone().endOf('month').endOf('week');

        let date = startDay.clone().subtract(1, 'day');

        while (date.isBefore(endDay, 'day'))
            calendar.push({
                days: Array(7).fill(0).map(() => date.add(1, 'day').clone())
            });

        return res.render('doctors/calendar', {layout: 'index', calendar: calendar,
            doc: doctor})
    }

    @Get("home")
    renderHome(@Res() res : Response) {
        res.render('doctors/home', {layout: 'index'});
    }

    @Get("directory")
    doctorDirectory(@Res() res: Response) {
        res.render('doctors/directory', { layout: 'index'});
    }

    @Get("byname")
    async byName(@Res() res: Response) {

        const chars : any[] = [];
        let ddocs: any[] = [];
        const start = 65
        const end = 90
        for (let i = start; i <= end; i++) {
            const char = String.fromCharCode(i);
            const docsUpper = await this.doctorRepository.find({where: { name: Like(char + "%")}, relations: { speciality: true, clinics: true}})
            const docsLower = await this.doctorRepository.find({where: { name: Like(char.toLowerCase() + "%")}, relations: { speciality: true, clinics: true}})
            let docs = Object.assign(docsUpper, docsLower);
            ddocs = docs.map((doc) => { doc.remark = doc.speciality.map((s) => s.name).join(","); return doc; })
            console.log(ddocs)
            chars.push({char: char, docs: ddocs});
        }
        res.render('doctors/byname', {layout: 'index', chars: chars});
    }

    @Get("profile/:id")
    async doctorProfile(@Res() res : Response, @Param("id") id : number) {
        const doctor = await this.doctorRepository.findOne({where: {id : id}, relations: {clinics: true, speciality: true}})
        console.log(doctor)
        res.render("doctors/profile", {layout: 'index', doctor: doctor})
    }
}
