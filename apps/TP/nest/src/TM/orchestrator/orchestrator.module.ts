import { Module } from '@nestjs/common';
import { RedisService } from 'src/redisService';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorService } from './orchestrator.service';

import { CommonTmServices } from '../commonTmServices';

import { ApiModule } from 'src/api.module';

@Module({
  imports: [ApiModule],
  controllers: [OrchestratorController],
  providers: [OrchestratorService, RedisService, CommonTmServices],
})
export class OrchestratorModule {}
