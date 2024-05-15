import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import config from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder().setTitle('Waymore Capital API').setDescription('Waymore Capital API').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/swagger', app, document);
  app.setGlobalPrefix('api');
  await app.listen(config.port);
}
bootstrap();
