import {Flavor} from "../entities/flavor.entity";
import {IsNotEmpty} from "class-validator";

export class CreateCoffeeDtoDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly brand: string;

    @IsNotEmpty()
    readonly flavors :string[];
}