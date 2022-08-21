import {CreateCoffeeDto} from "./CreateDto";
import {PartialType} from "@nestjs/mapped-types";

export class UpdateCoffee extends PartialType(CreateCoffeeDto) {}