import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const corsOrigins = process.env.CORS_ORIGINS?.split(',') ?? ['*'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`NestJS API running on port ${port}`);
}
bootstrap().catch((err) => {
  console.error('Failed to bootstrap NestJS app:', err);
});
