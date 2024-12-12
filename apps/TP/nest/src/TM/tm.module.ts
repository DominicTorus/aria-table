import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiModule } from 'src/api.module';
import { CommonService } from 'src/commonService';
import { RedisService } from 'src/redisService';
import { CommonTmServices } from './commonTmServices';
import { ModellerModule } from './modeller/modeller.module';
import { ModellerService } from './modeller/modeller.service';
import { OrchestratorModule } from './orchestrator/orchestrator.module';
import { TmController } from './tm.controller';
import { TmService } from './tm.service';

@Module({
  imports: [OrchestratorModule, ModellerModule, ApiModule],
  controllers: [TmController],
  providers: [
    ModellerService,
    TmService,
    RedisService,
    CommonService,
    JwtService,
    CommonTmServices,
  ],
})
export class TmModule {}
