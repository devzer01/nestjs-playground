import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import {MailService} from "./mail.service";

@Processor('email')
export class EmailService {
    constructor(private readonly mailService: MailService) { }

    @Process('send')
    handleTranscode(job: Job) {
        //console.log("at the queue processor");
        //console.log(job.data);
        const user = job.data.user;
        const token = job.data.user.token
        this.mailService.sendUserConfirmation(user, token).then((e) => console.log("Email Sent"));
    }
}