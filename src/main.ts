import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigServices } from './config/appconfig.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const configService = new ConfigServices();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(5000, () => {
    console.log('server running at http://localhost:5000');
  });
}
bootstrap();
