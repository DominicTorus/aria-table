import { RedisService } from 'src/redisService';
import { Injectable} from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { catchError } from 'rxjs';




@Injectable()
export class CommonService {
  constructor(private readonly redisService: RedisService,private readonly jwtService:JwtService) {}
  

  /**
+   * This function is used to get the security JSON data based on the given key and token.
+   * The function checks if the user has the required permissions to access the Product Service.
+   * If the user has the required permissions, it returns the security JSON data.
+   * If the user does not have the required permissions, it throws a BadRequestException.
+   * @param key The key used to get the security JSON data.
+   * @param token The token used to check the user's permissions.
+   * @returns The security JSON data.
+   */


  
  //=================================TE SERVICE ===========================================

     
  /**
+   * Asynchronously makes a POST call to the given URL with the given body and headers.
+   * If the call is successful, it returns the response data.
+   * If the call fails, it throws the error response.
+   *
+   * @param {string} url - The URL to make the POST call to.
+   * @param {object} body - The data to send in the request body.
+   * @param {object} headers - The headers to send with the request.
+   * @returns {Promise<any>} The response data if the call is successful.
+   * @throws {Error} The error response if the call fails.
+   */
  async postCallwithDB(url,body,headers?){      
    return await axios.post(url,body,headers)
    .then((res) => !res.data.errorCode? this.responseData(res.status, res.data).then((res) => res): res.data)
    .catch((err) => {throw err});  
  }
  

  /**
   * Makes a POST call to the given URL with the given body and headers.
   * If the call is successful, it returns the response data.
   * If the call fails, it throws the error response.
   *
   * @param {string} url - The URL to make the POST call to.
   * @param {object} body - The data to send in the request body.
   * @param {object} headers - The headers to send with the request.
   * @returns {Promise<any>} - The response data if the call is successful.
   * @throws {Error} - The error response if the call fails.
   */
  async postCall(url,body,headers?){ 
    return await axios.post(url,body,headers)
    .then((res) => this.responseData(res.status, res.data).then((res) => res))
    .catch((err) => {throw err});  
  }


  /**
   * Asynchronously makes a GET call to the given URL with the given headers.
   * If the call is successful, it returns the response data.
   * If the call fails, it throws the error response.
   *
   * @param {string} url - The URL to make the GET call to.
   * @param {object} headers - The headers to send with the request.
   * @returns {Promise<any>} The response data if the call is successful.
   * @throws {Error} The error response if the call fails.
   */
  async getCall(url,headers?){   
    return await axios.get(url,headers)
    .then((res) => this.responseData(res.status, res.data).then((res) => res))
    .catch((err) => {throw err});  
  }  
  
  async patchCall(url,data,headers){
    return await axios.patch(url,data,headers)
    .then((res) => this.responseData(res.status, res.data).then((res) => res))
    .catch((err) => {throw err}); 
  }

   /**
   * Creates an error object with the given error details.
   *
   * @param {Object} errdata - The error data object.
   * @param {Object} error - The error object.
   * @param {number} status - The status code.
   * @returns {Promise<Object>} - The error object.
   */
   async errorobj(errdata:any,error: any,status:any): Promise<any> {    
    if(error.code){
      if(error.code == 'ETIMEDOUT')
        status=408
    }
    var errobj = {}
      errobj['T_ErrorSource'] = errdata.tname,
      errobj['T_ErrorGroup'] = errdata.errGrp,
      errobj['T_ErrorCategory'] = errdata.fabric || 9999,  // General - 9999
      errobj['T_ErrorType'] = errdata.errType ,
      errobj['T_ErrorCode'] = errdata.errCode,
      errobj['errorCode'] = status,
      errobj['errorDetail'] = error  
    return errobj
   }


  /**
+   * Saves an error log to Redis.
+   *
+   * @param {Object} errdata - The error data object.
+   * @param {string} stoken - The session token.
+   * @param {string} key - The key used to store the error log.
+   * @param {Object} error - The error object.
+   * @param {number} status - The HTTP status code.
+   * @param {Object} [commonerr] - The common error object.
+   * @param {Object} [prcdet] - The process details object.
+   * @returns {Promise<Object>} - The error object.
+   * @throws {Error} If there is an error saving the error log.
+   */


  async commonErrorLogs(errdata:any,stoken:any,key:any,error:any,status:any,optnlParams?:any){    
    try{     
      var sessionInfo = {} 
      var commonerr,prcdet
      if(optnlParams){
        if(optnlParams.mode){
          prcdet = optnlParams
        }else{
          commonerr = optnlParams
        }
      }
      var token:any = this.jwtService.decode(stoken,{ json: true })
      
      if(key){
        var str = key.split(':');
        sessionInfo['key'] = key;     
      }
      if(token){
        sessionInfo['user'] = token.loginId       
        sessionInfo['accessProfile'] = token.accessProfile 
      }else{
        sessionInfo = commonerr
      }    
      var errorDetails = await this.errorobj(errdata,error,status)
      var logs = {}
      logs['sessionInfo'] = sessionInfo
      logs['errorDetails'] = errorDetails   
      if(key){     
        if(optnlParams?.mode)
          logs['processInfo'] = prcdet                
      }
      if(key == undefined || key == "")
        key = 'commonError'
      await this.redisService.setStreamData('TSL',key,JSON.stringify(logs)) 
       
      return errorDetails

    } catch(err){
      throw err;
    }
  }

  async responseData(statuscode:any, data: any,): Promise<any> {
    try{
       if(!statuscode)
        statuscode = 201
      var resobj = {} 
    if(statuscode == 201 || statuscode == 200)   
      resobj['status'] = 'Success'
    else
    resobj['status'] = 'Failure'
    resobj['statusCode'] = statuscode,
    resobj['result'] = data     
    return resobj
  }catch(err){
    throw err
  }
  } 
}