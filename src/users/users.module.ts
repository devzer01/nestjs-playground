import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Doctor} from "../doctors/entities/doctor.entity";
import {Clinic} from "../doctors/entities/clinic.entity";
import {Speciality} from "../doctors/entities/speciality.entity";
import {User} from "../typeorm/User";
import {UserController} from "./user.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}