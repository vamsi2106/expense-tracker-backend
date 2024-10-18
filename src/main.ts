import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigServices } from './config/appconfig.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './logger/globalExeption.filter';
import { AppLogger } from './logger/app-logger';

async function bootstrap() {
  
  const configService = new ConfigServices();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  let appLogger = app.get(AppLogger);
  app.useGlobalFilters(new GlobalExceptionFilter(appLogger));
  await app.listen(5000, () => {
    console.log('server running at http://localhost:5000');
  });
}
bootstrap();
