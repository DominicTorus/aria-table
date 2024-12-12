import { Module } from '@nestjs/common';
import { TfService } from './tf.service';
import { TfController } from './tf.controller';
import { CommonService } from 'src/commonService';
import { TF_CommonService } from './tf.common.service';
import { RedisService } from 'src/redisService';
import { JwtService } from '@nestjs/jwt';
import { TfUfGluestacksService } from './tf-uf-gluestacks/tf-uf-gluestacks.service';
import { TFUtilServices } from './utils/utils';
import { TfSecurityCheckService } from './tf-security-check/tf-security-check/tf-security-check.service';
import { JwtServices } from 'src/jwt.services';
import { TG_CommonService } from 'src/TG/tg-common/tg-common.service';

@Module({
  controllers: [TfController],
  providers: [JwtService, JwtServices,TfService, CommonService, TF_CommonService, RedisService
              ,TfUfGluestacksService, TfSecurityCheckService, TFUtilServices, TG_CommonService],
})
export class TfModule {}
