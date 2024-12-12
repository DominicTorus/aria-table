import { Module } from "@nestjs/common";
import { ApiController } from "./apiController";
import { ApiService } from "./apiService";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from './redisService';
import { MongoService } from "./mongoService";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonService } from "./commonService";
import { RuleService } from "./ruleService";
import { TeCommonService } from "./TE/teCommonService";
import { CodeService } from "./codeService";

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_URL),
        MongooseModule.forFeature([{ name: 'TLC', schema: {} }]),
    ],
    controllers: [ApiController],
    providers: [ApiService,JwtService,RedisService,MongoService,CommonService,JwtService,RuleService,TeCommonService,CodeService],
    exports:[ApiService]
})

    export class  ApiModule{}