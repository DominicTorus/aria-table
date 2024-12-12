import {  BadGatewayException, BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Post, Query, Req, ValidationPipe } from '@nestjs/common';
import { RedisService } from "src/redisService";
import { MongoService } from "./mongoService";
import { WriteMDdto } from "src/writeMDdto";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ReadMDdto } from "src/readMDdto";
import { ApiService } from "./apiService";
import { deleteAPIDTO, readAPIDTO, setAPIDTO, updateAPIDTO } from "./TE/Dto/input";


@ApiTags('Api')
@Controller('api')
export class ApiController {
    constructor(private readonly redisService:RedisService,private readonly mongoService:MongoService,
      private readonly apiService:ApiService
    ) {}        
  @ApiBody({
    description: 'Input parameters',
    type: setAPIDTO,
  })
  @Post('writekey')
  async writeAPI(@Body() input:WriteMDdto){  
    if(input.SOURCE== 'redis' && input.TARGET== 'redis'){
      return await this.apiService.writeMDK(input)
    }else if(input.SOURCE== 'mongo' && input.TARGET== 'mongo'){
      return await this.mongoService.setKey(input)
    }else if(input.SOURCE== 'redis' && input.TARGET== 'mongo'){
      return await this.apiService.getRedisTosetMongo(input)
    }else if(input.SOURCE== 'mongo' && input.TARGET== 'redis'){
      return await this.apiService.getMongoTosetRedis(input)
    }
    else{
      throw new BadGatewayException('Source/Target Not Found');
    }
  }
  @ApiBody({
    description: 'Input parameters',
    type: updateAPIDTO,
  })
  @Post('updatekey')
  async updateAPI(@Body() input: WriteMDdto) {
    if (input.SOURCE == 'redis' && input.TARGET == 'redis') {
      return await this.apiService.writeMDK(input)
    }else if (input.SOURCE == 'mongo' && input.TARGET == 'mongo') {
      return await this.mongoService.updateKey(input)
    }else if(input.SOURCE== 'redis' && input.TARGET== 'mongo'){
      return await this.apiService.updateRedisToMongo(input)
    }else if(input.SOURCE== 'mongo' && input.TARGET== 'redis'){
      return await this.apiService.updateMongoToRedis(input)
    }
    else {
      throw new BadGatewayException('Source/Target Not Found');
    }
  }


  @ApiBody({
    description: 'Input parameters',
    type: readAPIDTO,
  })
  @Post('readkey')
  async readkey(@Body() input: ReadMDdto) {
    if (input.SOURCE == 'redis' && input.TARGET == 'redis') {
      return await this.apiService.readKeys(input);
    }else if (input.SOURCE == 'mongo' && input.TARGET == 'mongo') {
      return await this.mongoService.getKeys(input);
    }
    else {
      throw new BadGatewayException('Source/Target Not Found');
    }
  }

@Post('mongoAfr')
async getRAndSetMAFR(@Body() input:any){
  return await this.apiService.getRAndSetMAFR(input)
}

@Post('redisAfr')
async getMAndSetRAFR(@Body() input:any){
  return await this.apiService.getMAndSetRAFR(input)
}


  // @ApiBody({
  //   description: 'Input parameters',
  //   type: deleteAPIDTO,
  // })
  // @Delete('deletekey')
  // async deleteKey(@Body() input: ReadMDdto) {
  //   if (input.SOURCE == 'redis' && input.TARGET == 'redis') {
  //     return await this.apiService.deleteAPI(input)
  //   } else if (input.SOURCE == 'mongo' && input.TARGET == 'mongo') {
  //     return await this.mongoService.deleteKey(input)
  //   }else if(input.SOURCE== 'redis' && input.TARGET== 'mongo'){

  //   }else if(input.SOURCE== 'mongo' && input.TARGET== 'redis'){

  //   } 
  //   else {
  //     throw new BadGatewayException('Source/Target Not Found');
  //   }
  // }


  @Post('transferData')
  async transferData(@Body() input: any) {
    return await this.apiService.transferData(input.sourceKey, input.destinationKey, input.action)
  }
 
  @Post('renamekey')
  async renamekey(@Body() input: any) {
    return await this.apiService.renamekey(input.oldKey, input.newKey)
  }

  @Post('pagination')
  async getpagination(@Body() input: any) {
    if(input.key && input.count)
    return await this.apiService.getpagination(input.key,input.page,input.count,input.filterDetails)
  else
  return 'MDKey/count shouldnot be empty'
  }

  @Post('sentmail')
  async Sentmail(@Body() input){
    return await this.apiService.Sentmail(input)
  }

  //====TP-API's====//  

  @Post('tenantProcessLog')
  async getTPrcLogs(@Body() input: any): Promise<any> {
    return await this.apiService.getTenantPrcLogs(input);
  }

