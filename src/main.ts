if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  console.log('Development mode ====>>>>');
  require('module-alias/register');
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const APP_PORT = process.env.APP_PORT || 3000;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS Prisma')
    .setDescription('NestJS Prisma API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(APP_PORT);
  console.log(`Application is running on: ${APP_PORT}`);
}
bootstrap();
