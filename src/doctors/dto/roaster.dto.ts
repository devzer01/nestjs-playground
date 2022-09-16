import {IsNotEmpty} from "class-validator";

export class RoasterDTO {
    @IsNotEmpty()
    readonly doctor: number;

    @IsNotEmpty()
    readonly clinic: number;

    @IsNotEmpty()
    readonly open: number

    @IsNotEmpty()
    readonly close: number

    @IsNotEmpty()
    readonly days: number[]

    @IsNotEmpty()
    readonly duration: number
}