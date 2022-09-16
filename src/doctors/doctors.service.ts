/* CoffeesService - FINAL CODE */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {CreateDoctor} from "./dto/create-doctor.dto";
import {UpdateDoctorDto} from "./dto/update-doctor.dto";
import {PaginationQuery} from "./dto/pagination.dts";
import {Doctor} from "./entities/doctor.entity";
import {Clinic} from "./entities/clinic.entity";
import {Speciality} from "./entities/speciality.entity";
import {Event} from "./entities/event.entity";
import {User} from "../typeorm/User";
import * as crypto from "crypto"
import {ClinicDto} from "./dto/clinic.dto";
import {Schedule} from "./entities/schedule.entity";
import {Patient} from "./entities/patient.entity";

@Injectable()
export class DoctorsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Doctor)
        private readonly doctorRepository: Repository<Doctor>,
        @InjectRepository(Clinic)
        private readonly clinicRepository: Repository<Clinic>,
        @InjectRepository(Speciality)
        private readonly specialityRepository: Repository<Speciality>,
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
        @InjectRepository(Patient)
        private readonly patientRepository: Repository<Patient>,
        private readonly connection: Connection,
    ) {}

    findAll(paginationQuery: PaginationQuery) {
        const {limit, offset} = paginationQuery;
        return this.doctorRepository.find({
            relations: {
                speciality: true,
            },
            skip: offset,
            take: limit
        });
    }

    async save(doctor: Doctor) {
        return await this.doctorRepository.save(doctor);
    }

    async findOne(id: number) {
        const doctor = await this.doctorRepository.findOne({
            where: { id: id}, relations: {clinics: true}
        });
        if (!doctor) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return doctor;
    }

    async create(createDoctor: CreateDoctor) {
        // const speciality = await Promise.all(
        //     createDoctor.speciality.map(name => this.preloadFlavorByName(name)),
        // );
        //
        // const doctor = this.doctorRepository.create({
        //     ...createDoctor,
        //     speciality,
        // });
        return this.doctorRepository.save({});
    }

    async update(id: string, updateDoctorDto: UpdateDoctorDto) {
        // const speciality =
        //     updateDoctorDto.speciality &&
        //     (await Promise.all(
        //         updateDoctorDto.speciality.map(name => this.preloadFlavorByName(name)),
        //     ));
        //
        // const doctor = await this.doctorRepository.preload({
        //     id: +id,
        //     ...updateDoctorDto,
        //     speciality
        // });
        // if (!doctor) {
        //     throw new NotFoundException(`Coffee #${id} not found`);
        // }
        return this.doctorRepository.save({});
    }

    async remove(id: number) {
        const coffee = await this.findOne(id);
        return this.doctorRepository.remove(coffee);
    }

    private async preloadFlavorByName(name: Speciality): Promise<Speciality> {
        // @ts-ignore
        const existingSpecialization = await this.specialityRepository.findOne({where: { name: name}})
        if (existingSpecialization) {
            return existingSpecialization;
        }
        // @ts-ignore
        return this.specialityRepository.create({ name });
    }

    async recommendCoffee(doctor: Doctor) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            doctor.recommendation++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffeeId: doctor.id };

            await queryRunner.manager.save(doctor);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async search(name: string): Promise<Doctor[]> {
        return await this.doctorRepository.find({where: {name: name}})
    }

    async register(createDoctor: CreateDoctor) {

        const doctor = this.doctorRepository.create({
            ...createDoctor,
        });
        const persistentDoctor = await this.doctorRepository.save(doctor);

        const token = crypto.randomBytes(64).toString('hex');


        const user = this.userRepository.create({
            username: doctor.email,
            name: doctor.name,
            password: doctor.password,
            token: token,
            email: doctor.email,
            type: 1,
            doctor: doctor.id
        });

        const persistedUser = await this.userRepository.save(user);
        console.log("user id " + persistedUser.id);

        return {doctor: persistentDoctor.id, email: doctor.email, token:token, id: persistedUser.id
        };
    }

    async registerClinic(clinicDto: ClinicDto) {
        const clinic = this.clinicRepository.create({

            name: clinicDto.name,
            email: clinicDto.email,
            phone: clinicDto.phone,
            address: clinicDto.address,
            days: clinicDto.days.join(",")

        });

        const persistedClinic = await this.clinicRepository.save(clinic);

        return {id: persistedClinic};
    }

    async setSchedule() {
        const schedule = new Schedule()
        schedule.clinic = new Clinic()
        schedule.clinic.name = "Robin"
        schedule.clinic.email = "info@clinic.com"
        schedule.clinic.phone = "7474 83834"
        schedule.clinic.address = "123 foobar road"
        schedule.clinic.open = 1000
        schedule.clinic.close = 1000
        // schedule.doctor = new Doctor();
        // schedule.doctor.name = "John"
        // schedule.doctor.email = "foo@bar.com"
        // schedule.doctor.phone = "555-5555"
        // schedule.patient = new Patient();
        // schedule.patient.name = "Monk"
        // schedule.patient.email = "foo@bstbst"
        // schedule.patient.phone = "777-7777"
        // schedule.start = 10

        await this.scheduleRepository.save(schedule);
    }

    async getClinics() {
        return this.clinicRepository.find()
    }

    async getClinic(id: number) {
        return this.clinicRepository.findOne({where: {id: id}})
    }

    getDoctors(id :number) {
        return this.clinicRepository.findOne({where: {id: id}, relations: {doctors: true}});
    }

    getSchedule(date: string, id: number) {
        return this.scheduleRepository.find({where: {date: date, clinic: {id: id}}})
    }

    async reserve(slot : number, clinicId: number, patient: Patient, doctor: Doctor, date: string) {
        const clinic = await this.clinicRepository.findOne({where: {id: clinicId}});
        console.log("clinic" + clinicId);
        console.log(clinic);
        const schedule = this.scheduleRepository.create({
            slot: slot,
            clinic: clinic!,
            patient: patient,
            doctor: doctor,
            start: 10,
            date: date
        })
        console.log(schedule);
        await this.scheduleRepository.save(schedule);

        return schedule;
    }

    async findBySpeciality(speciality: Speciality) {
        return await this.doctorRepository.find({where: {speciality: {id: speciality.id}}, relations: {speciality: true}})
    }

    async findPatient(id: number) {
        const user = await this.userRepository.findOne({where: {id: id}});
        const patient =await this.patientRepository.findOne({where: {id: user!.patient}})
        return patient;
    }

    async findClinic(id: number) {
        const clinic = await this.clinicRepository.findOne({where: {id: id}})
        return clinic;
    }
}