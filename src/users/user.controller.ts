import {Controller, Get, Param, Redirect, Res} from "@nestjs/common";
import {Repository} from "typeorm";
import {User} from "../typeorm/User";
import {InjectRepository} from "@nestjs/typeorm";
import { Request } from 'express';
import {Args, Mutation} from "@nestjs/graphql";

@Controller("auth")
export class UserController {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    @Get("confirm/:token")
    @Redirect('http://localhost:3000/home/welcome', 301)
    verifyEmail(@Param("token") token: string, @Res() res: Request) {
        console.log("confirm called")
        console.log(token);
        const user = this.userRepository.findOne({where: {token: token}});
        console.log("user promise")
        user.then((u) => console.log(u));
        return res.res?.redirect("/home/welcome");
    }
}