import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
 
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API documentation of e-commerce website')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('e-commerce')
    .build();
 
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}