import { Module } from '@nestjs/common';
import { TgUfAriaService } from './tg-uf-aria.service';
import { TgUfAriaController } from './tg-uf-aria.controller';
import { TG_CommonService } from '../tg-common/tg-common.service';
import { CommonService } from 'src/commonService';
import { RedisService } from 'src/redisService';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },})],
  controllers: [TgUfAriaController],
  providers: [TgUfAriaService,TG_CommonService,CommonService,JwtService,RedisService],
})
export class TgUfAriaModule {}
