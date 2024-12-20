import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "src/redisService";
import { TeCommonService } from "src/TE/teCommonService";
import { PoEvent } from "src/TE/Dto/poevent";
import { CommonService } from "src/commonService";
import { AxiosRequestConfig } from "axios";

@Injectable()
export class TSService {
    constructor(
      private readonly redisService: RedisService,      
      private readonly teCommonService: TeCommonService,
      private readonly CommonService: CommonService) {}
    private readonly logger = new Logger(TSService.name);

  async getTSProcess(input:PoEvent) {  
    this.logger.log("Torus Consumer Started....")
    try {           
      var key = input.key
      var upId = input.upId
      var event = input.event
      var inputparam:any = input.data
      var token = input.token
      var nodeId = input.nodeId
      var nodeName = input.nodeName
      var nodeType = input.nodeType

      var params: any = (Object.keys(input))

      const missingKeys = params.filter(item => !input[item] || input[item] == null || input[item] == undefined);
      if (missingKeys.length > 0) {
        return `${missingKeys.join(', ')} ${missingKeys.length > 1 ? 'are' : 'is'} empty`;
      }

      const pfjson = JSON.parse(await this.redisService.getJsonData(key + 'PFS'));     
      var pfresponse = await this.pfProcessor(key, upId, event, inputparam, token, nodeId, nodeName, nodeType, pfjson);
      return pfresponse
    } catch (error) {  
      console.log('TS Error',error);
      if(error.message){
        return {error:error, message: error.message}
      }else{
        return error
      }
    }
  }  

