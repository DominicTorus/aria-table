import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { TgSecurityCheckService } from './tg-security-check.service';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { securityDto } from '../Dto/securityDto';
import { saveHandlerDto } from '../Dto/saveHandler';
import { uploadHandlerDto } from '../Dto/uploadHandler';

@ApiTags('TG')
@Controller('UF')
export class CgSecurityCheckController {
  constructor(private readonly appService: TgSecurityCheckService) {}

  @Post('commonDetails')
  @ApiResponse({ status: 200, description: 'Common Details Fetched' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiQuery({ name: 'ufKey', example: 'TGA:ABKUF:BUILD:ABC:mvp:bank:v2' })
  async commonDetails(@Body() body: any) {
    const { ufkey, componentName, controlName  } =
      body;
    return await this.appService.commonDetails(
      ufkey,
      componentName,
      controlName
      
    );
  }

  @Post('elementsFilter')
  // @ApiResponse({
  //   status: 200,
  //   description: 'code get Completed',
  //   isArray: true,
  // })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async elementsFilter(@Body() body: any) {
    const { key, group, control } = body;
    return await this.appService.elementsFilter(key, group, control);
  }

  @Post('getMapperDetails')
  @ApiResponse({ status: 200, description: 'Get Mapper Details Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiQuery({ name: 'ufKey', example: 'TGA:ABKUF:BUILD:ABC:mvp:bank:v2' })
  async getMapperDetails(@Body() body: any) {
    const { ufkey, componentId, controlId, category, bindtranValue, code } =
      body;
    return await this.appService.getMapperDetails(
      ufkey,
      componentId,
      controlId,
      category,
      bindtranValue,
      code,
    );
  }

  @Post('codeExecution')
  async codeExecution(@Body() body: any) {
    const { stringCode, params } = body;
    return await this.appService.codeExecution(stringCode, params);
  }

  @Post('code')
  // @ApiResponse({
  //   status: 200,
  //   description: 'code get Completed',
  //   isArray: true,
  // })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async codefilter(@Body() body: any) {
    const { key, groupId, controlId,event } = body;
    return await this.appService.codefilter(key, groupId, controlId,event);
  }

  @Get('dfKey')
  @ApiResponse({ status: 200, description: 'Get DFKey Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiQuery({ name: 'ufKey', example: 'TGA:ABKUF:BUILD:ABC:mvp:bank:v2' })
  async getDfkey(
    @Query('ufKey') ufKey: string,
    @Query('groupId') groupId: string,
  ) {
    const ufkey: string = ufKey;
    const groupid: string = groupId;
    return await this.appService.getDfkey(ufkey, groupid);
  }
  @Get('DataOrchestrator')
  @ApiResponse({
    status: 200,
    description: 'Data Orchestrator Completed',
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiQuery({ name: 'ufKey', example: 'TGA:ABKUF:BUILD:ABC:mvp:bank:v2' })
  @ApiQuery({ name: 'groupName', example: 'row1' })
  async dataOrchestrator(@Query() query: any) {
    const ufKey = query.ufKey;
    const groupName = query.groupName;
    return await this.appService.dataOrchestrator('', ufKey, groupName);
  }

  @Post('PaginationDataFilter')
  @ApiResponse({
    status: 200,
    description: 'Data PaginationDataFilter Completed',
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async paginationDataFilter(@Body() body: any) {
    const { key, data } = body;
    return await this.appService.paginationDataFilter(key, data);
  }

  @Post('AuthorizationCheck')
  @ApiResponse({ status: 201, description: 'Security Check Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async SFCheckScreen(@Body() body: securityDto, @Req() req: any) {
    const token: string = req.headers.authorization.split(' ')[1];
    const {
      key,
      nodeId,
      isTable,
    }: { key: string; nodeId?: string; isTable?: boolean } = body;
    return await this.appService.SFCheckScreen(key, token, nodeId, isTable);
  }

  @Post('setSaveHandlerData')
  @ApiResponse({ status: 201, description: 'SaveHandlerData Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async setSaveHandlerData(@Body() body: saveHandlerDto) {
    const { key, value, path } = body;
    return await this.appService.setSaveHandlerData(key, value, path);
  }

  @Post('uploadHandlerData')
  @ApiResponse({ status: 201, description: 'UploadHandlerData Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async uploadHandlerData(@Body() body: uploadHandlerDto) {
    const { key } = body;
    return await this.appService.uploadHandlerData(key);
  }

  @Post('InitiatePF')
  async InitiatePF(@Body() body: any, @Req() req): Promise<any> {
    const { key } = body;

    return await this.appService.InitiatePF(key);
  }

  @Post('getPFDetails')
  async getPFDetails(@Body() body: any): Promise<any> {
    const { isTable, key, groupId, controlId } = body;
    return await this.appService.getPFDetails(
      isTable,
      key,
      groupId,
      controlId,
    );
  }

  @Post('fetchActionDetails')
  async fetchActionDetails(@Body() body: any): Promise<any> {
    const { key, groupId, controlId } = body;
    return await this.appService.fetchActionDetails(
      key,
      groupId,
      controlId,
    );
  }

  @Post('fetchRuleDetails')
  async fetchRuleDetails(@Body() body: any): Promise<any> {
    const { key, groupId, controlId } = body;
    return await this.appService.fetchRuleDetails(key, groupId, controlId);
  }

  @Post('ifo')
  async ifo(@Body() body: any): Promise<any> {
    const { formData, key, controlId, isTable } = body;
    return await this.appService.ifo(formData, key, controlId, isTable);
  }
}
