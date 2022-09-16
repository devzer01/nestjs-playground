import {IsNotEmpty} from "class-validator";

export class LogRequestDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly speciality: string[]
}