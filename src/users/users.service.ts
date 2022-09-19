import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../typeorm/User";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>) {}

    async findOne(username: string): Promise<User | null> {
        return this.userRepository.findOne({where: {username: username}});
    }

    async authenticate(username: string, password: string): Promise<User | null> {
        return this.userRepository.findOne({where : {username: username, password: password}})
    }
}