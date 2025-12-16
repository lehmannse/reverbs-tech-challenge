import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true
    }
  });

  // Optional global prefix for clarity
  // app.setGlobalPrefix('api');

  await app.listen(3000, '0.0.0.0');
}
bootstrap();