  async pfProcessor(key, upId, event, inputparam, token, nodeId, nodeName, nodeType, pfjson) {
    this.logger.log('Pf Processor started!');
    this.logger.log('UPID',upId)  
    let request = inputparam
    var fngkKey = key.split('FNGK')[1].split(':')[1]   
    if(key.includes(fngkKey)){
      var processedKey = key.replace(fngkKey, fngkKey+'P')
    } 

    var poArtifact = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'PO', '.mappedData.artifact'));   
    var poNode = poArtifact.node

    var afi = JSON.parse(await this.redisService.getJsonData(key + 'AFI'))
    if (afi != null && afi.executionMode)
      var mode = afi.executionMode
    else    
      mode='E'

      for (var j = 0; j < poNode.length; j++) {
        if(poNode[j].nodeId == nodeId){  
          var sourceStatus = poNode[j].events.sourceStatus            
          var targetStatus = poNode[j].events.pro.success.targetStatus
        } 
       
        if(pfjson[j].nodeId == nodeId){
          var routearr = pfjson[j].routeArray 
        }
        //HumanTaskNode
          if(nodeType == 'humantasknode' && poNode[j].nodeId == nodeId){
            try {            
              this.logger.log('HumanTask node Started')
              var srcQueue = poNode[j].events.sourceQueue
              if(!srcQueue)
                srcQueue = 'TEH'
            
              var failureQueue = poNode[j].events.pro.failure.targetQueue
              if(!failureQueue){
                failureQueue =  srcQueue
              }
              //await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), 'request')
              
              var RCMresult:any = await this.teCommonService.getRuleCodeMapper(poNode[j],inputparam) 
                 
              let zenresult = RCMresult.rule
              let customcoderesult = RCMresult.code 
              if(customcoderesult != undefined){
                var response = Object.assign(request,customcoderesult)
              }    
              if(response)
              await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(response), 'response')
              if(routearr.length>0){
                for(var z=0;z < routearr.length;z++){ 
                  if(routearr[z].nodeName != 'End'){                    
                    if(response)              
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(response), 'request')
                    else
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(inputparam), 'request')
                  }
                }
              }
              
              await this.redisService.setStreamData(srcQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":targetStatus}))
              await this.teCommonService.getTPL(processedKey,upId,mode,poNode[j],'Success',token,'PF',sourceStatus,inputparam,{"PID":upId,"TID":nodeId,"EVENT":targetStatus})
              this.logger.log('HumanTask node completed')      
              return {status:200, targetStatus: targetStatus}    
              // return targetStatus
            } catch (error) {              
              await this.teCommonService.getTPL(processedKey,upId,mode,poNode[j],'Failed',token,'PF',sourceStatus,inputparam,error)
              var failureTargetStatus = poNode[j].events.pro.failure.targetStatus
              await this.redisService.setStreamData(failureQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
              throw error
            }
          
          }

        //DecisionNode
          if(nodeType == 'decisionnode' && poNode[j].nodeId == nodeId){
            try { 
              this.logger.log('Decision node Started') 
              
              var srcQueue = poNode[j].events.sourceQueue
               if(!srcQueue)
                srcQueue = 'TEH'
              var failureQueue = poNode[j].events.pro.failure.targetQueue
              if(!failureQueue){
                failureQueue = srcQueue
              }
             // await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), 'request')
              if(!poNode[j].rule || Object.values(poNode[j].rule).length == 0){
                throw 'Rule is required for decision node'
              }
             
              var RCMresult:any = await this.teCommonService.getRuleCodeMapper(poNode[j],inputparam)                
              let zenresult = RCMresult.rule              
              let customcoderesult = RCMresult.code 
              if(customcoderesult != undefined){
                var response = Object.assign(request,customcoderesult)
              } 
             
              if(response){
                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(response),'response')
              }else if(zenresult != undefined){
                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify({zenresult}),'response')
              }
              
              if(routearr.length>0){
                for(var z=0;z < routearr.length;z++){ 
                  if(routearr[z].nodeName != 'End'){
                    if(response)               
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(response), 'request')
                    else{
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(inputparam),'request')
                    }                      
                  }  
                }
              } 
              if(zenresult){
                await this.redisService.setJsonData(key+'PO',JSON.stringify(zenresult),'mappedData.artifact.node['+j+'].events.pro.success.targetStatus')
                await this.redisService.setStreamData(srcQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":zenresult}))
                await this.teCommonService.getTPL(processedKey,upId,mode,poNode[j],'Success',token,'PF',sourceStatus,inputparam,{"PID":upId,"TID":nodeId,"EVENT":zenresult})
              }
              this.logger.log('Decision node completed')  
              return {status:200, targetStatus: zenresult} 
              // return zenresult
            } catch (error) {
              await this.teCommonService.getTPL(processedKey,upId,mode,poNode[j],'Failed',token,'PF',sourceStatus,inputparam,error)
              var failureTargetStatus = poNode[j].events.pro.failure.targetStatus
              await this.redisService.setStreamData(failureQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
              throw error
            }
          }

        //ApiNode
          if(nodeType == 'apinode' && poNode[j].nodeId == nodeId){
            try {                
              this.logger.log('Api node Started')  
              var srcQueue = poNode[j].events.sourceQueue
               if(!srcQueue)
                srcQueue = 'TEH'
              var srcMailQueue = poNode[j].events.pro.success.targetQueue
              var failureQueue = poNode[j].events.pro.failure.targetQueue
              if(!failureQueue){
                failureQueue =  srcQueue
              }
              // await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), 'request')      
              
              var RCMresult:any = await this.teCommonService.getRuleCodeMapper(poNode[j],inputparam)                
              let zenresult = RCMresult.rule
              let customcoderesult = RCMresult.code 
              if(customcoderesult != undefined){
                var response = Object.assign(request,customcoderesult)
              }  
                         
              if(routearr.length>0){
                for(var z=0;z < routearr.length;z++){ 
                  if(routearr[z].nodeName != 'End'){
                  if(response)               
                  await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(response), 'request')
                else
                await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(inputparam), 'request')
                
                }}
               }
              await this.redisService.setStreamData(srcQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":targetStatus}))
              await this.redisService.setStreamData(srcMailQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":targetStatus}))
              var endPoint = JSON.parse(await this.redisService.getJsonDataWithPath(key+'NDP',nodeId+'.data.pro.api.endpoint'))
              if(endPoint){
                const requestConfig: AxiosRequestConfig = {
                  headers: {
                  Authorization: `Bearer ${token}` 
                  }};
                
                var apiResult = await this.CommonService.postCall(endPoint,inputparam.email,requestConfig)                     
              }else{
                throw 'API Endpoint does not exist'
              }
              if(response){
                var apiResult = Object.assign(response,{apiResult:apiResult})
              }
              await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(apiResult),'response')
              await this.teCommonService.getTPL(processedKey,upId,mode,poNode[j],'Success',token,'PF',sourceStatus,inputparam,{"PID":upId,"TID":nodeId,"EVENT":targetStatus})
              this.logger.log('Api node completed') 
              return {status:200, targetStatus: targetStatus}  
              // return targetStatus
            } catch (error) {
              await this.teCommonService.getTPL(processedKey,upId,mode,poNode[j],'Failed',token,'PF',sourceStatus,inputparam,error)
              var failureTargetStatus = poNode[j].events.pro.failure.targetStatus
              await this.redisService.setStreamData(failureQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
              throw error
            }
          }

          //AutomationNode
          if(nodeType == 'automationnode' && poNode[j].nodeId == nodeId){
            try {                
              this.logger.log('Automation Node Started')  
              var srcQueue = poNode[j].events.sourceQueue
               if(!srcQueue)
                srcQueue = 'TEH'
              var srcMailQueue = poNode[j].events.pro.success.targetQueue
              var failureQueue = poNode[j].events.pro.failure.targetQueue
              if(!failureQueue){
                failureQueue =  srcQueue
              }

              var RCMresult:any = await this.teCommonService.getRuleCodeMapper(poNode[j],inputparam)                
              let zenresult = RCMresult.rule
              let customcoderesult = RCMresult.code 
              if(customcoderesult != undefined){
                var response = Object.assign(request,customcoderesult)
              }  
              
              var data = JSON.parse(await this.redisService.getJsonDataWithPath(key+'NDP','.'+poNode[j].nodeId+'.data'))   
              //var column = data.field 
              var streamName = data.streamName 
              //var columnField = Object.values(column)
            
              //const filteredInputParam = Object.fromEntries(
              //  Object.entries(inputparam).filter(([key]) => columnField.includes(key))
             // );
            
              //var res = await this.redisService.setStreamData(streamName,upId,JSON.stringify(filteredInputParam))
              var res = await this.redisService.setStreamData(streamName,upId,JSON.stringify(inputparam))
            
              // await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(inputparam), 'request')
              await this.redisService.setStreamData(srcQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":targetStatus}))
              await this.redisService.setStreamData(srcMailQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":targetStatus}))
              if(response){
                var res = Object.assign(response,res)
              }
              await this.redisService.setJsonData(processedKey + upId + ':NPV:' + nodeName + '.PRO', JSON.stringify(res),'response')
              if(routearr.length>0){
                for(var z=0;z < routearr.length;z++){ 
                  if(routearr[z].nodeName != 'End'){                    
                    if(response)              
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(response), 'request')
                    else
                      await this.redisService.setJsonData(processedKey + upId + ':NPV:' + routearr[z].nodeName + '.PRO', JSON.stringify(inputparam), 'request')
                  }
                }
              }
              await this.teCommonService.getTPL(processedKey,upId,mode,poNode[j],'Success',token,'PF',sourceStatus,inputparam,{"PID":upId,"TID":nodeId,"EVENT":targetStatus})
              this.logger.log('Api node completed') 
              return {status:200, targetStatus: targetStatus}  
              // return targetStatus
            } catch (error) {
              await this.teCommonService.getTPL(processedKey,upId,mode,poNode[j],'Failed',token,'PF',sourceStatus,inputparam,error)
              var failureTargetStatus = poNode[j].events.pro.failure.targetStatus
              await this.redisService.setStreamData(failureQueue,'TASK - '+upId,JSON.stringify({"PID":upId,"TID":nodeId,"EVENT":failureTargetStatus}))
              throw error
            }
          }
      }    
  } 
  
}