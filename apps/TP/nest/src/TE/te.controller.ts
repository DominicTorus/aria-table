import { BadRequestException, Body, Controller, Headers, Post, Session, UseGuards} from '@nestjs/common';
import { AuthGuard } from './Guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { TeService } from './te.service';
import { pfDto } from './Dto/pfdto';
import { TeCommonService } from './teCommonService';


@UseGuards(AuthGuard)
@ApiTags('TE')
@Controller('te')
export class TeController {
  constructor (private readonly teService:TeService,private readonly teCommonService:TeCommonService){}

  
  @Post('eventEmitter')
  async pfEventEmitter(@Body() pfdto: pfDto, @Session() session: any): Promise<any> {
    pfdto.token = session.sToken
    var node = session.node
    var upidarr = []
    const eventval = pfdto 
    if(pfdto.key.split('FNK')[1].split(':')[1] == 'DF-DFD'){
      return await this.teService.EventEmitter(pfdto, node);
    }else{
      if(pfdto.data && pfdto.event && pfdto.nodeId && pfdto.nodeType){
        if(!pfdto.upId){
          return await this.teService.EventEmitter(pfdto, node);
        }else{
          if(pfdto.upId && pfdto.upId.length == 0)
            throw new BadRequestException('Process Id is empty')
          var refupid = pfdto.upId
          var key = pfdto.key
         // var nodeId=pfdto.nodeId
          var nodeName=pfdto.nodeName
          var nodetype=pfdto.nodeType
          var data=pfdto.data
          var event=pfdto.event
          if(refupid.length>0){
          for(var k=0;k<refupid.length;k++){
            const upId = refupid[k]
            eventval.upId = upId
            eventval.key=key
          //  eventval.nodeId=nodeId
            eventval.nodeName=nodeName
            eventval.nodeType=nodetype
            eventval.data=data
            eventval.event=event
            var res = await this.teService.EventEmitter(eventval, node); 
            upidarr.push(res.upId)
          }
          var finalres = {
            upId:upidarr,
            message:res.message,
            event:res.event
          }
          return finalres
        }
        }
      }else{
        throw 'data/event/nodeId/nodeName/nodeType should not empty'
      }       
    }   
  }

  @Post('df')
  async getAPI(@Body() input,@Session() session: any ){
   var token = session.sToken 
   return await this.teService.securityAccess(input.key,token)   
  }   
 
  @Post('refresh')
  async getRefresh(@Body() input, @Headers('Authorization') auth: any, @Session() session: any) {
    var token = auth.split(' ')[1];   
    return await this.teService.getProcess(input.key, token, input.upid)
  }  
}


