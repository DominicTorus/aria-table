import { RedisService } from "src/redisService";
import {  Injectable, Logger } from "@nestjs/common";
import { CommonService } from "src/commonService";
import { JwtService } from "@nestjs/jwt";
import { RuleService } from "src/ruleService";
import { CodeService } from "src/codeService";

var _ = require('underscore');

@Injectable()
export class TeCommonService {

  /**
+   * The constructor for the TECommonService class.
   * @param {RedisService} redisService - The RedisService instance.
   * @param {CommonService} commonService - The CommonService instance.

   */
  constructor(
    private readonly redisService: RedisService,
    private readonly commonService: CommonService,
    private readonly ruleEngine:RuleService,
    private readonly jwtService:JwtService,    
    private readonly codeService : CodeService,
  ) { }

    private readonly logger = new Logger(TeCommonService.name);
  
    
    async getTPL(key: any, upId: any,mode:string,pfjson:any,status:string,stoken:any,fabric:string,sourceStatus?:string,request?:any,response?:any){
      this.logger.log("TPL Log Started")     
      var sessioninfo = {} 
      var processInfo = {};

      var token:any = this.jwtService.decode(stoken,{ json: true })
      if(token){       
        sessioninfo['user'] =  token.loginId     
        sessioninfo['accessProfile'] =  token.accessProfile     
      }        
    
        processInfo['key'] = key;
        processInfo['upId'] = upId;
        processInfo['status'] = status;
        processInfo['nodeName'] = pfjson.nodeName;
        processInfo['nodeId'] = pfjson.nodeId;
        processInfo['nodeType'] = pfjson.nodeType;  
        if(sourceStatus){
          processInfo['sourceStatus'] = sourceStatus;
        }          
        processInfo['mode'] = mode;

        if(status == 'Success'){
          if(request)
            processInfo['request'] = request;         
          if(response)
            processInfo['response'] = response;
        }else{
          var errdata = {}  
          errdata['tname'] = 'TE'
          if(response.status == 403){
            errdata['errGrp'] = 'Security'
          }else
            errdata['errGrp'] = 'Technical'

          errdata['fabric'] = fabric
          errdata['errType'] = 'Fatal'
          errdata['errCode'] = '001'
          var errorDetails = await this.commonService.errorobj(errdata,response,status)
        }   
       var prclogdata:any
        if(status == 'Success'){
          prclogdata = {
            sessioninfo,
            processInfo
          }
        }else{
          prclogdata = {
            sessioninfo,
            processInfo,
            errorDetails
          }
        }
       
        await this.redisService.setStreamData('TPL', key + upId, JSON.stringify(prclogdata));  
        this.logger.log("TPL Log completed")     
        return prclogdata 
    } 

    async getTSL(skey:string,token:string,error:any,status:any,mode?:string){
      this.logger.log("TSL Log Started")
      var errdata = {}  
      var sessionInfo = {}

      let fabric = skey.split('FNK')[1].split(':')[1].split('-')[0] 
      var tslkey:any = skey.split(':')      
      if(tslkey[tslkey.length - 1] == '')
        tslkey.pop();      
      
      let key = tslkey.join(':')
     
      errdata['tname'] = fabric
      errdata['errGrp'] = 'Setup'
      errdata['fabric'] = fabric
      errdata['errType'] = 'Fatal'
      errdata['errCode'] = '001'
   
      var processInfo = {
        key: key,        
        mode:mode    
      }
      var Stoken:any = this.jwtService.decode(token,{ json: true })
   
      if(token){
        sessionInfo['user'] = Stoken.loginId     
        sessionInfo['accessProfile'] = Stoken.accessProfile
      }

      if(error.code){
        if(error.code == 'ETIMEDOUT')
          status = 408
      }
      if(!status)
        status = 400
      var errobj = await this.commonService.errorobj(errdata,error,status)
      var logs = {}
      logs['sessionInfo'] = sessionInfo
      logs['processInfo'] = processInfo
      logs['errorInfo']= errobj
     
     await this.redisService.setStreamData('TSL',key,JSON.stringify(logs))
     this.logger.log("TSL Log completed")     
     return logs      
    }    

    async getRuleCodeMapper(currentNode, inputparam){
      try {
        var ResultObj = {}
        var rule = currentNode.rule
        var customCode = currentNode.code   
                
      if(rule && Object.keys(rule).length > 0){
        var nodes = rule.nodes     
        if(nodes && nodes.length > 0){
          for(var c=0;c < nodes.length;c++){
            var content = nodes[c].content
            if(content){
              var field = content.inputs[0].field  
              if(!field)
                throw 'Field not found in rule'
            }            
          }
        }
        var gparamreq = {}; 
          if(inputparam && inputparam[field]){
            gparamreq[field] = inputparam[field]
            var goruleres = await this.ruleEngine.goRule(rule, gparamreq) 
            
            if(Object.keys(goruleres.result).length > 0){
              var zenresult = goruleres.result.output
            }else{
              throw `Rule doesn't matched with this value ${inputparam[field]}`
            } 
          }else{
            throw `${field} not found in given request to take decision`                    
          }       
        console.log('ZenResult',zenresult);  
      }   
  
      if (customCode) {
        var customcoderesult = await this.codeService.customCode(inputparam, customCode)
        console.log('customcoderesult',customcoderesult);        
      }    
  
      if(zenresult)
        ResultObj['rule'] = zenresult
      
      if(customcoderesult)
        ResultObj['code'] = customcoderesult
       
      return ResultObj 
      } catch (error) {
        throw error
      }          
    }

