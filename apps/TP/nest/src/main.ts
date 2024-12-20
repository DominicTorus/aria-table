import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import tracer from './tracer';
import * as session from 'express-session';
import { Transport } from '@nestjs/microservices';
async function bootstrap() {
 // await tracer.start();
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'Torus9x',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.enableCors();
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
 
  const options = new DocumentBuilder()
    .setTitle('Torus9.0.0')
    .setVersion('1.0')
    .addTag('TE')
    .addTag('Api')
    .build();
   
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: process.env.PO_PORT,
    },
  });
  await app.startAllMicroservices();
  await app.listen(3002,'0.0.0.0');
}
bootstrap();