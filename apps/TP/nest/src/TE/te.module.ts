import { MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { TeController } from './te.controller';
import { RedisService } from 'src/redisService';
import { AuthMiddleware } from './Middleware/auth.middleware';
import { TeCommonService } from './teCommonService';
import { TeService } from './te.service';
import { CommonService } from 'src/commonService';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule } from 'src/api.module';
import { LockService } from 'src/lock.service';
import { HandlerModule } from './Handler/handler.module';
import { RuleService } from 'src/ruleService';
import { SecurityService } from 'src/securityService';
import { ApiService } from 'src/apiService';
import { MongoService } from 'src/mongoService';
import { CodeService } from 'src/codeService';

@Module({
  imports: [
    HandlerModule,     
    MongooseModule.forFeature([{ name: process.env.COLLECTION_NAME, schema: {} }]),
    ScheduleModule.forRoot(),  
    ClientsModule.register([
      {
        name: 'PO',
        transport: Transport.TCP,
        options: { port: parseInt(process.env.PO_PORT) },
      },
    ]), 
    ApiModule
  ],
  controllers: [TeController],
  providers: [RedisService,CommonService,TeCommonService,TeService,JwtService,SecurityService,RuleService,LockService,ApiService,MongoService,CodeService],
})

export class TeModule implements NestModule 
{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('te');    
  }  
}



