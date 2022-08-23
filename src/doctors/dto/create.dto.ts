import {IsNotEmpty} from "class-validator";

export class CreateDoctor {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly speciality: string[]
}