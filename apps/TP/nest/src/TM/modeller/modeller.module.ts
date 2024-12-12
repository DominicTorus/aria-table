import { Module } from '@nestjs/common';
import { ModellerController } from './modeller.controller';
import { ModellerService } from './modeller.service';

import { ApiModule } from 'src/api.module';
import { CommonTmServices } from '../commonTmServices';

@Module({
  imports: [ApiModule],
  controllers: [ModellerController],
  providers: [ModellerService, CommonTmServices],
})
export class ModellerModule {}
