import { Module } from '@nestjs/common';
import { TfSecurityCheckService } from './tf-security-check.service';
import { TfSecurityCheckController } from './tf-security-check.controller';

@Module({
  controllers: [TfSecurityCheckController],
  providers: [TfSecurityCheckService],
})
export class TfSecurityCheckModule {}
