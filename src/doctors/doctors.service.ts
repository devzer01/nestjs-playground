/* CoffeesService - FINAL CODE */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {CreateDoctor} from "./dto/create.dto";
import {UpdateDoctorDto} from "./dto/update.dto";
import {PaginationQuery} from "./dto/pagination.dts";
import {Doctor} from "./entities/doctor.entity";
import {Clinic} from "./entities/clinic.entity";
import {Speciality} from "./entities/speciality.entity";
import {Event} from "./entities/event.entity";

@Injectable()
export class DoctorsService {
    constructor(
        @InjectRepository(Doctor)
        private readonly doctorRepository: Repository<Doctor>,
        @InjectRepository(Clinic)
        private readonly clinicRepository: Repository<Clinic>,
        @InjectRepository(Speciality)
        private readonly specialityRepository: Repository<Speciality>,
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

    async findOne(id: string) {
        const doctor = await this.doctorRepository.findOne({
            where: { id: +id}
        });
        if (!doctor) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return doctor;
    }

    async create(createDoctor: CreateDoctor) {
        const speciality = await Promise.all(
            createDoctor.speciality.map(name => this.preloadFlavorByName(name)),
        );

        const doctor = this.doctorRepository.create({
            ...createDoctor,
            speciality,
        });
        return this.doctorRepository.save(doctor);
    }

    async update(id: string, updateDoctorDto: UpdateDoctorDto) {
        const speciality =
            updateDoctorDto.speciality &&
            (await Promise.all(
                updateDoctorDto.speciality.map(name => this.preloadFlavorByName(name)),
            ));

        const doctor = await this.doctorRepository.preload({
            id: +id,
            ...updateDoctorDto,
            speciality
        });
        if (!doctor) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return this.doctorRepository.save(doctor);
    }

    async remove(id: string) {
        const coffee = await this.findOne(id);
        return this.doctorRepository.remove(coffee);
    }

    private async preloadFlavorByName(name: string): Promise<Speciality> {
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
}