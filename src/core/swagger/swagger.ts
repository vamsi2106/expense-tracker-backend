import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
 
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Expense Tracker')
    .setDescription('API documentation of expense tracker website')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Expense Tracker')
    .build();
 
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}