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
import {SearchDoctorDto} from "./dto/search-doctor.dto";
import {Patient} from "./entities/patient.entity";
import {PatientDto} from "./dto/patiant.dto";
import {User} from "../typeorm/User";

@Injectable()
export class PatientService {
    constructor(
        @InjectRepository(Patient)
        private readonly patientRepository: Repository<Patient>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async register(patientDto: PatientDto) {

        const patient = this.patientRepository.create({
            name: patientDto.name,
            email: patientDto.email,
            phone: patientDto.phone,
            address: patientDto.address,
            nic: patientDto.nic
        });
        const persistedPatient = await this.patientRepository.save(patient);

        const user = this.userRepository.create({
            name: patientDto.name,
            username: patientDto.email,
            password: patientDto.password,
            type: 2,
            patient: patient.id,
            email: patientDto.email
        });

        await this.userRepository.save(user);

        return user;
    }
}