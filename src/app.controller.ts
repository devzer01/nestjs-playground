import {Get, Controller, Render, UseGuards, Post, Request, Res, Session, Redirect} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import { Response } from 'express';


@Controller()
export class AppController {
    @Get()
    root(@Res() res: Response) {
        return res.render("home", {layout: "index", message: "foobar", })
    }

    @UseGuards(AuthGuard('local'))
    @Post('auth/login')
    @Redirect('http://localhost:3000/home/welcome', 301)
    async login(@Request() req: any, @Session() session: Record<string, any>,) {
        session["type"] = req.user.type;
        session["user"] = req.user.id;
        console.log(session)
        return req.user;
    }

    @Get('auth/login')
    async showLogin(@Res() res : Response) {
        return res.render("login", {layout: "index", message: "foobar", })
    }
}