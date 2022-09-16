/* CoffeesService - FINAL CODE */
import {Injectable, NotFoundException, Session} from '@nestjs/common';
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
import {ClinicDto} from "./dto/clinic.dto";
import {SelfClinicDto} from "./dto/self-clinic.dto";

@Injectable()
export class ClinicService {
    constructor(
        @InjectRepository(Clinic)
        private readonly clinicRepository: Repository<Clinic>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Doctor)
        private readonly doctorRepository: Repository<Doctor>
    ) {}

    async register(clinicDto: ClinicDto) {

        const clinic = this.clinicRepository.create({
            name: clinicDto.name,
            email: clinicDto.email,
            phone: clinicDto.phone,
            address: clinicDto.address,
            open: clinicDto.open,
            close: clinicDto.close,
            days: clinicDto.days.join(","),
            duration: clinicDto.duration
        });

        console.log(clinic)

        const persistedPatient = await this.clinicRepository.save(clinic);

        const user = this.userRepository.create({
            name: clinicDto.name,
            username: clinicDto.email,
            password: clinicDto.password,
            type: 3,
            clinic: clinic.id,
            email: clinicDto.email
        });

        await this.userRepository.save(user);

        return user;
    }
}