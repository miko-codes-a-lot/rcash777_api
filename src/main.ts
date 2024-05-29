import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import config from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Waymore Capital API')
    .setDescription('Waymore Capital API. [Get JSON](/api/swagger-json)')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/swagger', app, document);

  app.enableCors({
    allowedHeaders: [
      'cache-control',
      'content-language',
      'content-type',
      'expires',
      'last-modified',
      'pragma',
    ],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
    origin: true,
    credentials: true,
    maxAge: 90,
  });

  await app.listen(config.port);
}

bootstrap();
