import {IsNotEmpty} from "class-validator";

export class CreateDoctor {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    readonly phone: string;

    @IsNotEmpty()
    readonly address: string

    @IsNotEmpty()
    readonly password: string

    @IsNotEmpty()
    readonly area: string
}