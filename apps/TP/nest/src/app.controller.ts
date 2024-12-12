import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CommonService } from './commonService';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly commonService: CommonService,private readonly appService: AppService) {}
 
  @Get()
  async getHello(){
    return await this.appService.getHello()
  }

  @Post('commonApiPost')
  async postCall(@Body() input, @Req() token:any){
    return await this.commonService.postCall(input.url, input.payload,token.headers)
  }

  @Get('commonApiGet')
  async getCall(@Body() input, @Req() token:any){
    return await this.commonService.getCall(input.url,token.headers)
  }

  @Post('commonApiError')
  async exceptionCall(@Body() input, @Req() request:any){
    if(request.headers.authorization)
    var bearToken = request.headers.authorization.split(' ')[1];  
    return await this.commonService.commonErrorLogs(input.errData,bearToken,input.key,input.error,input.status,input.commonerr)
  }
}
