import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigServices } from './config/appconfig.service';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './logger/globalExeption.filter';
import { AppLogger } from './logger/app-logger';
import { setupSwagger } from './swagger/swagger';

async function bootstrap() {
  const configService = new ConfigServices();
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Configure the global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               // Strip any properties that are not in the DTO
    forbidNonWhitelisted: true,    // Throw an error if extra properties are provided
    transform: true,               // Automatically transform incoming data to the correct types
  }));

  const appLogger = app.get(AppLogger);
  
  // Adding the GlobalExceptionFilter for better error handling
  app.useGlobalFilters(new GlobalExceptionFilter(appLogger));

  // Setting up Swagger
  setupSwagger(app); 

  const port = configService.getServicePort() || 5000;
  await app.listen(port, () => {
    appLogger.log(`Server running at http://localhost:${port}`);
    appLogger.log(`Swagger running on http://localhost:${port}/api/docs`); 
  });
}

bootstrap();
