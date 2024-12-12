import {  BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { CommonService } from 'src/commonService';
var _ = require('underscore');
import { RedisService } from 'src/redisService';
import { pfDto } from '../Dto/pfdto';
import { TeService } from '../te.service';
import { log } from 'isomorphic-git';


@Injectable()
export class SavehandlerService {    

   /**
     * Service responsible for handling the save operation for a given key, event, session information, pKey, nodeId, nodeName, role, mode, and upId.
     *
     * @param {DebugService} debugService - The debug service used for logging information.
     * @param {CommonService} commonService - The common service used for generic operations such as API calls, database operations, etc.
     * @param {RedisService} redisService - The redis service used for interacting with the Redis database.
     * @param {TeService} teService - The TE service used for interacting with the TE microservice.
     */
    constructor(private readonly commonService: CommonService,
     private readonly redisService:RedisService,private readonly teService:TeService) {}
     private readonly logger = new Logger(SavehandlerService.name);

        /**
     * Asynchronously handles the save operation for a given key, event, session information, pKey, nodeId, nodeName, role, mode, and upId.
     *
     * @param {string} key - The key used to identify the save operation.
     * @param {any} event - The event associated with the save operation.
     * @param {object} sessionInfo - The session information for the user.
     * @param {string} pKey - The pKey associated with the save operation.
     * @param {string} nodeId - The nodeId associated with the save operation.
     * @param {string} nodeName - The nodeName associated with the save operation.
     * @param {string} role - The role associated with the save operation.
     * @param {string} mode - The mode associated with the save operation.
     * @param {string} upId - The upId associated with the save operation.
     * @return {Promise<any>} The form data returned from the save operation.
     * @throws {Error} If an error occurs while posting data.
     */

    async savehandler(data,url,key,event,nodeId,nodeName,nodeType,token,upId){           
        try { 
          this.logger.log("SaveHandler service started...")
         
            var formdata
          var teData
       
           var errdata = {
            tname:'TE',
            errGrp:'Technical',
            fabric:'PF',
            errType:'Fatal',
            errCode:'001'
            }   
          
           if(data.parentPrimaryKey){
            var primarykey = data.parentPrimaryKey
           }
            if(data.childData && data.parentData){
              var parentkey = Object.keys(data.parentData)
              // check primarykey includes in parentdata            
              if(parentkey.includes(primarykey)){
                var primaryval = data.parentData[primarykey]
              }
              var childarr = []
              if(data.childData.length>0){
                for(let t=0;t<data.childData.length;t++){
                  var obj={}
                  obj[primarykey]=primaryval
                  data.childData[t] = Object.assign(data.childData[t],obj) 
                  
                                 
                 var insertdata = await this.apicall(url,data.childData[t],token)
                  childarr.push(insertdata.result)                  
                }
                
              }else{
                throw 'child data not found'
              }
                       
              if(Object.keys(data.parentData).length>0){
                
                if(nodeId && nodeName && nodeType && event){                   
                  teData =  await this.TEcall(token,key,upId,data.parentData,nodeId,nodeName,nodeType,event) 
                 
                  if(teData && childarr && childarr.length >0){                   
                    teData['childArray'] = childarr   
                  }     
                return teData
                }else{
                  return await this.commonService.responseData(201,childarr)
                }
              }else{
                 throw 'parent data not found'
              }
            }           
                                 
             var insertdata = await this.apicall(url,await this.filterdata(data),token)            
             var filterresult = { ...insertdata.result, ...data }            
            
             if(insertdata?.statusCode == 201){
              if(nodeId && nodeName && nodeType && event){
                var formdata =  await this.TEcall(token,key,upId,filterresult,nodeId,nodeName,nodeType,event)                
                formdata['insertedData'] = await this.filterdata(insertdata.result)
                return formdata
                }else{
                  return insertdata
                }
            }else{
              throw insertdata
            }                        
          }catch(error) {          
           this.logger.log('Error occurred save handler:', error);  
            if(error.errorCode){         
            throw new BadRequestException(error)
           }         
           var errobj = await this.commonService.errorobj(errdata,error,error.status)
           throw new BadRequestException(errobj)
        } 
    } 

    async apicall(url,data,token){
      try{
      const requestConfig: AxiosRequestConfig = {
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
        }};
      var insertedData =  await this.commonService.postCallwithDB(url,data, requestConfig)
      if(insertedData && insertedData.statusCode == 201)    
      return insertedData 
    else
    throw insertedData
    }catch(error) {
      throw error
    }              
    }

    async TEcall(token,key,upId,data,nodeId,nodeName,nodeType,event){
      try{
      var pfdto:any = new pfDto()
      var formdata:any
      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };      
          pfdto.key = key
          pfdto.upId = upId
          pfdto.token = token 
          pfdto.data = data
          pfdto.event = event
          pfdto.nodeId = nodeId
          pfdto.nodeName = nodeName 
          pfdto.nodeType = nodeType    
          console.log('pfdto', pfdto,2,requestConfig)         
          formdata =  await this.teService.EventEmitter(pfdto)              
        return formdata
    }catch(err){
      console.log("err",err)
      throw err
    }
    }
     
    async filterdata(data:any){
      var result = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value)
       );
       return result;
    }

    async paginationHandler(token,path,page,count,selectcolumn,filtercolumns,sfkey,dfkey){
       
        var tenant=dfkey.split(':')[0]
        var  fabric=dfkey.split(':')[1]
        var  access=dfkey.split(':')[2]
        var  catalog=dfkey.split(':')[3]
        var afg = dfkey.split(':')[4]
        var  artifact=dfkey.split(':')[5]
        var version = dfkey.split(':')[6]
      try{
        const requestConfig: AxiosRequestConfig = {
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
        data:selectcolumn
      };
     
      var str=''
      var qryparam
      if(filtercolumns && page && count){
      for(var s=0;s<filtercolumns.length;s++){
        var ftr:any
        ftr =  filtercolumns[s].filtercolumn+ filtercolumns[s].filterCondition+ filtercolumns[s].filterValue
        str = str +'&'+ ftr        
      }
       qryparam = 'page='+page+'&limit='+count+'&sfkey='+sfkey+str 
    } else if(page && count){
      qryparam = 'page='+page+'&limit='+count+'&sfkey='+sfkey
    }else if(filtercolumns){
      qryparam = '&sfkey='+sfkey+str 
    }
    else{
      qryparam = '&sfkey='+sfkey
    } 
    var apires = await this.commonService.getCall('http://localhost:3010/'+path+'/get?'+qryparam,requestConfig) 
    console.log(apires.result);
    var pagestr = {}
    pagestr['frk']=dfkey
     pagestr['dfo'] = apires.result

     var result =await this.redisService.setJsonData(tenant+":"+'FRK'+":"+access+":"+'vmsp_banks'+":"+'API'+":"+'bind'+":"+version, JSON.stringify(pagestr))
    console.log('result',result);
    
      return result
      }catch(err){
        throw new BadRequestException(err)
      }
    }

    async updateHandler(data,dfkey,upid,url,tablename,id,token){   
      try {  
        const requestConfig: AxiosRequestConfig = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          }
         }; 
          if(Array.isArray(data) && Array.isArray(id)){
         if(id.length > 0 && data.length>0){
          if( id.length == 1 && data.length == 1){
            if(Object.keys(data).length > 0){
              var apipath =url+tablename+'/'+id             
              var apires = await this.commonService.patchCall(apipath,data[0],requestConfig)
             
            }else{
              throw 'Data was empty'
            }
            
          }else{
            for(var i=0;i<id.length;i++){
              if(id.length == data.length){
                var apipath =url+tablename+'/'+id[i]
                var apires = await this.commonService.patchCall(apipath,data[i],requestConfig)  
                         
              }else{
                throw 'Missing data/id'
              }             
            }          
          }
         } else{
          throw 'data/primarykey is empty'
         }        
        }else{
          throw 'data/primarykey should be an array'
        }
        if(dfkey && upid){
          if(apires?.statusCode){
            if(apires.statusCode == 200){
             var result = await this.teService.getProcess(dfkey,token,upid)  
             return result         
            } 
           } 
        }
        return await this.commonService.responseData(201,apires.result)
          
      } catch (error) {
        throw error
      }        
    }

   
} 