  @Get('prcLog')
  async prcLogs(): Promise<any> {
    return await this.apiService.prcLogs();
  }
 
  @Get('expLog')
  async exceplogs(@Query() input): Promise<any> {
    return await this.apiService.expLogs()
  }
 
  @Post('tenantExceptionLog')
  async getTExceplogs(@Body() input): Promise<any> {   
    return await this.apiService.getTenantExceptionlogs(input) 
  }

  @Get('getClient')
  async getAllClients(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { type ,clientCode} = query;
    return this.apiService.getAllClientTenant(type,clientCode);
  }

   @Post('signin')
  async signinToTorus(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { client, username, password, type } = body;
    return this.apiService.signIntoTorus(client, username, password, type);
  }

  @Post('register')
  async registerUsertoTorus(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    return this.apiService.registerToTorus(body.client, body.username, body.firstname, body.lastname, body.email, body.mobile, body.password, body.type);
   
  }
  @Get('userDetails')
  async getUserDetails(@Req() req: Request) {
    const { authorization }: any = req.headers;
    if (authorization) {
      const token = authorization.split(' ')[1];
      return this.apiService.getUserDetails(token);
    } else {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('getappgrouplist')
async getAppGroupList(
  @Query(new ValidationPipe({ transform: true })) query: any,
) {
  const { tenant } = query;
  return this.apiService.getAppGroupList(tenant);
}

@Get('getapplist')
async getAppList(@Query(new ValidationPipe({ transform: true })) query: any) {
  const { tenant, appGroup } = query;
  return this.apiService.getAppList(tenant, appGroup);
}


@Get('getAssemblerVersion')
async getAssemblerVersion(
  @Query(new ValidationPipe({ transform: true })) query: any,
) {
  const { key } = query;
  // console.log(key);
  
  return await this.apiService.getAssemblerVersion(key);
}
@Post('saveAssemblerData')
  async saveAssemblerData(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { key, data } = body;
    return await this.apiService.saveAssemblerData(key, data);
  }

  @Post('updateToken')
  async updateToken(@Body(new ValidationPipe({ transform: true })) body: any) {
    const { token, ORPData } = body;
    return this.apiService.updateTokenWithORP(token, ORPData);
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
    return this.apiService.getRecentArtifactDetailList(
      loginId,
      client,
      fabric,
      catalog,
      artifactGrp,
      sortOrder,
      artifactType
    );
  }

  @Post("getAllCatalogs")
  async getAllCatalogs(@Body() body: any) {
    return this.apiService.getAllCatalogs( body.client, body.functionGroup, body.fabric);
  }

  @Post("getAllArtifactGrp")
  async getAllArtifactGrp(@Body() body: any) {
    const {client, functionGroup,fabric, catalog } = body;
    return this.apiService.getArtifactGrp(client,functionGroup, fabric, catalog);
  }

  @Post('getArtifactRelatedToBuild')
  async getArtifactRelatedToBuild(@Body() body: any) {
    const { tenant, appGrp , app } = body;
    return this.apiService.getArtifactRelatedToBuild(tenant, appGrp, app);
  }

  @Post("pushArtifactToBuild")
  async pushArtifactToBuild(@Body() data: any) {
    const { artifactKeyPrefix, loginId, tenant,appGrp , app, version , client } = data;
    return this.apiService.pushArtifactToBuild(
      client,
      artifactKeyPrefix,
      loginId,
      tenant,
      appGrp,
      app,
      version
    );
  }

  @Get("getSecurityTemplateData")
  async getSecurityTemplateData(
    @Query(new ValidationPipe({ transform: true })) query: any
  ) {
    const { tenant } = query;
    return await this.apiService.getSecurityTemplateData(tenant);
  }

  @Post("postSecurityTemplateData")
  async postSecurityTemplateData(
    @Body(new ValidationPipe({ transform: true })) body: any
  ) {
    const { tenant, data } = body;
    return await this.apiService.postSecurityTemplateData(tenant, data);
  }

  @Get('getAccessProfiles')
  async getAccessProfiles(@Query(new ValidationPipe({ transform: true })) query: any) {
    const { tenant } = query;
    return await this.apiService.getAccessProfiles(tenant);
  }


  @Get("getUserList")
  async getUserList(
    @Query(new ValidationPipe({ transform: true })) query: any
  ) {
    const { client, type } = query;
    return this.apiService.getUserList(client, type);
  }

  @Post('postUserList')
  async postUserList(@Body(new ValidationPipe({ transform: true })) body: any) {
    const { tenant, data , type } = body;
    return await this.apiService.postUserList(tenant, data , type);
  }


  @Post("shareArtifact")
  async shareArtifact(@Body() body: any) {
    const {
      loginId,
      functionGroup,
      fabric,
      catalog,
      artifactGrp,
      artifactName,
      version,
      shareTo,
      accessType,
      client
    } = body;
    return this.apiService.shareArtifact(
      loginId,
      functionGroup,
      fabric,
      catalog,
      artifactGrp,
      artifactName,
      version,
      shareTo,
      accessType,
      client
    );
  }

  
  @Post("deleteArtifact")
  async deleteArtifact(@Body() body: any) {
    const {
      loginId,
      functionGroup,
      fabric,
      catalog,
      artifactGrp,
      artifactName,
      version,
      client
    } = body;
    return this.apiService.deleteArtifact(
      loginId,
      functionGroup,
      fabric,
      catalog,
      artifactGrp,
      artifactName,
      version,
      client
    );
  }

  // @Post("pinArtifact")
  // async pinArtifact(@Body() body: any) {
  //   const { loginId, artifactKey } = body;
  //   return this.apiService.pinArtifact(loginId, artifactKey);
  // }

  // @Post("unPinArtifact")
  // async unPinArtifact(@Body() body: any) {
  //   const { loginId, artifactKey } = body;
  //   return this.apiService.unpinArtifact(loginId, artifactKey);
  // }

  @Post("pinUnpinArtifact")
async pinUnpinArtifact(@Body() body: any) {
  const { loginId, artifactKey,  action } = body;
  return this.apiService.handleArtifactPinAction(loginId, artifactKey,  action);
}


  @Get('getTenantInfo')
  async getTenantInfo(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const { tenant } = query;
    return await this.apiService.getTenantProfile(tenant);
  }

  @Post('post-tenant-resource')
  async postNewTenantResource(@Body(new ValidationPipe({ transform: true })) body: any) {
    const { tenant, data, resourceType } = body;
    return await this.apiService.postNewTenantResource(tenant, data, resourceType);
  }

  @Get('get-tenant-organization-matrix')
  async getTenantOrganizationMatrix(@Query(new ValidationPipe({ transform: true })) query: any) {
    const { tenant } = query;
    return await this.apiService.getTenantOrganizationMatrix(tenant);
  }

  @Get('getTenantEnv')
  async getTenantEnvironment(
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    const {  code} = query;
    return await this.apiService.getTenantEnvironment(code);
  }

  @Post('postTenantEnv')
  async postTenantEnvironment(
    @Body(new ValidationPipe({ transform: true })) body) {
    // console.log(body)
    return await this.apiService.postTenantEnvironment(body.client,body.data) ;
  }


  @Get('get-app-env')
  async getAppEnv(@Query(new ValidationPipe({ transform: true })) query: any) {
    const { tenant } = query;
    return await this.apiService.getAppEnv(tenant);
  }

  
  @Post('post-app-env')
  async postAppEnv(@Body(new ValidationPipe({ transform: true })) body: any) {
    const { tenant , data } = body;
    return await this.apiService.potAppEnv(tenant , data);
  }

  @Get('get-client-profile')
  async getClientProfile(@Query(new ValidationPipe({ transform: true })) query: any) {
    const { clientCode } = query;
    return await this.apiService.getClientProfile(clientCode);
  }

  @Post('post-client-profile')
  async PostClientProfile(@Body(new ValidationPipe({ transform: true })) body: any) {
    const { clientCode, data } = body;
    return await this.apiService.PostClientProfile(clientCode, data);
  }

  @Get("myAccount-for-client")
  async MyAccountForClient(@Req() req: Request) {
    const { authorization }: any = req.headers;
    if (authorization) {
      const token = authorization.split(" ")[1];
      return this.apiService.MyAccountForClient(token);
    } else {
      throw new HttpException("Token not found", HttpStatus.UNAUTHORIZED);
    }
  }

  @Post("updateMyAccount")
  async updateMyAccount(@Body(new ValidationPipe({ transform: true })) body: any) {
    const { clientCode, data } = body;
    return await this.apiService.updateMyAccount(clientCode, data);
  }


  @Post('client-user-addition')
  async clientUserAddition(@Body(new ValidationPipe({ transform: true })) body: any){
    const {clientCode , data , isTenantUser } = body;
    return await this.apiService.clientUserAddition(clientCode , data,isTenantUser)
  }

 
  @Post('get-dynamic-tenantcode')
  async getDynamicTenantCode(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ) {
    const { clientCode , tenantName , Logo } = body;
    return await this.apiService.getDynamicTenantCode(clientCode , tenantName , Logo);
  }

  @Post('post-client-user-roles')
  async postClientUserRoles(
    @Body(new ValidationPipe({ transform: true })) body: any,
  ){
    const { clientCode , roles } = body;
    return await this.apiService.postClientUserRoles(clientCode , roles)
  }

  @Get('getroles')
  async getRoles(@Req() req: Request) {
    const { authorization }: any = req.headers;
    
    if (authorization) {
      const token = authorization.split(' ')[1];
      
      return  this.apiService.GetRoles(token);
    }else {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }
   
   
  }
  
  @Post("pushArtifactBuild")
  async pushArtifactBuild(@Body() data: any) {
    const { artifactKeyPrefix, loginId, tenant,appGrp , app, version , client } = data;
    return this.apiService.pushArtifactBuild(
      client,
      artifactKeyPrefix,
      loginId,
      tenant,
      appGrp,
      app,
      version
    );
  }

// ====TP-Auth====

@Post("auth-clientRegister")
  async clientRegister(@Body() body: any) {
    const {clientName,firstName,lastName,email,userName,mobile,password,team} = body;
    return this.apiService.clientRegister(
      clientName,
      firstName,
      lastName,
      email,
      userName,
      mobile,
      password,
      team
    );
  }

  @Post("auth-individualSignin")
  async individualSignin(@Body() body: any) {
    const { username, password } = body;
    return this.apiService.individualSignin(username, password);
  }

  @Post("auth-send-verification-otp")
  async emailVerificationOtp(@Body() body: any) {
    const { email, team } = body;
    return this.apiService.emailVerificationOtp(email, team);
  }


  @Post("auth-verifyMailId")
  async verifyMailId(@Body() body: any) {
    // const { client, email, otp, type } = body;
    return this.apiService.verifyMailId(body.client, body.email, body.otp, body.type);
  }

  @Post('auth-valResetotp')
  async authValidateResetOtp(@Body() body: any) {
    return this.apiService.authValidateResetOtp(body.email , body.otp , body.clientCode);
  }

  @Post('auth-sendResetOtp')
  async sendResetOtp(@Body() body: any) {
    return this.apiService.sendResetOtp(body.email , body.team , body.clientCode);
  }

  @Post("auth-verify-otp")
  async verifyEmailOtp(@Body() body: any) {
    const { email, otp } = body;
    return this.apiService.verifyEmailOtp(email, otp);
  }
  
  @Post('auth-resetPassword')
  async authResetPassword(@Body() body: any) {
    return this.apiService.authResetPassword(body.email ,body. password , body.clientCode);
  }

  @Post("auth-identityprovider")
  async postIdentityProvider(@Body() body: any) {
    return this.apiService.postIdentityProvider( body.user, body.account);
  }
//=====TM====
  @Post('schema')
  async getschema(@Body() input){
    return await this.apiService.getschema(input.key);
  }

  @Post('prepareDFOSchema')
  async  prepareDFOSchema(@Body() input) : Promise<any> { 
    if(input.key){
      return await this.apiService.prepareDFOSchema(input.key)   
    }else{
      throw new BadRequestException ('key is not found')
    }
   
   }

   @Post('prepareHLRSchema')
   async prepareHLRSchema(@Body() input) : Promise<any> { 
     if(input.key && input.nodeId){
       return await this.apiService.prepareHLRSchema(input.key,input.nodeId)   
     }else{
       throw new BadRequestException ('key/nodeId  is not found')
     }    
    }
    // @Post('copyData')
    // async Saveas(@Body() input: any) {
    //   return await this.apiService.Saveas(input.SOURCE,input.TARGET,input.sourceKey, input.destinationKey)
    // }
    
    @Get('employee')
    async getEmployee(){
      return await this.apiService.getEmployee()
    }

    
    @Get('getHandlers')
    async getHandlers(@Query() input:any){
      const {type, artifact, version} = input
      return await this.apiService.getHandlers(type, artifact, version);
    }

    @Post('validateJson')
  async validateSchemaType(@Body() input: any) {    
    try{
      return await this.apiService.validateJson(input.sourceDB,input.schemaKey,input.sourceJson);      
    }
    catch(err){      
      throw  new BadRequestException(err)
    }   
  }

  @Post('copyData')
  async Saveas(@Body() input: any){
return await this.apiService.Saveas(input.SOURCE,input.TARGET,input.sourceKey,input.destinationKey,input.loginId)
  }

  @Post('savenewversion')
  async Savenewversion(@Body() input: any){
  return await this.apiService.savenewversion(input.key)
  }
  
//TE
  @Post('getdsSchema')
  async getDSSchema(@Body() input){
    return await this.apiService.getcustomcodeSchema(input.key,input.nodeId)
  }

  @Post('ejs')
  async getPoProcess(@Body() input: any): Promise<any> {
    return await this.apiService.createEjs(input.key)
  }

  @Post('getDFdSchema')
  async getDFDSchema(@Body() input){
    return await this.apiService.getDFcustomcodeSchema(input.key,input.nodeId)
  }
}