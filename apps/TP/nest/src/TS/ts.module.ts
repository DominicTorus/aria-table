import { Module } from "@nestjs/common";
import { TSService } from "./ts.service";
import { TSController } from "./ts.controller";
import { RedisService } from "src/redisService";
import { CommonService } from "src/commonService";
import { JwtService } from "@nestjs/jwt";
import { TeCommonService } from "src/TE/teCommonService";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";

@Module({
    imports: [ ],
    controllers: [TSController],
    providers: [TSService,RedisService,CommonService,RuleService,CodeService,JwtService,TeCommonService],
})
export class TSModule {}
