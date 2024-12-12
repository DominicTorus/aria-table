import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { TmService } from './tm.service';

@Controller('tm')
export class TmController {
  constructor(private readonly tmService: TmService) {}

  @Get('customCodeExecute')
  async customCodeExecute(
    @Body() body,
    @Query(new ValidationPipe({ transform: true })) query: any,
  ): Promise<any> {
    return await this.tmService.customCodeExcute(body.code);
  }

  @Delete('catk')
  async deleteCATK(@Query(new ValidationPipe({ transform: true })) query: any) {
    return await this.tmService.deleteCATK(query.redisKey, query.ctk);
  }

  @Delete('agk')
  async deleteAGK(@Query(new ValidationPipe({ transform: true })) query: any) {
    return await this.tmService.deleteAGK(query.redisKey, query.ctk);
  }

  @Delete('afk')
  async deleteAFK(@Query(new ValidationPipe({ transform: true })) query: any) {
    return await this.tmService.deleteAFK(query.redisKey);
  }

  @Patch('renamekeys')
  async artifactNameEdit(@Body() body: any): Promise<any> {
    return await this.tmService.rename(body.oldKey, body.newKey);
  }

  @Post('customcodeobjects')
  async getPFobjects(@Body() input): Promise<any> {
    return await this.tmService.getPF(input);
  }

  @Post('errorlog')
  async handleErrorlog(
    @Body() req: any,
    @Query(new ValidationPipe({ transform: true })) query: any,
  ): Promise<any> {
    const { errObj, token, key, errorMessage, statusCode } = req;
    return await this.tmService.handleErroLog(
      errObj,
      token,
      key,
      errorMessage,
      statusCode,
    );
  }

  @Get(`getNodeList`)
  async getNodeList(@Query() query): Promise<any> {
    return await this.tmService.getNodeList(query.fabrics, query.redisKey);
  }

  @Patch('changeArtifactLock')
  async changeArtifactLock(@Body() body: any): Promise<any> {
    return await this.tmService.changeArtifactLock(body.data);
  }

  @Post('createArtifactInfo')
  async changeArtifactLockPost(
    @Body() body: any,
    @Query(new ValidationPipe({ transform: true })) query: any,
  ): Promise<any> {
    return await this.tmService.createArtifactInfo(
      body.client,
      body.type,
      body.key,
    );
  }

  @Post('getArtifactDetail')
  async getArtifactDetailList(@Body() data: any) {
    const { client, loginId, artifactType, fabric, catalog, artifactGrp } =
      data;
    return this.tmService.getRecentArtifactDetailList(
      loginId,
      artifactType,
      client,
      fabric,
      catalog,
      artifactGrp,
    );
  }

  @Post('allkeys')
  async getAllArtifacts(@Body() data: any) {
    return this.tmService.getAllArtifacts(data.redisKey, data?.stopAt);
  }

  @Get('catkwithafgk')
  async getCATKwithAFGK(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    return this.tmService.getCATKwithAFGK(query.fabric, query.clientCode);
  }

  @Get('afrgallery')
  async getCrkNodeData(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    return this.tmService.getCrkNodeData(query.redisKey);
  }

  @Post('codeExecute')
  async getProcess(@Body() input): Promise<any> {
    if (input.key && input.nodeName && input.code)
      return await this.tmService.getProcess(
        input.key,
        input.nodeName,
        input.code,
      );
    else if (input.code) {
      const data = await this.tmService.customCodeExcute(input.code);
      return {
        status: 201,
        data: data,
      };
    }
  }
}
