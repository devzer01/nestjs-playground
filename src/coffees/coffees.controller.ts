import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {CoffeesService} from "./coffees.service";
import { PaginationQuery} from "./dto/pagination.dts";
import { CreateCoffeeDtoDto} from "./dto/create.dto";


@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeeService: CoffeesService) {
    }

    @Get()
    findAll(@Query() paginationQuery: PaginationQuery) {
        const {limit, offset} = paginationQuery
        this.coffeeService.findAll(paginationQuery)

    }

    @Post("upload")
    uploadCoffee(@Body() createCoffeeDtoDto : CreateCoffeeDtoDto) {
        return this.coffeeService.create(createCoffeeDtoDto);
    }
}
