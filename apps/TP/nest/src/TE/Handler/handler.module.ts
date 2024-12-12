import { Module } from "@nestjs/common";
import { saveHandlerController } from "./handler.controller";
import { SavehandlerService } from "./handlerService";
import { CommonService } from "src/commonService";
import { RedisService } from "src/redisService";
import { TeCommonService } from "../teCommonService";
import { JwtService } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RuleService } from "src/ruleService";
import { LockService } from "src/lock.service";
import { SecurityService } from "src/securityService";
import { TeService } from "../te.service";
import { ApiService } from "src/apiService";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoService } from "src/mongoService";
import { CodeService } from "src/codeService";

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'TLC', schema: {} }]),
        ClientsModule.register([
        {
          name: 'PO',
          transport: Transport.TCP,
          options: { port: parseInt(process.env.PO_PORT) },
        },
      ])
    ],
    controllers: [saveHandlerController],
    providers: [SavehandlerService,CommonService,RedisService,TeService,TeCommonService,RuleService,JwtService,LockService,SecurityService,ApiService,MongoService,CodeService],
    exports: [],
})
export class HandlerModule {}