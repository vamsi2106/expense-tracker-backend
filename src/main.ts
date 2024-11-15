import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './core/logger/globalExeption.filter';
import AppLogger from './core/logger/app-logger';
import { setupSwagger } from './core/swagger/swagger';
import { AppConfigService } from './config/appConfig.services';
import Corebootstrap from './core/bootstrap';
import { ResponseMessages } from './common/messages';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule),
        configObj = app.get(AppConfigService),
        appConfig = configObj.get('app'),
        {port} = appConfig;
  
  let logger  = new Logger();

//   app.enableCors();

//  // Configure the global validation pipe
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,               // Strip any properties that are not in the DTO
//     forbidNonWhitelisted: true,    // Throw an error if extra properties are provided
//     transform: true,               // Automatically transform incoming data to the correct types
//   }));

  // const appLogger = app.get(AppLogger);
  
  // // Adding the GlobalExceptionFilter for better error handling
  // app.useGlobalFilters(new GlobalExceptionFilter(appLogger));

  // // Setting up Swagger
  // setupSwagger(app); 

  // await app.listen(port, () => {
  //   logger.log(`Server running at http://localhost:${port}`);
  //   logger.log(`Swagger running on http://localhost:${port}/api/docs`); 
  // });try {
		/* core bootstrap config, environment, pipe, guards, intereceptors etc...*/
		try{
    Corebootstrap(app);
		await app.listen(port, async () => {
			logger.log(ResponseMessages.S1, 200);
		});
	} catch (err) {
		logger.error(err.message, 500);
	}
}

bootstrap();
