import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await await app.listen(3005, '0.0.0.0');
  console.log('Backend running on http://localhost:3005');
}
void bootstrap();
