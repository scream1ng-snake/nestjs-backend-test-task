import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CORS_METHODS, CORS_ORIGIN, PORT } from './consts/consts';
import { ValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    "origin": CORS_ORIGIN,
    "methods": CORS_METHODS,
    "preflightContinue": false,
    "optionsSuccessStatus": 200
  });



  await app.listen(PORT, () => console.log("App started at ", PORT));
}
bootstrap();
