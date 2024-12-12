import { Module } from '@nestjs/common';
import { TgService } from './tg.service';
import { TgController } from './tg.controller';
import { TgCommonModule } from './tg-common/tg-common.module';
import { TG_API_JestModule } from './tg-api-jest/cg-api-jest.module';
import { TgDfModule } from './tg-df/tg-df.module';
import { TgUfModule } from './tg-uf/tg-uf.module';
import { TgSecurityCheckModule } from './tg-security-check/tg-security-check.module';
import { ConfigModule } from '@nestjs/config';
import { TgDfService } from './tg-df/tg-df.service';
import { RedisService } from 'src/redisService';
import { TgUfService } from './tg-uf/tg-uf.service';
import { JwtServices } from 'src/jwt.services';
import { JwtModule } from '@nestjs/jwt';
import { CommonService } from 'src/commonService';
import { TgUfAriaModule } from '../TG/tg-uf-aria/tg-uf-aria.module';
import { TgUfAriaService } from './tg-uf-aria/tg-uf-aria.service';
import { TgUfGravityService } from './tg-uf-gravity/tg-uf-gravity.service';
import { ApiModule } from 'src/api.module';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env` }),
    TgCommonModule,
    TG_API_JestModule,
    TgUfModule,
    TgDfModule,
    TgUfAriaModule,
    TgSecurityCheckModule,
    ApiModule
  ],
  controllers: [TgController],
  providers: [
    TgUfGravityService,
    TgService,
    TgDfService,
    TgUfService,
    TgUfAriaService,
    RedisService,
    CommonService,
    JwtServices,
  ],
})
export class TgModule {}
