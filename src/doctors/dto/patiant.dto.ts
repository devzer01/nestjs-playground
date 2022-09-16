import {IsNotEmpty} from "class-validator";
import {Column, PrimaryGeneratedColumn} from "typeorm";

export class PatientDto {

    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    public phone: string;

    @IsNotEmpty()
    public address: string

    @IsNotEmpty()
    public nic: string

    @IsNotEmpty()
    public password: string
}