/* CoffeesService - FINAL CODE */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import { CreateCoffeeDtoDto} from "./dto/create.dto";
import { UpdateCoffeeDto} from "./dto/update.dto";
import {Coffee} from "./entities/coffe.entity";
import { Flavor } from './entities/flavor.entity';
import {importOrRequireFile} from "typeorm/util/ImportUtils";
import {PaginationQuery} from "./dto/pagination.dts";
import { Event} from "./entities/event.entity";

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection,
    ) {}

    findAll(paginationQuery: PaginationQuery) {
        const {limit, offset} = paginationQuery;
        return this.coffeeRepository.find({
            relations: {
                flavors: true,
            },
            skip: offset,
            take: limit
        });
    }

    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOne({
            where: { id: +id}
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDtoDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        );

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors,
        });
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors =
            updateCoffeeDto.flavors &&
            (await Promise.all(
                updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
            ));

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors,
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return this.coffeeRepository.save(coffee);
    }

    async remove(id: string) {
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        // @ts-ignore
        const existingFlavor = await this.flavorRepository.findOne({where: { name: name}})
        if (existingFlavor) {
            return existingFlavor;
        }
        // @ts-ignore
        return this.flavorRepository.create({ name });
    }

    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            coffee.recommendations++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffeeId: coffee.id };

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}