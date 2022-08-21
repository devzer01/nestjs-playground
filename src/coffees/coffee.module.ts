import { CoffeesController} from "./coffees.controller";
import { CoffeesService} from "./coffees.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Coffee} from "./entities/coffe.eentity";
import { Module } from '@nestjs/common';



@Module({
    imports: [TypeOrmModule.forFeature([Coffee])],
    controllers: [CoffeesController],
    providers: [CoffeesService],
    exports: [CoffeesService]
})

export class CoffeeModule {}