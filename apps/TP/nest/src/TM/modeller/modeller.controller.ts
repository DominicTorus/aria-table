import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ModellerService } from './modeller.service';

@Controller('modeller')
export class ModellerController {
  constructor(private readonly modellerService: ModellerService) {}

  @Get('nodeinfo')
  async getJson(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ): Promise<any> {
    return await this.modellerService.getJson(query.redisKey);
  }

  @Get('afk')
  async getArtifactList(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    return await this.modellerService.getAFK(query.redisKey);
  }

  @Get('afvk')
  async getVersionList(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    return await this.modellerService.getAFVK(query.artifact, query.redisKey);
  }
  @Get('afkwithafvk')
  async getArtifactListWithVersion(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    return await this.modellerService.getAFKwithAFVK(query.redisKey);
  }

  @Post('nodeinfo')
  async saveJson(
    @Body() req: any,
    @Query(new ValidationPipe({ transform: true })) query: any,
  ): Promise<any> {
    return await this.modellerService.saveaWorkFlow(
      req,
      query.type,
      query.version,
      query.fabrics,
    );
  }
}
