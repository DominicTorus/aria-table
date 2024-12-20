import { Module } from '@nestjs/common';
import { KeycloakController } from './keycloak.controller';
import { KeycloakService } from './keycloak.service';
import { DatabaseService } from 'src/database.service';
import { RedisService } from 'src/redisService';
import { ApiModule } from 'src/api.module';

@Module({
  imports: [ApiModule],
  controllers: [KeycloakController],
  providers: [KeycloakService, DatabaseService , RedisService],
})
export class keycloakModule {}
