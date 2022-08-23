import { CreateCoffeeDtoDto} from "./create.dto";
import {PartialType} from "@nestjs/mapped-types";

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDtoDto) {}