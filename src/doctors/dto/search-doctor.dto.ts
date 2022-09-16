import {IsNotEmpty} from "class-validator";

export class SearchDoctorDto {
    @IsNotEmpty()
    readonly query: string;
}