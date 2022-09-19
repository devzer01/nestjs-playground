import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeModule} from "./coffees/coffee.module";
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {SpecialityService} from "./doctors/speciality.service";
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from './email/email.module';
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import {join} from "path";
import { HomeModule } from './home/home.module';


@Module({
  imports: [
      MailerModule.forRoot({
        transport: {
          host: 'smtp.gmail.com',
          secure: true,
          port: 465,
          auth: {
            user: 'nayana@corp-gems.com',
            pass: 'cpfqoszqixkvvjkv',
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        template: {
          dir: join(__dirname, '../../views'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MongooseModule.forRoot('mongodb://localhost/nest'),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'rads',
      password: 'rads',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CoffeeModule,
    DoctorsModule,
    PatientsModule,
    UsersModule,
    AuthModule,
    EmailModule,
    HomeModule,
  ],
  providers: [AppController],
  controllers: [AppController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
  }
}
