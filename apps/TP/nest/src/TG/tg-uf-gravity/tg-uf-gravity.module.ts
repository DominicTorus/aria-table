import { Module } from '@nestjs/common';
import { TG_CommonService } from '../tg-common/tg-common.service';
import { CommonService } from 'src/commonService';
import { RedisService } from 'src/redisService';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { TgUfGravityController } from './tg-uf-gravity.controller';
import { TgUfGravityService } from './tg-uf-gravity.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [TgUfGravityController],
  providers: [
    TgUfGravityService,
    TG_CommonService,
    CommonService,
    JwtService,
    RedisService,
  ],
})
export class TgUfGravityModule {}
