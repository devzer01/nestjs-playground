import {CreateDoctor} from "./create.dto";
import {PartialType} from "@nestjs/mapped-types";

export class UpdateDoctorDto extends PartialType(CreateDoctor) {}