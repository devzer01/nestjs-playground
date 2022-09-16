import { CoffeesController} from "./coffees.controller";
import { CoffeesService} from "./coffees.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import { Coffee} from "./entities/coffe.entity";
import { Module } from '@nestjs/common';
import {Flavor} from "./entities/flavor.entity";
import {Event} from "./entities/event.entity";
import { EmailModule } from "../email/email.module"

class MockCoffeeService {}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), EmailModule],
    controllers: [CoffeesController],
    providers: [CoffeesService],
    exports: [CoffeesService]
})

export class CoffeeModule {}