import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Doctor} from "./entities/doctor.entity";
import {Connection, Repository} from "typeorm";
import {Clinic} from "./entities/clinic.entity";
import {Speciality} from "./entities/speciality.entity";

@Injectable()
export class SpecialityService {
    constructor(
        @InjectRepository(Speciality)
        private readonly specialityRepository: Repository<Speciality>,
    ) {
    }

    async findAll(): Promise<Speciality[]> {
        return await this.specialityRepository.find()
    }

    async find(id: number): Promise<Speciality|null> {
        return await this.specialityRepository.findOne({where: {id: id}})
    }
}
