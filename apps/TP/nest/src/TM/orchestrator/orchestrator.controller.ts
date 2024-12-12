import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';

@Controller('orchestrator')
export class OrchestratorController {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  @Get()
  async getJson(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ): Promise<any> {
    return await this.orchestratorService.getJson(
      query.redisKey,
      query.subflow,
    );
  }

  @Get('initiate')
  getIniateEventsData(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    return this.orchestratorService.getIniateEventsData(query.redisKey);
  }

  @Patch('eventSummaryAndNodeProperty')
  async getEventSummaryAndNodeProperty(@Body() req: any) {
    return await this.orchestratorService.getEventSummaryAndNodeProperty(
      req.nodes,
      req.oldSummary,
    );
  }

  @Post()
  async saveJson(
    @Body() req: any,
    @Query(new ValidationPipe({ transform: true })) query: any,
  ): Promise<any> {
    return await this.orchestratorService.saveaWorkFlow(req);
  }
  @Get('getdfo')
  async getdfo(@Query(new ValidationPipe({ transform: true })) query: any) {
    return await this.orchestratorService.getdfo(query.redisKey, query.subflow);
  }

  @Patch('mappedtoevents')
  async mappedToEvents(@Body() req: any) {
    return await this.orchestratorService.convertedForEvents(req.redisKey);
  }

  @Patch('updatetargetkeyevents')
  async updateTargetKeyOnEvents(@Body() req: any) {
    return await this.orchestratorService.updateTargetKeyOnEvents(
      req.poEdges,
      req.securityTarget,
    );
  }
  @Patch('updatetargetifoevents')
  async updateTargetIfoOnEvents(@Body() req: any) {
    return await this.orchestratorService.updateTargetIfoOnEvents(
      req.allNodes,
      req.securityTarget,
    );
  }
}
