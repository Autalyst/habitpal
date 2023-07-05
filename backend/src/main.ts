import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './polyfill';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true, // strips out undefined variables
  }));
  await app.listen(3000);
}
bootstrap();
