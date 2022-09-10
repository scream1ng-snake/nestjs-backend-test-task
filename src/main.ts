import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
  const PORT = 5000
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    "origin": "*",
    "methods": "GET,PUT,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 200
  });



  await app.listen(PORT, () => console.log("App started at ", PORT));
}
bootstrap();
