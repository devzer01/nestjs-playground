import {IsNotEmpty} from "class-validator";

export class ClinicDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    readonly phone: string;

    @IsNotEmpty()
    readonly address: string

    @IsNotEmpty()
    readonly open: number

    @IsNotEmpty()
    readonly close: number

    @IsNotEmpty()
    readonly password: string

    @IsNotEmpty()
    readonly days: number[]

    @IsNotEmpty()
    readonly duration: number
}