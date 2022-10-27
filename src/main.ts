import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT ? Number(process.env.PORT) : 4030;
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: port,
    },
  });
  app.startAllMicroservices();
  await app.listen(3030);
  console.info('Microservice perfil-deportivo listening on port:', port);
  app.useGlobalPipes(new ValidationPipe());
}
bootstrap();
