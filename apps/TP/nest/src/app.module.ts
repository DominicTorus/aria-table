import {
  MiddlewareConsumer,
  Module,
  NestModule,  
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redisService';
import { TeModule } from './TE/te.module';

import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './TG/ExceptionFilter/exception.filter';
import { LoggerMiddleware } from './TG/Middleware/middleware';
import { keycloakModule } from './TM/keyCloak/keycloak.module';

import { TgModule } from './TG/tg.module';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { FILE_UPLOADS_DIR } from './fileUpload/constants';
import { TpModule } from './TP/tp.module';
import { CommonService } from './commonService';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from './mongoService';
import { TSModule } from './TS/ts.module';
import { TmModule } from './TM/tm.module'
import { ImageUploadController } from './fileUpload/upload.controller';
import { ImageUploadService } from './fileUpload/upload.service';
import { ApiModule } from './api.module';
import { TfModule } from './TF/tf.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL),
    MongooseModule.forFeature([{ name: 'TLC', schema: {} }]),
    TeModule,   
    TSModule,
    ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env` }),
    TgModule,

    keycloakModule,
    TmModule,    
    MulterModule.register({
      dest: FILE_UPLOADS_DIR,
      limits: {
        fileSize: 1000 * 1000 * 10,
      },
    }),

    TpModule,
    ApiModule,
    TfModule,
  ],
  controllers: [AppController, ImageUploadController ],
  providers: [
    AppService,
    RedisService,
    CommonService,
    JwtService,
    MongoService,
   
    ImageUploadService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
