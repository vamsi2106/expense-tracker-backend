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
  app.useGlobalPipes(new ValidationPipe());
  
  const appLogger = app.get(AppLogger);
  app.useGlobalFilters(new GlobalExceptionFilter(appLogger));

  // Integrating Swagger
  setupSwagger(app); // Calling the setupSwagger function after creating the app
  
  const port = configService.getServicePort() || 5000;
  await app.listen(port, () => {
    appLogger.log(`Server running at http://localhost:${port}`);
    appLogger.log(`Swagger running on http://localhost:${port}/api/docs`); // Updated Swagger URL
  });
}

bootstrap();
