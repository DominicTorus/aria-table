import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { TpService } from './tp.service';
import { CustomException } from './customException';
import { CommonService } from 'src/commonService';

@Controller('tp')
export class TpController {
  constructor(
    private readonly tpservice: TpService,
    private readonly commonservice: CommonService,
  ) {}

  @Get('getClientTenant')
  async getAllClients(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { type } = query;
    return this.tpservice.getAllClientTenantList(type);
  }

  @Post('signin')
  async signinToTorus(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { client, role, username, password, type } = body;
    return this.tpservice.signIntoTorus(client, role, username, password, type);
  }

  @Get('userDetails')
  async getUserDetails(@Req() req: Request) {
    const { authorization }: any = req.headers;
    if (authorization) {
      const token = authorization.split(' ')[1];
      return this.tpservice.getUserDetails(token);
    } else {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register')
  async registerUsertoTorus(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const {
      client,
      username,
      firstname,
      lastname,
      email,
      mobile,
      password,
      type,
    } = body;
    return this.tpservice.registerToTorus(
      client,
      username,
      firstname,
      lastname,
      email,
      mobile,
      password,
      type,
    );
  }

  @Get('getTenantInfo')
  async getTenantInfo(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { tenant } = query;
    return await this.tpservice.getTenantProfile(tenant);
  }

  @Post('postTenantInfo')
  async postTenantInfo(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { tenant, data } = body;
    return await this.tpservice.postTenantProfile(tenant, data);
  }

  @Post('postTenantResource')
  async postTenantResource(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { tenant, data, resourceType } = body;
    return await this.tpservice.postTenantResource(tenant, data, resourceType);
  }

  @Get('getappgrouplist')
  async getAppGroupList(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { tenant } = query;
    return this.tpservice.getAppGroupList(tenant);
  }

  @Get('getapplist')
  async getAppList(@Query(new ValidationPipe({ transform: true })) query: any) {
    const { tenant, appGroup } = query;
    return this.tpservice.getAppList(tenant, appGroup);
  }

  @Delete('deleteAppGroup')
  async deleteAppGroup(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ): Promise<any> {
    const { appGroup, tenant } = query;
    return await this.tpservice.deleteAppGroup(appGroup, tenant);
  }

  @Post('getAppEnvironment')
  async getAppEnvironment(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { tenant, app } = body;
    return await this.tpservice.getAppEnvironment(tenant, app);
  }

  @Post('postAppEnvironment')
  async postAppEnvironment(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { tenant, data } = body;
    return await this.tpservice.postAppEnvironment(tenant, data);
  }

  @Post('postAppRequirement')
  async postAppRequirement(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ): Promise<any> {
    const { tenant, appGroup, app, reqObj, date } = body;
    return await this.tpservice.postAppRequirement(
      tenant,
      appGroup,
      app,
      reqObj,
      date,
    );
  }

  @Post('getAppRequirement')
  async getAppRequirement(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { tenant, appGroup, app } = body;
    return await this.tpservice.getAppRequirement(tenant, appGroup, app);
  }

  @Get('getAssemblerVersion')
  async getAssemblerVersion(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { key } = query;
    return await this.tpservice.getAssemblerVersion(key);
  }

  @Get('getAssemblerData')
  async getAssemblerData(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { key } = query;
    return await this.tpservice.getAssemblerData(key);
  }

  @Post('saveAssemblerData')
  async saveAssemblerData(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { key, data } = body;
    return await this.tpservice.saveAssemblerData(key, data);
  }

  @Post('updateAssemblerData')
  async updateAssemblerData(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { key, data } = body;
    return await this.tpservice.updateAssemblerData(key, data);
  }

  @Get('getORPGroupData')
  async getORPData(@Query(new ValidationPipe({ transform: true })) query: any) {
    const { tenant, group } = query;
    return this.tpservice.getORPGroupData(tenant, group);
  }

  @Post('updateToken')
  async updateToken(@Body(new ValidationPipe({ transform: true })) body: any) {
    const { token, ORPData } = body;
    return this.tpservice.updateTokenWithORP(token, ORPData);
  }

  @Get('checkUser')
  async checkUser(@Req() req: Request) {
    const { authorization }: any = req.headers;
    if (authorization) {
      const token = authorization.split(' ')[1];
      return this.tpservice.checkUser(token);
    } else {
      throw new CustomException('Token not found', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('getOrgGrpFromTSf')
  async gettsforganisation(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { tenant } = query;
    return this.tpservice.getorggrp(tenant);
  }

  @Get('getOrgFromTSF')
  async getorgFromTSF(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { tenant, orgGrpCode } = query;
    return this.tpservice.getorgFromTSF(tenant, orgGrpCode);
  }

  @Get('getRGfromTSF')
  async getRGFromTSF(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { tenant, orgGrpCode, orgCode } = query;
    return this.tpservice.getRGFromTSF(tenant, orgGrpCode, orgCode);
  }

  @Get('getRoleFromTSF')
  async getRoleFromTSF(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { tenant, orgGrpCode, orgCode, roleGrpCode } = query;
    return this.tpservice.getRoleFromTSF(
      tenant,
      orgGrpCode,
      orgCode,
      roleGrpCode,
    );
  }

  @Get('getPSGfromTSF')
  async getPSGfromTSF(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { tenant, orgGrpCode, orgCode, roleGrpCode, roleCode } = query;
    return this.tpservice.getPSGFromTSF(
      tenant,
      orgGrpCode,
      orgCode,
      roleGrpCode,
      roleCode,
    );
  }

  @Get('getPSfromTSF')
  asyncgetPSfromTSF(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { tenant, orgGrpCode, orgCode, roleGrpCode, roleCode, psGrpCode } =
      query;
    return this.tpservice.getPSFromTSF(
      tenant,
      orgGrpCode,
      orgCode,
      roleGrpCode,
      roleCode,
      psGrpCode,
    );
  }

  @Get('getTenantAgApp')
  async getTenantAgApp(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { orgGrpCode, orgCode, roleGrpCode, roleCode, psGrpCode, psCode } =
      query;
    return this.tpservice.getTenantAgApp(
      orgGrpCode,
      orgCode,
      roleGrpCode,
      roleCode,
      psGrpCode,
      psCode,
    );
  }
  @Get('getPortal')
  async getPortal(@Req() req: Request) {
    const { authorization }: any = req.headers;
    if (authorization) {
      const token = authorization.split(' ')[1];
      return this.tpservice.getPortal(token);
    } else {
      throw new CustomException('Token not found', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('tpErrorLogs')
  async tpErrorLogs(@Body(new ValidationPipe({ transform: true })) body: any) {
    const { token, statusCode, errorDetails, key } = body;
    return this.commonservice.commonErrorLogs(
      {
        tname: 'TP',
        errType: 'Fatal',
        errGrp: 'Technincal',
        errCode: 'TP004',
      },
      token,
      key ?? '',
      errorDetails,
      statusCode,
    );
  }

  @Get('getJsonValue')
  async getValueFromRedis(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { key } = query;
    return this.tpservice.getValueFromRedis(key);
  }

  @Post('setJsonValue')
  async postValueinRedis(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { key, data } = body;
    return this.tpservice.postValueinRedis(key, data);
  }

  @Post('getAllKeys')
  async getAllKeys(@Body() data: any) {
    const { keyPrefix } = data;
    return this.tpservice.getAllKeys(keyPrefix);
  }
  @Get('getUserList')
  async getUserList(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { client, type } = query;
    return this.tpservice.getUserList(client, type);
  }

  @Get('AuthorizedTenantDetails')
  async getAuthorizedTenantDetails(@Req() req: Request) {
    const { authorization }: any = req.headers;

    if (authorization) {
      const token = authorization.split(' ')[1];
      return this.tpservice.getAuthorizedTenantDetails(token);
    } else {
      throw new CustomException('Token not found', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('getOrpsInfo')
  async getOrpsInfo(@Query() query: any) {
    const { client } = query;
    return this.tpservice.getOrpsInfo(client);
  }

  @Post('getArtifactDetail')
  async getArtifactDetailList(@Body() data: any) {
    const {
      client,
      loginId,
      artifactType,
      fabric,
      catalog,
      artifactGrp,
      sortOrder,
    } = data;
    return this.tpservice.getRecentArtifactDetailList(
      loginId,
      artifactType,
      client,
      fabric,
      catalog,
      artifactGrp,
      sortOrder,
    );
  }

  @Post('pushArtifact')
  async pushArtifact(@Body() data: any) {
    const { artifactKeyPrefix, loginId, tenant, app, fabric } = data;
    return this.tpservice.pushArtifact(
      artifactKeyPrefix,
      loginId,
      tenant,
      app,
      fabric,
    );
  }

  @Post('getAllCatalogs')
  async getAllCatalogs(@Body() body: any) {
    const { artifactType } = body;
    return this.tpservice.getAllCatalogs(artifactType);
  }

  @Post('getAllArtifactGrp')
  async getAllArtifactGrp(@Body() body: any) {
    const { artifactType, fabric, catalog } = body;
    return this.tpservice.getArtifactGrp(artifactType, fabric, catalog);
  }

  @Post('getArtifactRelatedToBuild')
  async getArtifactRelatedToBuild(@Body() body: any) {
    const { tenant, appGrp , app } = body;
    return this.tpservice.getArtifactRelatedToBuild(tenant, appGrp, app);
  }

  @Post('renameArtifact')
  async renameArtifact(@Body() body: any) {
    const { artifactType, fabric, catalog, artifactGrp, oldName, newName } =
      body;
    return this.tpservice.renameArtifact(
      artifactType,
      fabric,
      catalog,
      artifactGrp,
      oldName,
      newName,
    );
  }

  @Post('moveArtifact')
  async moveArtifact(@Body() body: any) {
    const { sourceKeyPrefix, targetKeyPrefix, artifactName, version } = body;
    return this.tpservice.moveArtifact(
      sourceKeyPrefix,
      targetKeyPrefix,
      artifactName,
      version,
    );
  }

  @Post('shareArtifact')
  async shareArtifact(@Body() body: any) {
    const {
      loginId,
      artifactType,
      fabric,
      catalog,
      artifactGrp,
      artifactName,
      version,
      shareTo,
      accessType,
    } = body;
    return this.tpservice.shareArtifact(
      loginId,
      artifactType,
      fabric,
      catalog,
      artifactGrp,
      artifactName,
      version,
      shareTo,
      accessType,
    );
  }

  @Post('deleteArtifact')
  async deleteArtifact(@Body() body: any) {
    const {
      loginId,
      artifactType,
      fabric,
      catalog,
      artifactGrp,
      artifactName,
      version,
    } = body;
    return this.tpservice.deleteArtifact(
      loginId,
      artifactType,
      fabric,
      catalog,
      artifactGrp,
      artifactName,
      version,
    );
  }

  @Post('pinArtifact')
  async pinArtifact(@Body() body: any) {
    const { loginId, artifactKey } = body;
    return this.tpservice.pinArtifact(loginId, artifactKey);
  }

  @Post('unPinArtifact')
  async unPinArtifact(@Body() body: any) {
    const { loginId, artifactKey } = body;
    return this.tpservice.unpinArtifact(loginId, artifactKey);
  }

  @Get('getSecurityTemplateData')
  async getSecurityTemplateData(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { tenant } = query;
    return await this.tpservice.getSecurityTemplateData(tenant);
  }

  @Post('postSecurityTemplateData')
  async postSecurityTemplateData(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { tenant, data } = body;
    return await this.tpservice.postSecurityTemplateData(tenant, data);
  }

  @Get('getAccessProfiles')
  async getAccessProfiles(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { tenant } = query;
    return await this.tpservice.getAccessProfiles(tenant);
  }

  @Post('postUserList')
  async postUserList(@Body(new ValidationPipe({ transform: true })) body: any) {
    const { tenant, data } = body;
    return await this.tpservice.postUserList(tenant, data);
  }

  @Post('pushArtifactToBuild')
  async pushArtifactToBuild(@Body() data: any) {
    const { artifactKeyPrefix, loginId, tenant, appGrp, app, version } = data;
    return this.tpservice.pushArtifactToBuild(
      artifactKeyPrefix,
      loginId,
      tenant,
      appGrp,
      app,
      version,
    );
  }

  @Post('post-tenant-resource')
  async postNewTenantResource(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { tenant, data, resourceType } = body;
    return await this.tpservice.postNewTenantResource(
      tenant,
      data,
      resourceType,
    );
  }

  @Get('get-tenant-organization-matrix')
  async getTenantOrganizationMatrix(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { tenant } = query;
    return await this.tpservice.getTenantOrganizationMatrix(tenant);
  }

  @Get('get-app-env')
  async getAppEnv(@Query(new ValidationPipe({ transform: true })) query: any) {
    const { tenant } = query;
    return await this.tpservice.getAppEnv(tenant);
  }

  @Post('post-app-env')
  async postAppEnv(@Body(new ValidationPipe({ transform: true })) body: any) {
    const { tenant, data } = body;
    return await this.tpservice.potAppEnv(tenant, data);
  }

  @Get('get-client-profile')
  async getClientProfile(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { clientCode } = query;
    return await this.tpservice.getClientProfile(clientCode);
  }

  @Post('post-client-profile')
  async PostClientProfile(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { clientCode, data } = body;
    return await this.tpservice.PostClientProfile(clientCode, data);
  }

  @Get('myAccount-for-client')
  async MyAccountForClient(@Req() req: Request) {
    const { authorization }: any = req.headers;
    if (authorization) {
      const token = authorization.split(' ')[1];
      return this.tpservice.MyAccountForClient(token);
    } else {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('updateMyAccount')
  async updateMyAccount(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { clientCode, data } = body;
    return await this.tpservice.updateMyAccount(clientCode, data);
  }

  @Post('client-user-addition')
  async clientUserAddition(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { clientCode, data } = body;
    return await this.tpservice.clientUserAddition(clientCode, data);
  }

  @Post('get-dynamic-tenantcode')
  async getDynamicTenantCode(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { clientCode , tenantName , Logo } = body;
    return await this.tpservice.getDynamicTenantCode(clientCode , tenantName , Logo);
  }

  @Post('post-client-user-roles')
  async postClientUserRoles(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ){
    const { clientCode , roles } = body;
    return await this.tpservice.postClientUserRoles(clientCode , roles)
  }

}
