import { SessionEntity, UserEntity} from 'nestjs-session-store';
import {Entity} from "typeorm";

@Entity()
export class Session implements SessionEntity {
    sid: string;
    expiresAt: number;
    id: string;
    authorize: string;
    passport: string;
    cookie: string;
    user: UserEntity;
}