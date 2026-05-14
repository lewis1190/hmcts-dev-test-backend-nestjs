import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from 'node_modules/@nestjs/swagger/dist';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pipes Setup
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      transformOptions: {
        exposeUnsetFields: false
      }
    })
  );

  // CORS Setup
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HMCTS Dev Test Challenge API')
    .setDescription('API documentation for the HMCTS Dev Test Challenge project. This API provides endpoints for managing tasks with Firebase authentication.')
    .setVersion('1.0')
    .setContact(
      'Candidate Github',
      'https://github.com/lewis1190/hmcts-dev-test-backend-nestjs',
      'anonymous@fake.com',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'firebase-token',
    )
    .addTag('Tasks', 'Task management endpoints')
    .addTag('Health', 'Health check endpoints')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
