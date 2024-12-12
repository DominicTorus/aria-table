import { Module } from "@nestjs/common";
import { RedisService } from "src/redisService";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtService } from "@nestjs/jwt";
import { ApiModule } from "src/api.module";

@Module({
  imports: [ApiModule],
  controllers: [AuthController],
  providers: [AuthService, RedisService, JwtService],
})
export class AuthModule {}
