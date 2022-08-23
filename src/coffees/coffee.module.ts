import { CoffeesController} from "./coffees.controller";
import { CoffeesService} from "./coffees.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import { Coffee} from "./entities/coffe.entity";
import { Module } from '@nestjs/common';
import {Flavor} from "./entities/flavor.entity";
import {Event} from "./entities/event.entity";

class MockCoffeeService {}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeesController],
    providers: [CoffeesService],
    exports: [CoffeesService]
})

export class CoffeeModule {}