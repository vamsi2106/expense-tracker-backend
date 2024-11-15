import { INestApplication, ValidationPipe } from "@nestjs/common";
import cors from 'cors';
import { ErrorHandler } from "./middleware/error-handler";
import { setupSwagger } from "./swagger/swagger";
import AppLogger from "./logger/app-logger";

export default function Corebootstrap(app: INestApplication){
    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,               // Strip any properties that are not in the DTO
            forbidNonWhitelisted: true,    // Throw an error if extra properties are provided
            transform: true, 
        })
    )

    app.useGlobalFilters(new ErrorHandler(app.get(AppLogger)));
    setupSwagger(app);
}