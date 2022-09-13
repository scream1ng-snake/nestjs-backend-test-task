import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT;

  const config = new DocumentBuilder()
    .setTitle('Test CRUD documentacion')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);


  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser());
  app.enableCors({
    "origin": process.env.CORS_ORIGIN,
    "methods": process.env.CORS_METHODS,
    "preflightContinue": false,
    "optionsSuccessStatus": 200
  });



  await app.listen(PORT, () => console.log("App started at ", PORT));
}
bootstrap();
