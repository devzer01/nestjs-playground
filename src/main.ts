import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
const hbs = require('hbs');
const Handlebars = require('handlebars');

const moment = require("moment")

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {logger: ['verbose']});
  app.useGlobalPipes(new ValidationPipe(
      {whitelist: true, transform: true, forbidNonWhitelisted: true, disableErrorMessages: true,
        transformOptions: {
          enableImplicitConversion: true, // allow conversion underneath
        },}
  ));
    app.useStaticAssets(join(__dirname, '..', 'public'), {
        prefix: '/public/',
    });
  app.useStaticAssets(join(__dirname, '..', 'views'));
  app.set('view engine', 'hbs');

  //   hbs.engine({
  //     extname: 'hbs',
  //     defaultLayout: 'index',
  //     layoutsDir: join(__dirname, '..', 'views/layouts')
  // });
  hbs.registerHelper('formatDate', function (datetime: any, format: any) {
      return moment(datetime).format(format);
  });
  app.setViewEngine("hbs");




    app.use(
        session({
            secret: 'my-secret',
            resave: false,
            saveUninitialized: false,
        }),
    );

  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();

export = session

declare module 'express-session' {
    interface SessionData {
        views: number;
    }
}