    async APIKeyValidation(input,path): Promise<any> {
      var params: any = (Object.keys(input))

      if (path == 'eventEmitter') {
        const missingKeys = params.filter(key => !input[key]);
        if (missingKeys.length > 0) {
          return ` ${missingKeys.join(', ')} ${missingKeys.length > 1 ? 'are' : 'is'} empty`;
        }
      }

      if (path == 'save') {
        const missingKeys = params.filter(key => !input[key]);
        if (missingKeys.length > 0) {
          return ` ${missingKeys.join(', ')} ${missingKeys.length > 1 ? 'are' : 'is'} empty`;
        }
      }    
    }



    //==================== TE SERVICE =========================================

   
  async getDFException(key:string,upId:string,nodeName:string,nodeId:string,mode:string,token:string,error:any,prcType?:string){
    var errdata = {}   
    var ErrorObj = {}
    errdata['tname'] = 'DF'
    if(error.status == 403){
      errdata['errGrp'] = 'Security'
    }else
      errdata['errGrp'] = 'Technical'

    errdata['fabric'] = 'DF'
    errdata['errType'] = 'Fatal'
    errdata['errCode'] = '001'
    var processInfo = { 
      key: key,
      upId: upId,         
      nodeName : nodeName,
      nodeId : nodeId,
      mode:mode    
    }

    ErrorObj = await this.commonService.commonErrorLogs(errdata,token,key+upId,error,error.status,processInfo)
    
    // if(error.status && error.status != 403){
    //   await this.redisService.setJsonData(key + upId + ':NPC:' + nodeName+'.'+prcType ,JSON.stringify(ErrorObj), 'exception')    
    // }
    ErrorObj['processInfo'] = processInfo
    return ErrorObj      
  }
  /**
 * Asynchronously processes custom code.
 *
 * @param {any} key - The key used to retrieve data.
 * @param {any} data - The custom code to be processed.
 * @param {any} arr - An array of objects containing node information.
 * @return {Promise<any>} A promise that resolves to the result of processing the custom code.
 */

  async customCodeProcess(key: any, upId:any,data: any, arr: any,mode) {   
    try {
      if (data != undefined) {
       if(arr.length>0){
        for (var k = 1; k < arr.length - 1; k++) {
          var curnName = (arr[k].nodename).toLowerCase();
          var str = data.indexOf(curnName)
          if (str != -1) {
            if(mode == 'D')
            var value = await this.redisService.getJsonDataWithPath(key + upId +':NPC:'+ arr[k].nodename+'.PRO', '.request') 
            else
            var value = await this.redisService.getJsonDataWithPath(key + 'nodeProperty', '.' + arr[k].nodeid + '.data.pro.request')

            var chkdata = JSON.parse(value)
            // get the key and value of decision node request data        
            var chkkey = Object.keys(chkdata)
            var chkval = Object.values(chkdata)
            // form the data for replace the value in the customcode
            if(chkkey.length>0){
              for (var s = 0; s < chkkey.length; s++) {
                var val = curnName + '.pro.request.' + chkkey[s]
                if (data.indexOf(val)) {
                  data = data.replace(new RegExp(val, 'g'), chkval[s])
                }
              }
            }            
          }
        }
       }
        

        //let result = ts.transpile(data);

        // evaluate the custom code 
        var t1 = eval(data);
        return t1
      }
      else {
        return true
      }
    } catch (error) {
      throw error
    }
  }

  /**
 * Asynchronously executes a Go rule using the provided key, rule, and nodeId.
 *
 * @param {any} key - The key used to retrieve the Go rule from Redis.
 * @param {any} rule - The Go rule to be executed.
 * @param {any} nodeId - The ID of the node associated with the Go rule.
 * @return {Promise<any>} A promise that resolves to the output of the Go rule execution.
 */

  async zenrule(key: any, upId:any, rule: any, pfjson: any,mode:string) {
    // var goruleEngine: GoRuleEngine = new GoRuleEngine();
     var gparamreq = {};
     var decreq;
     
     var greq = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'nodeProperty', '.' + pfjson.nodeId + '.rule..inputs'))
     var npcreq = JSON.parse(await this.redisService.getJsonDataWithPath(key + upId +':NPC:'+ pfjson.nodeName+'.PRO','.request'))
       for (var g = 0; g < greq.length; g++) {
        if(mode == 'D' && Object.keys(npcreq).length>0)
         decreq = JSON.parse(await this.redisService.getJsonDataWithPath(key + upId +':NPC:'+ pfjson.nodeName+'.PRO', '..' +  greq[g].field))
        else
         decreq = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'nodeProperty', '.' + pfjson.nodeId + '.data.pro.request..' + greq[g].field))
         gparamreq[greq[g].field] = decreq
       }
  
     var goruleres = await this.ruleEngine.goRule((rule), gparamreq)
     return (goruleres.result.output)
  }    
}