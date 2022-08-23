import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import { PaginationQuery} from "./dto/pagination.dts";
import {CreateDoctor} from "./dto/create.dto";
import {DoctorsService} from "./doctors.service";


@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) {
    }

    @Get()
    findAll(@Query() paginationQuery: PaginationQuery) {
        const {limit, offset} = paginationQuery
        this.doctorsService.findAll(paginationQuery)

    }

    @Post("upload")
    uploadCoffee(@Body() createCoffeeDto : CreateDoctor) {
        return this.doctorsService.create(createCoffeeDto);
    }
}
