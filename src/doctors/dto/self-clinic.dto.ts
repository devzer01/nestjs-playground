import {IsNotEmpty} from "class-validator";

export class SelfClinicDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly phone: string;

    @IsNotEmpty()
    readonly address: string

    @IsNotEmpty()
    readonly open: string

    @IsNotEmpty()
    readonly close: string

    @IsNotEmpty()
    readonly days: string[]

    @IsNotEmpty()
    readonly duration: number

    @IsNotEmpty()
    readonly doctor: string
}