import {
  BadGatewayException,
  Injectable,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { MDKdto } from './readMDdto';
import { redis } from './redisService';
import { WriteMDdto } from './writeMDdto';
import { RedisService } from 'src/redisService';
import {
  CustomException,
  ForbiddenException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from './TP/customException';
import {
  comparePasswords,
  getKeyArrayStructure,
  getRecentKeyStructure,
  hashPassword,
  pushArtifactKeyStructure,  
} from './TP/auth/hashing.utility';
import {
  auth_secret,
  fabric,
  sortOrderOfArtifacts,
  tenantProfileTemplate,
} from './TP/constants';
import { JwtService } from '@nestjs/jwt';
import * as ejs from 'ejs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import axios, { AxiosRequestConfig } from 'axios';
import { CommonService } from './commonService';
const jsonata = require('jsonata');
import * as pg from "pg";
import * as fs from 'fs'
import { RuleService } from './ruleService';
import { MongoService } from './mongoService';
import Redis from 'ioredis';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Minio from 'minio';
import Ajv from 'ajv';
import { format } from 'date-fns';
import { node } from '@opentelemetry/sdk-node';
import { LoggerMiddleware } from './TG/Middleware/middleware';
import { TeCommonService } from './TE/teCommonService';
import { log } from 'isomorphic-git';

//===TP-API'S===
type FnG = 'AF' | 'AFR';

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  auth: {
    user: 'support@torus.tech',
    pass: 'Welcome@100',
  },
});

interface keys16 {
  CK: string;
  FNGK: string;
  FNK: string;
  CATK: string[] | string;
  AFGK: string[] | string;
  AFK: string[] | string;
  AFVK: string[] | string;
  AFSK: string[] | string;
}

@Injectable()
export class ApiService {
  private ajv: Ajv
  constructor(@InjectModel('TLC') private readonly model: Model<any>,
    private readonly redisService: RedisService,
    private readonly teCommonService: TeCommonService,
     private readonly gorule:RuleService,
    private readonly jwtService: JwtService,private readonly commonService:CommonService,private readonly mongoService:MongoService
  ) {this.ajv = new Ajv();}
  private readonly logger = new Logger(ApiService.name);

  async readMDK(readMDdto: MDKdto) {
    try {
      if (readMDdto.AFSK)
        var key: any =
          'CK:' +
          readMDdto.CK +
          ':FNGK:' +
          readMDdto.FNGK +
          ':FNK:' +
          readMDdto.FNK +
          ':CATK:' +
          readMDdto.CATK +
          ':AFGK:' +
          readMDdto.AFGK +
          ':AFK:' +
          readMDdto.AFK +
          ':AFVK:' +
          readMDdto.AFVK +
          ':' +
          readMDdto.AFSK;
      var request: any = await redis.call('JSON.GET', key);
      return request;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async writeMDK(writeMDdto: WriteMDdto) {
    var response;
    var destpath;
    try {
      if (writeMDdto.AFSK) {
        var afskKey = Object.keys(writeMDdto.AFSK);
        var afskVal = Object.values(writeMDdto.AFSK);
        var key: any ='CK:' +writeMDdto.CK +':FNGK:'+writeMDdto.FNGK+':FNK:'+writeMDdto.FNK+':CATK:'+writeMDdto.CATK+':AFGK:'+writeMDdto.AFGK+':AFK:'+writeMDdto.AFK+':AFVK:'+writeMDdto.AFVK+':'+afskKey[0];
      } else{
        throw 'AFSK is empty'
      }
      if (writeMDdto.PATH) {
        destpath = '.' + writeMDdto.PATH;
      } else {
        destpath = '$';
      }
      response = await redis.call('JSON.SET',key,destpath,JSON.stringify(afskVal[0]));
      return response;
    } catch (error) {
      throw new HttpException(error,HttpStatus.BAD_REQUEST);
    }
  }

  async readKeys(input) {
    var response = [];
    var keyArray = [];
    var spiltArray = [];
    var finalArr = [];   

    if (input.AFSK && input.AFSK.length > 0) {
      var res = await this.readMDK(input);
      return res;
    }
    for (const catk of input.CATK.length ? input.CATK : ['*']) {
      for (const afgk of input.AFGK.length ? input.AFGK : ['*']) {
        for (const afk of input.AFK.length ? input.AFK : ['*']) {
          for (const afvk of input.AFVK.length ? input.AFVK : ['*']) {
            const key = `CK:${input.CK}:FNGK:${input.FNGK}:FNK:${input.FNK}:CATK:${catk}:AFGK:${afgk}:AFK:${afk}:AFVK:${afvk}`;
            response.push(key);
          }
        }
      }
    }
    const trimTrailingStars = (str: string): string => {
      const parts = str.split(':');
      while (parts.length > 0 && parts[parts.length - 1] === '*') {
        parts.pop();
      }
      return parts.join(':');
    };

    var finalkey = response.map(trimTrailingStars);
    for (var i = 0; i < finalkey.length; i++) {
      var getkeys = await this.redisService.getKeys(finalkey[i]);
      keyArray.push(getkeys);
    }
    for (var j = 0; j < keyArray.length; j++) {
      for (var k = 0; k < keyArray[j].length; k++) {
        spiltArray.push(keyArray[j][k].split(':'));
      }
    }
    for (let i = 0; i < spiltArray.length; i++) {
      if (input.CATK.includes(spiltArray[i][7]) || input.CATK.length == 0) {
        if (input.AFGK.includes(spiltArray[i][9]) || input.AFGK.length == 0) {
          if (input.AFK.includes(spiltArray[i][11]) || input.AFK.length == 0) {
            if (
              input.AFVK.includes(spiltArray[i][13]) ||
              input.AFVK.length == 0
            ) {
              finalArr.push(spiltArray[i]);
            }
          }
        }
      }
    }

    var finalres: any = await this.getFormat(finalArr, input);
    return finalres;
  }

  async getFormat(finalArr, input): Promise<any> {
    const output = { CKList: [] };

    finalArr.forEach((item) => {
      const ck = item[1];
      const fngk = item[3];
      const fnk = item[5];
      const catk = item[7];
      const afgk = item[9];
      const afk = item[11];
      const afvk = item[13];
      const afsk = item[14];

      let ckObj = output.CKList.find((obj) => obj.CK === ck);
      if (!ckObj) {
        ckObj = { CK: ck, FNGKList: [] };
        output.CKList.push(ckObj);
      }

      let fngkObj = ckObj.FNGKList.find((obj) => obj.FNGK === fngk);
      if (!fngkObj) {
        fngkObj = { FNGK: fngk, FNKList: [] };
        ckObj.FNGKList.push(fngkObj);
      }

      let fnkObj = fngkObj.FNKList.find((obj) => obj.FNK === fnk);
      if (!fnkObj) {
        fnkObj = { FNK: fnk, CATKList: [] };
        fngkObj.FNKList.push(fnkObj);
      }

      let catkObj = fnkObj.CATKList.find((obj) => obj.CATK === catk);
      if (!catkObj) {
        catkObj = { CATK: catk, AFGKList: [] };
        fnkObj.CATKList.push(catkObj);
      }

      let afgkObj = catkObj.AFGKList.find((obj) => obj.AFGK === afgk);
      if (!afgkObj) {
        afgkObj = { AFGK: afgk, AFKList: [] };
        catkObj.AFGKList.push(afgkObj);
      }

      let afkObj = afgkObj.AFKList.find((obj) => obj.AFK === afk);
      if (!afkObj) {
        afkObj = { AFK: afk, AFVKList: [] };
        afgkObj.AFKList.push(afkObj);
      }

      let afvkObj = afkObj.AFVKList.find((obj) => obj.AFVK === afvk);
      if (!afvkObj) {
        afvkObj = { AFVK: afvk, AFSKList: [] };
        afkObj.AFVKList.push(afvkObj);
      }
      let afskObj = afvkObj.AFSKList.find((obj) => obj.AFSK === afsk);
      if (!afskObj) {
        afskObj = afsk;
        afvkObj.AFSKList.push(afskObj);
      }
    });

    var jsonPath;
    if (input.AFVK.length > 0) {
      jsonPath = 'CKList.FNGKList.FNKList.CATKList.AFGKList.AFKList.AFVKList';
    } else if (input.AFK.length > 0) {
      jsonPath = 'CKList.FNGKList.FNKList.CATKList.AFGKList.AFKList';
    } else if (input.AFGK.length > 0) {
      jsonPath = 'CKList.FNGKList.FNKList.CATKList.AFGKList';
    } else if (input.CATK.length > 0) {
      jsonPath = 'CKList.FNGKList.FNKList.CATKList';
    } else {
      jsonPath = 'CKList.FNGKList.FNKList.CATKList';
    }
    const expression = jsonata(jsonPath);
    var customresult = await expression.evaluate(output);
    const removeKeys = (obj: any, keys: string[]): any => {
      if (Array.isArray(obj)) return obj.map((item) => removeKeys(item, keys));
      if (typeof obj === 'object' && obj !== null) {
        return Object.keys(obj).reduce((previousValue: any, key: string) => {
          return keys.includes(key)
            ? previousValue
            : { ...previousValue, [key]: removeKeys(obj[key], keys) };
        }, {});
      }
      return obj;
    };
    var finalResponse;
    if (input.stopsAt) {
      if (input.stopsAt == 'AFVK') {
        finalResponse = await removeKeys(customresult, ['AFSKList']);
      } else if (input.stopsAt == 'AFK') {
        finalResponse = await removeKeys(customresult, ['AFVKList']);
      } else if (input.stopsAt == 'AFGK') {
        finalResponse = await removeKeys(customresult, ['AFKList']);
      } else if (input.stopsAt == 'CATK') {
        finalResponse = await removeKeys(customresult, ['AFGKList']);
      } else {
        return customresult;
      }
      return finalResponse;
    } else {
      return customresult;
    }
  }

  //  async deleteAPI(readMDdto) {
  //         try {
  //           var result
  //           var del,res
  //           var delArr = []
  //           var delFlg = 0
  //           if(readMDdto.AFSK.length == 0){
  //              del = "CK:"+readMDdto.CK+':FNGK:'+readMDdto.FNGK+':FNK:'+readMDdto.FNK+':CATK:'+readMDdto.CATK+':AFGK:'+readMDdto.AFGK+':AK:'+readMDdto.AK+':AFVK:'+readMDdto.AFVK
  //              res = await this.redisService.getKeys(del);
  //              if(res.length>0){
  //                 for(var i=0;i<res.length;i++){
  //                   result =  await this.redisService.deleteKey(res[i])
  //                   if(result == 1){
  //                     delFlg++
  //                   }
  //                 }
  //                 if(delFlg == res.length){
  //                   return "Key Deleted Successfully"
  //                 }
  //             }else{
  //               throw new BadRequestException("Key Not Found")
  //             }
  //           }else{
  //             for(var i=0;i<readMDdto.AFSK.length;i++){
  //               del = "CK:"+readMDdto.CK+':FNGK:'+readMDdto.FNGK+':FNK:'+readMDdto.FNK+':CATK:'+readMDdto.CATK+':AFGK:'+readMDdto.AFGK+':AK:'+readMDdto.AK+':AFVK:'+readMDdto.AFVK+':'+readMDdto.AFSK[i]
  //               result = await this.redisService.deleteKey(del)
  //               if(result == 1){
  //                 delArr.push(del+", Deleted Successfully")
  //               }else{
  //                 delArr.push(del+", Not Found")
  //               }
  //             }
  //             return delArr
  //           }
  //         } catch (error) {
  //           throw error;
  //         }
  //  }

   async transferData(sourceKey: string, destinationKey: string, action:any){
    try {
      const srckeyChk = await redis.keys(sourceKey+'*')
      const deskeyChk = await redis.keys(destinationKey+'*')
      if(action == 'COPY'){
        if(deskeyChk.length > 0){
          throw new BadRequestException('Destination Key already exists');
        }
        else{
          if(srckeyChk.length > 0){
            var resFlg = 0
            for(var i=0;i<srckeyChk.length;i++){
              const result = await redis.call('COPY', srckeyChk[i], `${destinationKey}${srckeyChk[i].replace(sourceKey, '')}`);
              if(result == 1){
                resFlg++
              }
            }
            if(resFlg == srckeyChk.length){
              return {message:`Key copied from ${sourceKey} to ${destinationKey}`};
            }
          }else{
            throw new BadRequestException('Source Key does not exists to copy');
          }
        }
      }
      else if(action == 'MOVE'){
        if(deskeyChk.length > 0){
          throw new BadRequestException('Destination Key already exists');
        }else{
          if(srckeyChk.length > 0){
            var resFlg = 0
            for(var i=0;i<srckeyChk.length;i++){
              var srcVal = await redis.call('JSON.GET', srckeyChk[i]);
              if(srcVal){
                const result = await this.redisService.renameKey(srckeyChk[i], `${destinationKey}${srckeyChk[i].replace(sourceKey, '')}`);
                if(result == 'OK'){
                  await redis.call('DEL', srckeyChk[i]);
                  resFlg++
                }
              }
            }
            if(resFlg == srckeyChk.length){
              return {message:`Value moved from ${sourceKey} to ${destinationKey}`};
            }
          }
          else{
            throw new BadRequestException('Source Key does not exists to move');
          }
        }
      }
      else{
        throw new BadRequestException('Invalid Action')
      }
    } catch (error) {
      throw error;
    }
   }

   async renamekey(oldKey:any,newKey:any){
    const keyChk = await redis.keys(oldKey+'*')
    if(keyChk.length > 0){
      var resFlg = 0
      for(var i=0;i<keyChk.length;i++){
        const result = await this.redisService.renameKey(keyChk[i], `${newKey}${keyChk[i].replace(oldKey, '')}`);
        if(result == 'OK'){
         resFlg++
        }
      }
      if(resFlg == keyChk.length){
        return {message:`Key Renamed from ${oldKey} to ${newKey}`};
      }
    }else{
      throw new BadRequestException('Old Key does not exists to rename');
    }
   }

   async getpagination(key:any,page,count,filter?){
    this.logger.log('Pagination Process started')
    try{    
      var dsObject = JSON.parse(await this.redisService.getJsonData(key+'DS_Object'))     
      if(dsObject){        
        var data = dsObject.data    
        if(!page)
        page = 1
        let rule:any;
        let finalData = [];
        var filArray = []    
        var start = (page - 1) * count
        var end = start+count
          if(filter){           
            var json = JSON.parse(await this.redisService.getJsonDataWithPath(filter.ufKey,'.mappedData.artifact.node'))
            if(json?.length > 0){
              for(var s=0;s<json.length;s++){
                if(json[s].nodeId == filter.nodeId){ 
                  rule = json[s].rule          
                }
              }
            }            
              if(rule?.nodes?.length && rule?.edges?.length) {
                  for (let j = 0; j < data.length; j++) {
                    let result: any = await this.gorule.goRule(rule,data[j]);
                    if (result?.error) {
                      break;
                    } else if (result?.result?.output === true) {
                      finalData.push(data[j]);
                    }
                  }
                
                  for(var i=start;i<end;i++){   
                    if(finalData[i] != null)     
                    filArray.push(finalData[i])     
                  }
                  this.logger.log('Pagination Process completed')
                  return {records:filArray,totalRecords:finalData.length} 
              }
              else{
                throw 'Invalid rule'
              }
          }    
       
          for(var i=start;i<end;i++){   
           if(data[i] != null)     
            filArray.push(data[i])     
          }
          this.logger.log('Pagination Process completed')
          return {records:filArray,totalRecords:data.length} 
      }     
      }catch(err){       
        if(err.message){
          throw new BadRequestException(err.message)
        }else{
          throw new BadRequestException(err)
        }       
      }
    }

    async getRAndSetMAFR(input){
      try{
      let splitkey:WriteMDdto = new WriteMDdto()
      let response: any = {}
      let resArr = [],newsetArr
      var CK = input.CK
      var FNGK = input.FNGK
      var keys = await this.redisService.getKeys('CK:'+CK+':FNGK:'+FNGK)
     
      if(keys.length > 0){
        for(var i=0;i<keys.length;i++){
        
        let skey = await this.getRecentKeyStructure(keys[i])
          splitkey['SOURCE'] = input.SOURCE
          splitkey['TARGET'] = input.TARGET
          splitkey['CK'] = skey.CK
          splitkey['FNGK'] = skey.FNGK
          splitkey['FNK'] = skey.FNK
          splitkey['CATK'] = skey.CATK
          splitkey['AFGK'] = skey.AFGK
          splitkey['AFK'] = skey.AFK
          splitkey['AFVK'] = skey.AFVK
          splitkey['AFSK'] = {[`${skey.AFSK}`]:{}}          
        response = await this.getRedisTosetMongo(splitkey)
       // console.log('RES',response);
        
        if(response && Object.keys(response).length > 0){          
          resArr.push(response.insertedId.toString())
        }
        
        } 
        return resArr.filter((item,
          index) => resArr.indexOf(item) === index)
      }else{
        return 'Key not found'
      }
    }catch(err){
      throw new BadRequestException(err)
    }

    }

    
    async getMAndSetRAFR(input){
      try{      
      let splitkey:WriteMDdto = new WriteMDdto()
      let response: any = {}   
      let resArr = []  
      var keys = await this.getMongoKeys(input)
     
      if(keys.length > 0){
        for(var i=0;i<keys.length;i++){
       
        let skey = await this.getRecentKeyStructure(keys[i])
          splitkey['SOURCE'] = input.SOURCE
          splitkey['TARGET'] = input.TARGET
          splitkey['CK'] = skey.CK
          splitkey['FNGK'] = skey.FNGK
          splitkey['FNK'] = skey.FNK
          splitkey['CATK'] = skey.CATK
          splitkey['AFGK'] = skey.AFGK
          splitkey['AFK'] = skey.AFK
          splitkey['AFVK'] = skey.AFVK
          splitkey['AFSK'] = {[`${skey.AFSK}`]:{}}          
          response = await this.getMongoTosetRedis(splitkey)
          console.log(response)
          if(response && Object.keys(response).length > 0){          
            resArr.push(response.insertedId.afuid)
          }        
        }      
        return resArr.filter((item,
          index) => resArr.indexOf(item) === index)
      }else{
        return 'Document not Found'
      }
    }catch(err){
      throw new BadRequestException(err)
    }
    }

    async getMongoKeys(input:any){
      try {    
        var getKeyarr = [];
        let querypath: any = {};    
        var CK = input.CK
        var FNGK = input.FNGK
        var FNK = input.FNK
        var CATK = input.CATK
        var AFGK = input.AFGK
        var AFK = input.AFK
        var AFVK = input.AFVK    
           
        if (FNGK) {
          querypath['FNGK'] =  FNGK ;
        }
        if (FNK) {
          querypath['FNK'] =  FNK ;
        }
        if (CATK) {
          querypath['CATK'] =  CATK ;
        }    
        if (AFGK) {
          querypath['AFGK'] =  AFGK ;
        }    
        if (AFK) {
          querypath['AFK'] =  AFK ;
        }    
        if (AFVK) {
          querypath['AFVK'] = AFVK ;
        }  
        const docs = await this.model.db.collection(CK).find(querypath,{"projection":{_id:0}}).toArray()
       
        if(docs.length == 0){
          throw `Key not found in collection ${CK}`
        }
       
        const processObject = (obj) => {    
          const keys = Object.keys(obj).slice(0, -1);        
          const values = Object.values(obj).slice(0, -1);      
          var formatArr = []
          for(var o=0;o<keys.length;o++){
            formatArr.push(keys[o],values[o])
          }
         
          const nestedKeys = obj.AFSK ? Object.keys(obj.AFSK) : [];
          if (nestedKeys.length > 0 && nestedKeys.length === 1) {
            var response = [...formatArr, nestedKeys];
            response.unshift('CK:'+CK);
            getKeyarr.push(response.join(':'));              
          } else {
            for (var i = 0; i < nestedKeys.length; i++) {
              var response = [...formatArr, nestedKeys[i]];          
              response.unshift('CK:'+CK);
              getKeyarr.push(response.join(':'));        
            }
          }
        };
   
        const processDocs = (docs) => {    
          getKeyarr = [];
          docs.forEach(processObject);
          return getKeyarr;
        };
        const result = processDocs(docs);    
        return result  
      } catch (error) {
          throw new BadGatewayException(error)
      }  
    }

    async  getRecentKeyStructure(val: string) {
      const keys = ['CK', 'FNGK', 'FNK', 'CATK', 'AFGK', 'AFK', 'AFVK', 'AFSK'];
      const result: Record<string, string> = {};
      const parts = val.split(":");
      let index = 0;
      for (const key of keys) {
        if (index < parts.length - 1) {
          result[key] = parts[index + 1]; 
          index += 2; 
        }
      }
     
      if(parts.length > 14 && parts[parts.length - 1] != 'undefined'){
        result["AFSK"] = parts[parts.length - 1];        
      } 
    
      return result;
    }

    async getRedisTosetMongo(input: WriteMDdto){   
      try {
        var afskkey = Object.keys(input.AFSK)
       var response: any = JSON.parse(await this.readMDK({
        CK:input.CK,
        FNGK:input.FNGK,
        FNK:input.FNK,
        CATK:input.CATK,
        AFGK:input.AFGK,
        AFK:input.AFK,
        AFVK:input.AFVK,
        AFSK:afskkey[0]
       }))  
      //console.log('response',response);
      
        if(response != null && Object.keys(response).length > 0){        
            var mongosetkey = await this.mongoService.setKey({
              CK:input.CK,
              FNGK:input.FNGK,
              FNK:input.FNK,
              CATK:input.CATK,
              AFGK:input.AFGK,
              AFK:input.AFK,
              AFVK:input.AFVK,
              AFSK:{[afskkey[0]]:response}
            })         
          //  console.log('mongosetkey',mongosetkey);
            
            if(mongosetkey.message == "Value Inserted"){
              var afuIdKey = 'CK:'+input.CK+':FNGK:'+input.FNGK+':FNK:'+input.FNK+':CATK:'+input.CATK+':AFGK:'+input.AFGK+':AFK:'+input.AFK+':AFVK:'+input.AFVK+':artifactId'
              var afuIdVal = {"afuid":mongosetkey.insertedId.toString()}
              var res = await this.redisService.setJsonData(afuIdKey,JSON.stringify(afuIdVal))  
              if(res == 'Value Stored'){
                return {"message":"Key get from redis and Inserted to Mongo","insertedId":mongosetkey.insertedId}
              }          
            }else{
              return mongosetkey
            }  
        }else{
          return response
        }
      } catch (error) {
        throw error
      } 
    }

    async getMongoTosetRedis(input){
      var CK = input.CK
      var FNGK = input.FNGK
      var FNK = input.FNK
      var CATK = input.CATK
      var AFGK = input.AFGK
      var AFK = input.AFK
      var AFVK = input.AFVK
      var AFSK = input.AFSK
   
      var afskkey = Object.keys(AFSK)
     var response = await this.model.db.collection(CK).find({'FNGK':FNGK,'FNK':FNK,'CATK':CATK,'AFGK':AFGK,'AFK':AFK,'AFVK':AFVK},{projection:{['AFSK.'+afskkey[0]]:1,_id:1}}).toArray();
    
     var mongoId = response[0]._id
   
      var afskvalue = Object.values(response[0].AFSK)
     
      if(response.length >0){
          var afsk = 'CK:'+input.CK+':FNGK:'+input.FNGK+':FNK:'+input.FNK+':CATK:'+input.CATK+':AFGK:'+input.AFGK+':AFK:'+input.AFK+':AFVK:'+input.AFVK+':'+afskkey[0]
          var result = await this.redisService.setJsonData(afsk,JSON.stringify(afskvalue[0]))
            var afuIdKey = 'CK:'+input.CK+':FNGK:'+input.FNGK+':FNK:'+input.FNK+':CATK:'+input.CATK+':AFGK:'+input.AFGK+':AFK:'+input.AFK+':AFVK:'+input.AFVK+':artifactId'
            var afuIdVal = {"afuid":mongoId._id.toString()}
            var res = await this.redisService.setJsonData(afuIdKey,JSON.stringify(afuIdVal))
           
            if(res == 'Value Stored' && result == 'Value Stored'){
              return {"message":"Key get from Mongo and Inserted to Redis","insertedId":afuIdVal}
            }
     }else{
      return result
     }
    }
    
    async updateRedisToMongo(input:any){
      try {       
        var afskKey = Object.keys(input.AFSK)
        var response: any = JSON.parse(await this.readMDK({ CK:input.CK,
          FNGK:input.FNGK,
          FNK:input.FNK,
          CATK:input.CATK,
          AFGK:input.AFGK,
          AFK:input.AFK,
          AFVK:input.AFVK,
          AFSK:afskKey[0]}))
        if(response != null && Object.keys(response).length > 0){
          var mongoUpdkey = await this.mongoService.updateKey({
            CK:input.CK,
            FNGK:input.FNGK,
            FNK:input.FNK,
            CATK:input.CATK,
            AFGK:input.AFGK,
            AFK:input.AFK,
            AFVK:input.AFVK,
            AFSK:{[afskKey[0]]:response}
          })
          if(mongoUpdkey.message == 'Updated Successfully'){
            var afuIdKey = 'CK:'+input.CK+':FNGK:'+input.FNGK+':FNK:'+input.FNK+':CATK:'+input.CATK+':AFGK:'+input.AFGK+':AK:'+input.AK+':AFVK:'+input.AFVK+':artifactId'
            var afuIdVal = {"afuid":mongoUpdkey._id.toString()}
            var res = await this.redisService.setJsonData(afuIdKey,JSON.stringify(afuIdVal))  
            if(res == 'Value Stored'){
              return 'Key get from redis and Updated to Mongo '
            }          
          }else{
            return mongoUpdkey
          }        
        }     
        
      } catch (error) {
        throw error
      }     
    }

    async updateMongoToRedis(input:WriteMDdto){
      try {
        var CK = input.CK
        var FNGK = input.FNGK
        var FNK = input.FNK
        var CATK = input.CATK
        var AFGK = input.AFGK
        var AFK = input.AFK
        var AFVK = input.AFVK
        var AFSK = input.AFSK  
        var afskkey = Object.keys(AFSK)
       
        var response: any = await this.model.db.collection(CK).find({'FNGK':FNGK,'FNK':FNK,'CATK':CATK,'AFGK':AFGK,'AFK':AFK,'AFVK':AFVK},{projection:{['AFSK.'+afskkey[0]]:1,_id:1}}).toArray();
     
        if(response.length > 0){
          var afskvalue = Object.values(response[0].AFSK)  
          var key = 'CK:'+input.CK+':FNGK:'+input.FNGK+':FNK:'+input.FNK+':CATK:'+input.CATK+':AFGK:'+input.AFGK+':AFK:'+input.AFK+':AFVK:'+input.AFVK+':'+afskkey[0]
           var result =  await this.redisService.setJsonData(key,JSON.stringify(afskvalue[0]))
           var afuIdKey = 'CK:'+input.CK+':FNGK:'+input.FNGK+':FNK:'+input.FNK+':CATK:'+input.CATK+':AFGK:'+input.AFGK+':AFK:'+input.AFK+':AFVK:'+input.AFVK+':artifactId'
           var afuIdVal = {"afuid":response[0]._id.toString()}
           var res = await this.redisService.setJsonData(afuIdKey,JSON.stringify(afuIdVal))
           if(result == 'Value Stored'&& res == 'Value Stored'){
            return 'Key get from Mongo and Updated to Redis'
           }else{
            return result
           }
        }
       
      } catch (error) {
        throw error
      }    
    }

    async Sentmail(email){
      try {       
        return 'Mail sent successfully'
      } catch (err) {
        return err;
      }    
    }

  //===tp=====
 
  async getTenantPrcLogs(input){
    try {
      if(!input.tenant)
       return 'Invalid payload'

      var tenantdata:any
      let querypath: any = {'CK':input.tenant}; 
     
     if(input.fabric != undefined || input.fabric != null){
      if (input.fabric.length > 0) {
        querypath['FNK'] = { $in: input.fabric };       
      }
     }
      if(input.appGroup != undefined || input.appGroup != null){
      if (input.appGroup.length > 0) {
        querypath['CATK'] = { $in: input.appGroup };        
      }
    }
    if(input.app != undefined || input.app != null){
      if (input.app.length > 0) {
        querypath['AFGK'] = { $in: input.app };       
      }
    }
    if(input.user != undefined || input.user != null){
      if (input.user.length > 0) {
        querypath['USER'] = { $in: input.user };       
      }
    }
     
      if (input.FromDate && input.ToDate) {
        querypath['DATE'] = { $gte: input.FromDate, $lte: input.ToDate };       
      }
      else if (input.FromDate) {
        var date = format(new Date(), 'yyyy-MM-dd').toString()
        querypath['DATE'] = { $gte: input.FromDate, $lte: date };
      }
      else if (input.ToDate) {
        var date = format(new Date(), 'yyyy-MM-dd').toString()
        querypath['DATE'] = { $gte: date, $lte: input.ToDate };
      }
        let page = input.page;
        let limit = input.limit;    
        const start = (page - 1) * limit;
        const end = start+limit
           
      if(input.searchParam){       
        var searchpath = {$or:[
          {'CK': { $regex: input.searchParam,$options: 'i'}},
          {'FNGK': { $regex: input.searchParam,$options: 'i'}},
          {'FNK': { $regex: input.searchParam,$options: 'i'}},
          {'CATK': { $regex: input.searchParam,$options: 'i'}},
          {'AFGK': { $regex: input.searchParam,$options: 'i'}},
          {'AFK': { $regex: input.searchParam,$options: 'i'}},
          {'AFVK': { $regex: input.searchParam,$options: 'i'}},
          {'USER': { $regex: input.searchParam,$options: 'i'}},
          {'DATE': { $regex: input.searchParam,$options: 'i'}},      
          {['AFSK.'+input.searchParam]: {$exists:true}},        
        ]}    
        tenantdata = await this.model.db.collection('TPL').find({$and:[querypath,searchpath]}).toArray();        
      }else{        
        tenantdata = await this.model.db.collection('TPL').find(querypath).toArray();
      }
     
      if(tenantdata.length > 0){            
          var finalArr = []
          if(page && limit){
            for(var i=start; i<end; i++){            
              if(tenantdata[i])
                finalArr.push(tenantdata[i])
            }
          }          
         const totalDocuments = tenantdata.length
         const totalPages = Math.ceil(totalDocuments / limit);       
         return {
          data: finalArr,
          page,
          limit,
          totalPages,
          totalDocuments
         };
      }else{
        return 'Given User data is empty'
      }    
 
    } catch (error) {
      if(error.message){
        throw new BadRequestException(error.message)
      }else{
        throw new BadRequestException(error)
      }      
    }
  }
  
  async prcLogs(): Promise<any> {
    try {
      var msgid = []
      var strmarr = []    
      var setkey:any
      var messages = await this.redisService.getStreamRange('TPL')  //TPL
     
      messages.forEach(([msgId, value]) => {
        msgid.push(msgId)
        strmarr.push(value)
      });
   
      if(msgid.length > 0){
        for (var a = 0; a < msgid.length; a++) {    
          var isexist  
          var valueexist 
          var AFSK:any
          var key = await this.getRecentKeyStructure(strmarr[a][0])
          var date = new Date(Number(msgid[a].split("-")[0]));
          var entryId = format(date, 'yyyy-MM-dd')
      
          var value = JSON.parse(strmarr[a][1])
          value['DateAndTime']=format(date, 'yyyy-MM-dd HH:mm:ss:SSS')
       
          var CK = key.CK
          var FNGK = key.FNGK
          var FNK = key.FNK
          var CATK = key.CATK
          var AFGK = key.AFGK
          var AFK = key.AFK
          var AFVK = key.AFVK 
          var USER = value.sessioninfo.user  
          var DATE = entryId      
          AFSK = key.AFSK
   
          if(CK && FNGK && FNK && CATK && AFGK && AFK && AFVK && AFSK){                  
            isexist = await this.model.db.collection('TPL').find({'CK':CK,'FNGK':FNGK,'FNK':FNK,'CATK':CATK,'AFGK':AFGK,'AFK':AFK,'AFVK':AFVK,'USER':USER,'DATE':DATE,['AFSK.'+AFSK]:{$exists:true}},{projection:{_id:1}}).toArray()
          }
          if(isexist.length > 0){
            if(AFSK){            
              valueexist = await this.model.db.collection('TPL').find({['AFSK.'+AFSK]:{$elemMatch:value}}).toArray()
            }

            if(valueexist.length > 0){
              if(AFSK){
                await this.model.db.collection('TPL').updateOne({_id: valueexist[0]['_id']},{$set: {['AFSK.'+AFSK]:[value]}as any})
              }             
            }else{   
              if(AFSK){
                await this.model.db.collection('TPL').updateOne({_id: isexist[0]['_id']},{$push: {['AFSK.'+AFSK]:value}as any})          
              }
            }
          }
          else{
            if(AFSK){
              setkey = await this.model.db.collection('TPL').insertOne({
                "CK":CK,
                "FNGK":FNGK,
                  "FNK":FNK,
                  "CATK":CATK,
                  "AFGK":AFGK,
                  "AFK":AFK,
                  "AFVK":AFVK,
                  'USER':USER,
                  'DATE':DATE,
                  "AFSK":{[AFSK]:[value] }         
              })  
            }
          }
        }
  } 
   return 'Success'
    } catch (error) {
      throw error
    }
  }

  async expLogs(): Promise<any> {
    try {
      var msgid = []
      var strmarr = [] 
      var setkey    
      var messages = await this.redisService.getStreamRange('TSL')  //TSL TEExceptionLogs
     
      messages.forEach(([msgId, value]) => {
        msgid.push(msgId)
        strmarr.push(value)
      });
  
      if(msgid.length > 0){
        for (var a = 0; a < msgid.length; a++) { 
         var isexist
         var valueexist
         var AFSK:any
         var key = await this.getRecentKeyStructure(strmarr[a][0])
                  
         var date = new Date(Number(msgid[a].split("-")[0]));
         var entryId = format(date, 'yyyy-MM-dd')
         var value = JSON.parse(strmarr[a][1])        
         value['DateAndTime']=format(date, 'yyyy-MM-dd HH:mm:ss:SSS')
       
         var CK = key.CK
         var FNGK = key.FNGK
         var FNK = key.FNK
         var CATK = key.CATK
         var AFGK = key.AFGK
         var AFK = key.AFK
         var AFVK = key.AFVK 
         var USER = value.sessionInfo.user  // user
         var DATE = entryId  
         AFSK = key.AFSK       
       
        if(CK && FNGK && FNK && CATK && AFGK && AFK && AFVK && AFSK){                  
          isexist = await this.model.db.collection('TSL').find({'CK':CK,'FNGK':FNGK,'FNK':FNK,'CATK':CATK,'AFGK':AFGK,'AFK':AFK,'AFVK':AFVK,'USER':USER,'DATE':DATE,['AFSK.'+AFSK]:{$exists:true}},{projection:{_id:1}}).toArray()
        }
        else if(CK && FNGK && FNK && CATK && AFGK && AFK && AFVK){
          isexist = await this.model.db.collection('TSL').find({'CK':CK,'FNGK':FNGK,'FNK':FNK,'CATK':CATK,'AFGK':AFGK,'AFK':AFK,'AFVK':AFVK,'USER':USER,'DATE':DATE,['AFSK.logInfo']:{$exists:true}},{projection:{_id:1}}).toArray()
        }  
     
          if (isexist.length > 0) {
            if (AFSK) {
              valueexist = await this.model.db.collection('TSL').find({ ['AFSK.' + AFSK]: { $elemMatch: value } }).toArray()
            } else {
              valueexist = await this.model.db.collection('TSL').find({ ['AFSK.logInfo']: { $elemMatch: value } }).toArray()
            }


            if (valueexist.length > 0) {
              if (AFSK) {
                await this.model.db.collection('TSL').updateOne({ _id: valueexist[0]['_id'] }, { $set: { ['AFSK.' + AFSK]: [value] } as any })
              } else {
                await this.model.db.collection('TSL').updateOne({ _id: valueexist[0]['_id'] }, { $set: { ['AFSK.logInfo']: [value] } as any })
              }
            } else {
              if (AFSK) {
                setkey = await this.model.db.collection('TSL').updateOne({ _id: isexist[0]['_id'] }, { $push: { ['AFSK.' + AFSK]: value } as any })
              } else {
                setkey = await this.model.db.collection('TSL').updateOne({ _id: isexist[0]['_id'] }, { $push: { ['AFSK.logInfo']: value } as any })
              }
            }
          }
          else {
            if (AFSK) {
              setkey = await this.model.db.collection('TSL').insertOne({
                "CK": CK,
                "FNGK": FNGK,
                "FNK": FNK,
                "CATK": CATK,
                "AFGK": AFGK,
                "AFK": AFK,
                "AFVK": AFVK,
                "USER": USER,
                "DATE": DATE,
                "AFSK": { [AFSK]: [value] }

              })
            } else {
              setkey = await this.model.db.collection('TSL').insertOne({
                "CK": CK,
                "FNGK": FNGK,
                "FNK": FNK,
                "CATK": CATK,
                "AFGK": AFGK,
                "AFK": AFK,
                "AFVK": AFVK,
                "USER": USER,
                "DATE": DATE,
                "AFSK": { 'logInfo': [value] }

              })
            }
          }
    }
  }
   return 'Success'
    } catch (error) {
      throw error
    }
  }
  
  async getTenantExceptionlogs(input){
    try {

      if(!input.tenant)
       return 'Invalid payload'

      var tenantdata:any
      let querypath: any = {'CK':input.tenant};  
     
      if(input.fabric != undefined || input.fabric != null){
        if (input.fabric.length > 0) {
          querypath['FNK'] = { $in: input.fabric };
        }
       }
        if(input.appGroup != undefined || input.appGroup != null){
        if (input.appGroup.length > 0) {
          querypath['CATK'] = { $in: input.appGroup };
        }
      }
      if(input.app != undefined || input.app != null){
        if (input.app.length > 0) {
          querypath['AFGK'] = { $in: input.app };
        }
      }
      if(input.user != undefined || input.user != null){
        if (input.user.length > 0) {
          querypath['USER'] = { $in: input.user };
        }
      }

      if(input.FromDate && input.ToDate){
        querypath['DATE'] = {$gte:input.FromDate,$lte:input.ToDate};
      }
      else if(input.FromDate){
        var date =  format(new Date(),'yyyy-MM-dd').toString()
        querypath['DATE'] = {$gte:input.FromDate,$lte:date};
      }
      else if(input.ToDate){
        var date =  format(new Date(),'yyyy-MM-dd').toString()
        querypath['DATE'] = {$gte:date,$lte:input.ToDate};
      }
     
        let page = input.page;
        let limit = input.limit;    
        const start = (page - 1) * limit;
        const end = start+limit

      if(input.searchParam){
        var searchpath = {$or:[
          {'CK': { $regex: input.searchParam,$options: 'i'}},
          {'FNGK': { $regex: input.searchParam,$options: 'i'}},
          {'FNK': { $regex: input.searchParam,$options: 'i'}},
          {'CATK': { $regex: input.searchParam,$options: 'i'}},
          {'AFGK': { $regex: input.searchParam,$options: 'i'}},
          {'AFK': { $regex: input.searchParam,$options: 'i'}},
          {'AFVK': { $regex: input.searchParam,$options: 'i'}},
          {'USER': { $regex: input.searchParam,$options: 'i'}},
          {'DATE': { $regex: input.searchParam,$options: 'i'}},      
          {['AFSK.'+input.searchParam]: {$exists:true}},        
        ]} 
        tenantdata = await this.model.db.collection('TSL').find({$and:[querypath,searchpath]}).toArray();           
      }else{
        tenantdata = await this.model.db.collection('TSL').find(querypath).toArray();
      }
     
      if(tenantdata.length > 0){ 
        var finalArr = []
        if(page && limit){
          for(var i=start; i<end; i++){
            if(tenantdata[i])
              finalArr.push(tenantdata[i])
          }
        }       
       
        const totalDocuments = tenantdata.length
        const totalPages = Math.ceil(totalDocuments / limit);
    
        return {
          data: finalArr,
          page,
          limit,
          totalPages,
          totalDocuments
        };
      }else{
        return 'Given User data is empty'
      }  
    } catch (error) {
      if(error.message){
        throw new BadRequestException(error.message)
      }else{
        throw new BadRequestException(error)
      }  
    }
  }

  async throwCustomException(error: any) {
    console.log('ERROR', error);

    if (error instanceof CustomException) {
      throw error; // Re-throw the specific custom exception
    }
    throw new CustomException(
      'An unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }


  async getAllClientTenant(type?: string, clientCode?: string) {
    try {
      switch (type) {
        case 'c':
          const keysOfClient = await this.redisService.getKeys(
            // 'T:C:PROFILE:setup:NA',
            'CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK',
          );
          //C for fetching clients
          if (Array.isArray(keysOfClient) && keysOfClient.length) {
            let clients = new Set([]);
            for (let i = 0; i < keysOfClient.length; i++) {
              const client = keysOfClient[i].split(':');
              // clients.add(client[5]);
              clients.add(client[9]);
            }
            return Array.from(clients);
          } else {
            throw new NotFoundException('No clients exists');
          }
        default:
          if (clientCode) {
            const clientProfile = JSON.parse(
              await this.redisService.getJsonData(
                `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`,
              ),
            );
            const tenantList = [];
            if (clientProfile && clientProfile.tenantList) {
              for (const tenantCode of clientProfile.tenantList) {
                const tenantProfile = JSON.parse(
                  await this.redisService.getJsonData(
                    `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenantCode}:AFK:PROFILE:AFVK:v1:tpc`,
                  ),
                );
                tenantList.push({
                  code: tenantProfile.Code,
                  name: tenantProfile.Name,
                  logo: tenantProfile.Logo,
                });
              }
            }
            return tenantList;
          }

          const keysOfTenant = await this.redisService.getKeys(
            // 'TGA:T:PROFILE:setup:NA',
            'CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK',
          );

          //T for fetching tenants
          if (Array.isArray(keysOfTenant) && keysOfTenant.length) {
            let tenants = new Set([]);
            for (let i = 0; i < keysOfTenant.length; i++) {
              const tenant = keysOfTenant[i].split(':');
              // tenants.add(tenant[5]);
              tenants.add(tenant[9]);
            }
            return Array.from(tenants);
          } else {
            throw new NotFoundException('No tenant exists');
          }
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  // async signIntoTorus(
  //   client: string,
  //   username: string,
  //   password: string,
  //   type: 't' | 'c' = 't',
  // ) {
  //   try {
  //     if (!client || !username || !password) {
  //       throw new BadRequestException('Check all credentials given correctly');
  //     }
  //     const userCachekey =
  //       type == 't'
  //         ? `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${client}:AFK:PROFILE:AFVK:v1:users`
  //         : `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${client}:AFK:PROFILE:AFVK:v1:users`;
  //     const userResponse = await this.redisService.getJsonData(userCachekey);
  //     const userList: any[] = JSON.parse(userResponse);
  //     const loggedInUser = userList.find(
  //       (user: any) =>
  //         (user.loginId === username || user.email === username) &&
  //         comparePasswords(password, user.password),
  //     );

  //     // const loggedUserIndex = users.findIndex((user: any) =>(user.loginId === username || user.email === username));
  //     if (!loggedInUser) {
  //       throw new NotAcceptableException('User not found');
  //     }

  //     const isUserAccessExpired = (user: { accessExpires?: string | Date | null }): boolean | null => {
  //       if (!user.accessExpires) {
  //         // If accessExpires is not defined or null, return null
  //         return null;
  //       }
     
  //       const expiryDate = new Date(user.accessExpires);
     
  //       // Check if the date is invalid
  //       if (isNaN(expiryDate.getTime())) {
  //         expiryDate.setHours(0, 0, 0, 0);
  //         return null; // Invalid date, return null
  //       }
  //       const currentDate = new Date();
  //       currentDate.setHours(0, 0, 0, 0);
     
  //       // Check if the current date is past the expiry date
  //       return currentDate > expiryDate;
  //     };
 
  //     const isExpiredUser = isUserAccessExpired(loggedInUser);
 
  //     if(isExpiredUser){
  //       throw new NotAcceptableException('User access expired, Please contact administrator');
  //     }

  //     const userIndex = userList.findIndex(
  //       (user: any) => user.loginId === username || user.email === username,
  //     );

  //     userList.splice(userIndex, 1, {
  //       ...loggedInUser,
  //       status: 'active',
  //       lastActive: new Date(),
  //     });

  //     await this.redisService.setJsonData(
  //       userCachekey,
  //       JSON.stringify(userList),
  //     );

  //     delete loggedInUser.password;

  //     const token = await this.jwtService.signAsync(
  //       { ...loggedInUser, client },
  //       {
  //         secret: auth_secret,
  //         expiresIn: '1h',
  //       },
  //     );

  //     return {
  //       token,
  //       authorized: true,
  //       email: loggedInUser.email,
  //     };
  //   } catch (error) {
  //     await this.throwCustomException(error);
  //   }
  // }

  async signIntoTorus(
    client: string,
    username: string,
    password: string,
    type: 't' | 'c' = 't',
  ) {
    try {
      if (!client || !username || !password) {
        throw new BadRequestException('Check all credentials given correctly');
      }
      const userCachekey =
        type == 't'
          ? `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${client}:AFK:PROFILE:AFVK:v1:users`
          : `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${client}:AFK:PROFILE:AFVK:v1:users`;
      const userResponse = await this.redisService.getJsonData(userCachekey);
      const userList: any[] = JSON.parse(userResponse);
      const loggedInUser = userList.find(
        (user: any) =>
          (user.loginId === username || user.email === username));

      // const loggedUserIndex = users.findIndex((user: any) =>(user.loginId === username || user.email === username));
      if (!loggedInUser) {
        throw new NotAcceptableException('User not found');
      }

      const isPasswordMatch= comparePasswords(password, loggedInUser.password)
      if(!isPasswordMatch){
        throw new NotAcceptableException('Password does not match, Please try again');
      }

      const isUserAccessExpired = (user: { accessExpires?: string | Date | null }): boolean | null => {
        if (!user.accessExpires) {
          // If accessExpires is not defined or null, return null
          return null;
        }
     
        const expiryDate = new Date(user.accessExpires);
     
        // Check if the date is invalid
        if (isNaN(expiryDate.getTime())) {
          expiryDate.setHours(0, 0, 0, 0);
          return null; // Invalid date, return null
        }
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
     
        // Check if the current date is past the expiry date
        return currentDate > expiryDate;
      };
 
      const isExpiredUser = isUserAccessExpired(loggedInUser);
 
      if(isExpiredUser){
        throw new NotAcceptableException('User access expired, Please contact administrator');
      }

      const userIndex = userList.findIndex(
        (user: any) => user.loginId === username || user.email === username,
      );

      userList.splice(userIndex, 1, {
        ...loggedInUser,
        status: 'active',
        lastActive: new Date(),
      });

      await this.redisService.setJsonData(
        userCachekey,
        JSON.stringify(userList),
      );

      delete loggedInUser.password;

      const token = await this.jwtService.signAsync(
        { ...loggedInUser, client },
        {
          secret: auth_secret,
          expiresIn: '1h',
        },
      );

      return {
        token,
        authorized: true,
        email: loggedInUser.email,
      };
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async registerToTorus(
    client: string,
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    mobile: string,
    password: string,
    type: string = 't',
  ) {
    try {
      // type == 't'
      //     ? `TGA:T:PROFILE:setup:NA:${client}:v1:users`
      //     : `T:C:PROFILE:setup:NA:${client}:v1:users`;
      if (client && username && firstname && lastname && email && password) {
        const userCachekey =
          type == 't'
            ? `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${client}:AFK:PROFILE:AFVK:v1:users`
            : `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${client}:AFK:PROFILE:AFVK:v1:users`;

        const responseFromRedis =
          await this.redisService.getJsonData(userCachekey);
        // console.log('responseFromRedis', responseFromRedis);

        if (responseFromRedis) {
          const userList = JSON.parse(responseFromRedis);
          //  check username or email exist already in the userList and if is
          // user name exist throw new Exception and if not register user
          for (let i = 0; i < userList.length; i++) {
            if (userList[i].loginId == username) {
              throw new ForbiddenException('please provide unique username');
            } else if (userList[i].email == email) {
              throw new ForbiddenException(
                'Email is already registered , provide another email or login with your account',
              );
            }
          }
          const newUser = {
            loginId: username,
            firstName: firstname,
            lastName: lastname,
            email,
            mobile,
            password: hashPassword(password),
            '2FAFlag': 'N',
          };
          userList.push(newUser);
          const res = await this.redisService.setJsonData(
            userCachekey,
            JSON.stringify(userList),
          );
          if (res) return 'User Registered Successfully';
        } else {
          const newUser = {
            loginId: username,
            firstName: firstname,
            lastName: lastname,
            email,
            mobile,
            password: hashPassword(password),
            '2FAFlag': 'N',
          };
          const res = await this.redisService.setJsonData(
            userCachekey,
            JSON.stringify([newUser]),
          );
          if (res) return 'User Registered Successfully';
        }
      } else {
        throw new BadRequestException(
          'Please provide all necessary credentials',
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getUserDetails(token) {
    try {
      if (token) {
        return await this.jwtService.decode(token);
      } else {
        throw new UnauthorizedException('token not provided');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAppGroupList(tenant: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
      );

      if (responseFromRedis) {
        const tenantProfileInfo = JSON.parse(responseFromRedis);

        const AppGroupList = tenantProfileInfo.AG.map((ele) => ele.code);

        return AppGroupList;
      } else {
        throw new Error('Tenant Details not available or tenant not exist');
      }
    } catch (error) {
      throw new CustomException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAppList(tenant: string, appGroup: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
      );
      if (responseFromRedis && tenant && appGroup) {
        const tenantProfileInfo = JSON.parse(responseFromRedis);
        const existingAgIndex = tenantProfileInfo.AG.findIndex(
          (ele) => ele.code == appGroup,
        );

        if (existingAgIndex != -1) {
          const AppList = tenantProfileInfo['AG'][existingAgIndex]['APPS'].map(
            (ele) => ele.code,
          );
          return AppList;
        } else {
          throw new Error(
            'AppGroup not available in the tenant, please check AppGroup and App details',
          );
        }
      } else {
        throw new Error('Tenant Details not available or tenant not exist');
      }
    } catch (error) {
      throw new CustomException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAssemblerVersion(key: string) {
    try {
      if (key) {
        const allkeys = await this.redisService.getKeys(key);
        if (Array.isArray(allkeys) && allkeys.length) {
          const data: string[] = allkeys
            .map((item: string) => {
              return item.split(key)[1].split(':')[2];
            })
            .sort(
              (a: any, b: any) =>
                parseInt(b.replace('v', '')) - parseInt(a.replace('v', '')),
            );

          return [...new Set(data)];
        } else {
          return allkeys;
        }
      } else {
        throw new Error('Please provide valid key to fetch version');
      }
    } catch (error) {
      console.log('error', error);

      throw new CustomException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async saveAssemblerData(key: string, data: any) {
    try {
      //CK:TGA:FNGK:BLDC:FNK:DEV:CATK:TENANT:AFGK:APPGRP:AFK:APP
      if (key && data) {
        const versions = await this.getAssemblerVersion(key);

        if (Array.isArray(versions) && versions.length) {
          //get versions array and check which version is maximum version and add one with that
          const newVersion =
            Math.max(...versions.map((item) => parseInt(item.slice(1)))) + 1;
          return await this.redisService.setJsonData(
            `${key}:AFVK:v${newVersion}:bldc`,
            JSON.stringify({ artifactList: data, setupKey: 'tpc' }),
          );
        } else {
          var tenant = key.split(':')[9];
          return await this.redisService.setJsonData(
            `${key}:AFVK:v1:bldc`,
            JSON.stringify({
              artifactList: data,
              setupKey: `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
            }),
          );
        }
      } else {
        throw new Error('Either key or data not provided');
      }
    } catch (error) {
      throw new CustomException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateTokenWithORP(token: string, ORPData: any) {
    try {
      const payload = await this.jwtService.decode(token, { json: true });
      const updatedPayload = { ...payload, ...ORPData };

      return this.jwtService.signAsync(updatedPayload, {
        secret: 'cnkdnkddkdmkd',
      });
    } catch (error) {
      throw new CustomException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getRecentArtifactDetailList(
    loginId: string,
    client: string,
    fabric?: fabric | fabric[],
    catalog?: string | string[],
    artifactGrp?: string | string[],
    sortOrder: sortOrderOfArtifacts = 'Newest',
    artifactType?: string
  ) {
    try {
      if (loginId) {
        const fabrics = fabric
          ? Array.isArray(fabric)
            ? fabric
            : [fabric]
          : ['PF-PFD', 'UF-UFD', 'DF-DFD', 'DF-ERD']
        var overAllCatalogArray = await this.getAllCatalogs(client);

        const overAllArtifactGrpArray = await this.getArtifactGrp(client);
        const catalogs =
          catalog && Array.isArray(catalog)
            ? catalog
            : catalog && typeof catalog === 'string'
              ? [catalog]
              : overAllCatalogArray; // Default catalog if none provided

        const artifactGrps = artifactGrp
          ? typeof artifactGrp === 'string'
            ? [artifactGrp]
            : artifactGrp
          : overAllArtifactGrpArray;

        const recentArtifacts = [];
        const keys = [];

        // Fetch keys for all combinations of fabrics and catalogs
        for (let i = 0; i < fabrics.length; i++) {
          for (const cat of catalogs) {
            for (const artGrp of artifactGrps) {
              const keyPrefix = `CK:${client}:FNGK:AF:FNK:${fabrics[i].trim().toUpperCase()}:CATK:${cat}:AFGK:${artGrp}`;

              const data: string[] = await this.redisService.getKeys(keyPrefix);

              if (data && Array.isArray(data)) {
                data.forEach((key) => {
                  key.endsWith('AFI') && keys.push({ key, fab: fabrics[i] });
                });
              }
              // }
            }
          }
        }

        // Retrieve artifact details
        for (const artifactKeyDetail of keys) {
          const artifactDetail = await this.redisService.getJsonData(
            artifactKeyDetail.key,
          );
          if (artifactDetail) {
            const versionObj = JSON.parse(artifactDetail);
            const artifactName = artifactKeyDetail.key.split(':')[11];
            const version = artifactKeyDetail.key.split(':')[13];
            const catalogDetail = artifactKeyDetail.key.split(':')[7];
            const artifactGrpDetail = artifactKeyDetail.key.split(':')[9];
            var recentlyWorking;

            if (sortOrder == 'Recently Created') {
              recentlyWorking = versionObj.createdOn;
            } else if (sortOrder == 'Recently Modified') {
              recentlyWorking = versionObj.updatedOn;
            } else {
              recentlyWorking = versionObj.updatedOn || versionObj.createdOn;
            }

            // Initialize isPinned array if it doesn't exist
            const isPinned = versionObj.isPinned || [];

            // Check if the user has already pinned this artifact
            const isUserPinned = isPinned.some(
              (pin) => pin?.loginId === loginId,
            );

            if (
              (versionObj.updatedBy === loginId ||
                versionObj.createdBy === loginId) &&
              !versionObj.deleted && artifactType!== 'TFRK'
            ) {
              recentArtifacts.push({
                artifactName,
                version,
                recentlyWorking,
                fabric: artifactKeyDetail.fab,
                catalog: catalogDetail,
                artifactGrp: artifactGrpDetail,
                artifactType: artifactKeyDetail.accessKey,
                isLocked: versionObj.isLocked,
                createdBy: versionObj.createdBy,
                updatedBy: versionObj?.updatedBy,
                sharingInfo: versionObj.sharingInfo,
                isUserPinned,
              });
            }
            if(artifactType == 'TFRK' &&
              versionObj?.sharingInfo?.find(
                (item) => item?.sharedTo?.loginId === loginId,
              ) &&
              !versionObj.deleted
             ){
              recentArtifacts.push({
                artifactName,
                version,
                recentlyWorking,
                fabric: artifactKeyDetail.fab,
                catalog: catalogDetail,
                artifactGrp: artifactGrpDetail,
                artifactType: artifactKeyDetail.accessKey,
                isLocked: versionObj.isLocked,
                createdBy: versionObj.createdBy,
                updatedBy :versionObj?.updatedBy,
                sharingInfo: versionObj.sharingInfo,
                isUserPinned,
              });
            }
            // }
          }
        }

        return recentArtifacts
          .filter((item) => item.recentlyWorking != '')
          .sort((a, b) => {
            // Sort by isUserPinned first
            if (a.isUserPinned && !b.isUserPinned) return -1;
            if (!a.isUserPinned && b.isUserPinned) return 1;

            // Then sort by the sortOrder (Newest or Oldest)
            if (sortOrder === 'Oldest') {
              return (
                new Date(a.recentlyWorking).getTime() -
                new Date(b.recentlyWorking).getTime()
              );
            } else {
              return (
                new Date(b.recentlyWorking).getTime() -
                new Date(a.recentlyWorking).getTime()
              );
            }
          });

        // if (sortOrder === 'Oldest') {
        //   return recentArtifacts
        //     .filter((item) => item.recentlyWorking != '')
        //     .sort(
        //       (a, b) =>
        //         new Date(a.recentlyWorking).getTime() -
        //         new Date(b.recentlyWorking).getTime(),
        //     );
        // }

        // return recentArtifacts
        //   .filter((item) => item.recentlyWorking != '')
        //   .sort(
        //     (a, b) =>
        //       new Date(b.recentlyWorking).getTime() -
        //       new Date(a.recentlyWorking).getTime(),
        //   );
      } else {
        throw new BadRequestException('Invalid input parameters');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAllCatalogs(
    client: string,
    functionGroup?: FnG | FnG[],
    fabric?: fabric | fabric[],
  ) {
    try {
      const fngkArray = functionGroup
        ? typeof functionGroup === 'string'
          ? [functionGroup]
          : functionGroup
        : ['AF', 'AFR'];

      const fabArray = fabric
        ? typeof fabric === 'string'
          ? [fabric]
          : fabric
        : ['PF-PFD', 'UF-UFD', 'DF-DFD', 'DF-ERD']

      // Use map to create an array of promises
      // Fetch keys for each fngk
      // CK:TLC:FNGK:AF:FNK:DF:CATK:DataSource:AFGK:DFD:AFK:bankinghub:AFVK:v1:AFI

      const promises = fngkArray.flatMap((fngk) =>
        fabArray.flatMap((fab) =>
          this.redisService.getKeys(
            `CK:${client}:FNGK:${fngk}:FNK:${fab}:CATK`,
          ),
        ),
      );

      // Wait for all promises to resolve
      const results = await Promise.all(promises);

      // Flatten the array of arrays into a single array
      // const val = Array.from(new Set(results.flat()));
      const val = results.flat();

      // return val;
      return Array.from(new Set(val.map((key) => key.split(':')[7])));
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getArtifactGrp(
    client: string,
    functionGroup?: 'AF' | 'AFR',
    fabric?: fabric | fabric[],
    catalog?: string | string[],
  ) {
    try {
      const FNKArray = functionGroup
        ? typeof functionGroup === 'string'
          ? [functionGroup]
          : functionGroup
        : ['AF', 'AFR'];
      const functionKeyArray = fabric
        ? typeof fabric === 'string'
          ? [fabric]
          : fabric
        : ['PF-PFD', 'UF-UFD', 'DF-DFD', 'DF-ERD']

      const catalogArray = catalog
        ? typeof catalog === 'string'
          ? [catalog]
          : catalog
        : null;

      const promises = FNKArray.flatMap((fngk) =>
        functionKeyArray.flatMap((fab) =>
          catalogArray
            ? catalogArray.map((catalogKey) =>
                this.redisService.getKeys(
                  `CK:${client}:FNGK:${functionGroup}:FNK:${fab}:CATK:${catalogKey}`,
                ),
              )
            : [this.redisService.getKeys(`CK:${client}:FNGK:AF:FNK:${fab}`)],
        ),
      );

      // Wait for all promises to resolve
      const results = await Promise.all(promises);

      // Flatten the array of results (if necessary)
      const val = results.flat();

      return Array.from(new Set(val.map((key) => key.split(':')[9])));
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getArtifactRelatedToBuild(tenant: string, appGrp: string, app: string) {
    try {
      if (!tenant || !appGrp || !app) {
        throw new NotAcceptableException('Invalid input parameters');
      }
      const buildKeyPrefix = `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${appGrp}:AFK:${app}`;
      const versionList = await this.getAssemblerVersion(buildKeyPrefix);
      const currentVersion = versionList.length
        ? Math.max(...versionList.map((item) => parseInt(item.slice(1))))
        : null;
      if (!currentVersion) {
        throw new NotFoundException('No artifacts found');
      }
      const buildConfiguration = JSON.parse(
        await this.redisService.getJsonData(
          `${buildKeyPrefix}:AFVK:v${currentVersion}:bldc`,
        ),
      );
      if (
        !buildConfiguration ||
        !buildConfiguration.hasOwnProperty('buildKey') ||
        !buildConfiguration.buildKey
      ) {
        throw new NotFoundException('No data available');
      }
      const artifactKeys = new Set([]);

      for (const build of buildConfiguration.buildKey) {
        artifactKeys.add(build.buildKey);
      }

      const overallResponse = await Promise.all(
        Array.from(artifactKeys).map(async (keyPrefix) => {
          const response = await this.redisService.getJsonData(
            `${keyPrefix}:AFI`,
          );
          if (response) {
            const versionObj = JSON.parse(response);
            const fabric = keyPrefix.split(':')[5].toLowerCase();
            const catalog = keyPrefix.split(':')[7];
            const artifactGrp = keyPrefix.split(':')[9];
            const artifactName = keyPrefix.split(':')[11];
            const version = keyPrefix.split(':')[13];
            return {
              artifactName,
              version,
              recentlyWorking: versionObj.updatedOn || versionObj.createdOn,
              fabric,
              catalog,
              artifactGrp,
              isLocked: versionObj.isLocked,
            };
          } else {
            return null;
          }
        }),
      );
      return overallResponse.filter((item) => item !== null);
    } catch (error) {
      await this.throwCustomException(error);
    }
  }


  async pushArtifactToBuild(
    client: string,
    artifactKeyPrefix: string,
    loginId: string,
    tenant: string,
    appGrp: string,
    app: string,
    version?: string,
  ) {
    try {
      if (!tenant || !appGrp || !app || !artifactKeyPrefix || !loginId) {
        throw new BadRequestException('Invalid credentials');
      }
      const structuredArtifactKey = getRecentKeyStructure(artifactKeyPrefix);
      if (structuredArtifactKey['FNGK'] === 'AFC') {
        throw new NotAcceptableException(
          'Artifact already pushed to the build',
        );
      }
      const copiedArtifactKeyPrefix = artifactKeyPrefix
        .replace(':AF:', ':AFC:')
        .replace(`:${client}:`, `:${tenant}:`);
      const allKeysRelatedToArtifact: string[] =
        await this.redisService.getKeys(artifactKeyPrefix);
      await Promise.all(
        allKeysRelatedToArtifact.map((key: string) =>
          this.redisService.copyData(
            key,
            key.replace(artifactKeyPrefix, copiedArtifactKeyPrefix),
          ),
        ),
      );
      const UOKey = allKeysRelatedToArtifact.find((key: string) =>
        key.endsWith('UO'),
      );
      if (UOKey) {
        const UOData = JSON.parse(await this.redisService.getJsonData(UOKey));
        console.log(1);

        if (UOData) {
          await this.redisService.setJsonData(
            UOKey.replace(artifactKeyPrefix, copiedArtifactKeyPrefix),
            JSON.stringify({
              ...UOData,
              securityData: {
                ...UOData.securityData,
                afk: copiedArtifactKeyPrefix,
              },
            }),
          );
        }
      }
      let redisKey: string;
      if (version) {
        redisKey = `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${appGrp}:AFK:${app}:AFVK:${version}:bldc`;
      } else {
        const versions = await this.getAssemblerVersion(
          `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${appGrp}:AFK:${app}:AFVK`,
        );
        let newVersion;
        if (versions && Array.isArray(versions) && versions.length) {
          newVersion =
            Math.max(...versions.map((item) => parseInt(item.slice(1)))) + 1;
        } else {
          newVersion = 1;
        }
        redisKey = `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${appGrp}:AFK:${app}:AFVK:v${newVersion}:bldc`;
      }
      const responseFromRedis = await this.redisService.getJsonData(redisKey);
      const keystructure = getRecentKeyStructure(copiedArtifactKeyPrefix);
      const recentBuildInfo = {
        artifactKey: artifactKeyPrefix,
        buildKey: copiedArtifactKeyPrefix,
        loginId,
        timestamp: new Date(),
        fabric: keystructure['FNK'],
      };
      let updatedBuildKey = [recentBuildInfo];
      if (responseFromRedis) {
        const bldc = JSON.parse(responseFromRedis);
        updatedBuildKey = bldc.buildKey
          ? [...bldc.buildKey, recentBuildInfo]
          : updatedBuildKey;
        await this.redisService.setJsonData(
          redisKey,
          JSON.stringify({
            ...bldc,
            buildKey: updatedBuildKey,
            setupKey: `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
          }),
        );
      } else {
        await this.redisService.setJsonData(
          redisKey,
          JSON.stringify({
            buildKey: updatedBuildKey,
            setupKey: `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
            artifactList: [],
          }),
        );
      }

      return 'Artifact pushed to build successfully';
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getSecurityTemplateData(tenant: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:securityTemplate`,
      );
      const userResponse = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:users`,
      );

      let securityTemplateData = [];
      if (responseFromRedis) {
        securityTemplateData = JSON.parse(responseFromRedis);
        if (userResponse) {
          const userlist = JSON.parse(userResponse);
          securityTemplateData = securityTemplateData.map((data) => {
            var noOfUsers = 0;
            userlist.forEach((user) => {
              if (
                user?.accessProfile &&
                user.accessProfile.includes(data.accessProfile)
              ) {
                noOfUsers += 1;
              }
            });

            return { ...data, 'no.ofusers': noOfUsers };
          });
        }
      }
      return securityTemplateData;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async postSecurityTemplateData(tenant: string, data: []) {
    try {
      if (tenant && data) {
        const UpdatedSecurityTemplateData = data;
        return await this.redisService.setJsonData(
          `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:securityTemplate`,
          JSON.stringify([...UpdatedSecurityTemplateData]),
        );
      } else {
        throw new BadRequestException(
          'Please provide all necessary credentials',
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAccessProfiles(tenant: string) {
    try {
      if (!tenant) {
        throw new BadRequestException('Please provide tenant name');
      }
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:securityTemplate`,
      );
      const accessProfileArray = [];
      const accessProfileWithProductAndService = {};
      if (responseFromRedis) {
        const accessProfileData: any[] = JSON.parse(responseFromRedis);
        accessProfileData.forEach((accessProfileObj) => {
          var noOfProdService = 0;
          accessProfileObj['products/Services'].forEach((productGrp: any) => {
            noOfProdService += productGrp['ps'].length;
          });
          accessProfileWithProductAndService[accessProfileObj?.accessProfile] =
            noOfProdService;
          accessProfileArray.push(accessProfileObj?.accessProfile);
        });
      }
      return accessProfileWithProductAndService;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getUserList(client: string, type: 't' | 'c' = 't') {
    try {
      if (client) {
        const userCachekey =
          type == 't'
            ? `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${client}:AFK:PROFILE:AFVK:v1:users`
            : `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${client}:AFK:PROFILE:AFVK:v1:users`;
        const data = await this.redisService.getJsonData(userCachekey);
        if (data) {
          const userlist: any[] = JSON.parse(data);
          return userlist.map((ele: any) => {
            delete ele.password;
            return ele;
          });
        } else {
          throw new NotFoundException('UserList Not Found');
        }
      } else {
        throw new ForbiddenException('client information not available');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }


  async postUserList(tenant: string, data: any[], type: 't' | 'c' = 't') {
    try {
      if (!tenant || !data || !Array.isArray(data)) {
        throw new BadRequestException('Invalid credentials');
      }
      const userCachekey =
        type == 't'
          ? `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:users`
          : `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:users`;
      var userList = [];
      const responseFromRedis =
        await this.redisService.getJsonData(userCachekey);

      if (responseFromRedis) {
        const existingUserList: any[] = JSON.parse(responseFromRedis);
        data.forEach((newUser) => {
          if (newUser.password) {
            userList.push({
              ...newUser,
              password: hashPassword(newUser.password),
            });
          } else {
            const existingUserObj = existingUserList.find(
              (existinguser) => existinguser.email == newUser.email,
            );
            userList.push({
              ...existingUserObj,
              ...newUser,
              password: existingUserObj?.password,
            });
          }
        });
      } else {
        userList = data.map((item) => ({
          ...item,
          password: hashPassword(item.password),
        }));
      }
      return await this.redisService.setJsonData(
        userCachekey,
        JSON.stringify([...userList]),
      );
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async shareArtifact(
    loginId: string,
    functionGroup: FnG | FnG[],
    fabric: fabric,
    catalog: string,
    artifactGrp: string,
    artifactName: string,
    version: string,
    shareTo: { email: string; name: string },
    accessType: 'Can View' | 'Can Edit' | 'Full Access',
    client: string,
  ) {
    try {
      if (
        !loginId ||
        !fabric ||
        !catalog ||
        !artifactGrp ||
        !artifactName ||
        !version ||
        !shareTo
      ) {
        throw new BadRequestException('Invalid Input parameters');
      }

      // const redisKey = `TCL:${artifactType.toUpperCase()}:${fabric.toUpperCase()}:${catalog}:${artifactGrp}:${artifactName}:${version}:artifactInfo`;
      const redisKey = `CK:${client}:FNGK:${functionGroup}:FNK:${fabric.toUpperCase()}:CATK:${catalog}:AFGK:${artifactGrp}:AFK:${artifactName}:AFVK:${version}:AFI`;
      // console.log("redisKey",{redisKey, actualKey:"CK:TLC:FNGK:AF:FNK:DF:CATK:DataSource:AFGK:DFD:AFK:finalbuild:AFVK:v1:AFI", res: redisKey=="CK:TLC:FNGK:AF:FNK:DF:CATK:DataSource:AFGK:DFD:AFK:finalbuild:AFVK:v1:AFI"});

      const artifactResponse = await this.redisService.getJsonData(redisKey);

      if (!artifactResponse) {
        throw new NotFoundException('Artifact not found');
      }

      const artifactInfo = JSON.parse(artifactResponse);

      const newSharingInfo = {
        sharedBy: loginId,
        sharedTo: shareTo,
        sharedAt: new Date(),
        accessType,
      };

      // If sharingInfo exists, check if the artifact is already shared
      if (artifactInfo.sharingInfo) {
        const existingShare = artifactInfo.sharingInfo.find(
          (item) => item.sharedTo.email === shareTo.email,
        );

        if (existingShare) {
          if (existingShare.accessType === accessType) {
            throw new NotAcceptableException('Already shared with this user');
          } else {
            // Update the access type
            existingShare.accessType = accessType;
          }
        } else {
          artifactInfo.sharingInfo.push(newSharingInfo);
        }
      } else {
        artifactInfo.sharingInfo = [newSharingInfo];
      }

      await this.redisService.setJsonData(
        redisKey,
        JSON.stringify(artifactInfo),
      );
      return artifactInfo.sharingInfo;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async deleteArtifact(
    loginId: string,
    functionGroup: FnG | FnG[],
    fabric: fabric,
    catalog: string,
    artifactGrp: string,
    artifactName: string,
    version: string,
    client?: string,
  ) {
    try {
      // const redisKey = `TCL:${artifactType.toUpperCase()}:${fabric.toUpperCase()}:${catalog}:${artifactGrp}:${artifactName}:${version}:artifactInfo`;
      const redisKey = `CK:${client}:FNGK:${functionGroup}:FNK:${fabric.toUpperCase()}:CATK:${catalog}:AFGK:${artifactGrp}:AFK:${artifactName}:AFVK:${version}:AFI`;
      const artifactResponse = await this.redisService.getJsonData(redisKey);
      const artifactInfo = JSON.parse(artifactResponse);
      artifactInfo.deleted = true;
      await this.redisService.setJsonData(
        redisKey,
        JSON.stringify(artifactInfo),
      );
      return 'Artifact Deleted Successfully';
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  // async pinArtifact(loginId: string, artifactKey: string) {
  //   try {
  //     const artifactResponse = await this.redisService.getJsonData(artifactKey);
  //     if (artifactResponse) {
  //       const artifactInfo = JSON.parse(artifactResponse);
  //       artifactInfo.isPinned = artifactInfo.isPinned || [];

  //       // Check if the user has already pinned this artifact
  //       if (artifactInfo.isPinned.some((pin) => pin.loginId === loginId)) {
  //         throw new NotAcceptableException('Artifact already pinned');
  //       }

  //       // Get all artifacts to check the total number of pins by the user
  //       const pinnedArtifacts = await this.getPinnedArtifactsByUser(loginId);

  //       if (pinnedArtifacts.length >= 3) {
  //         // Sort artifacts by timestamp and remove the oldest one
  //         pinnedArtifacts.sort(
  //           (a, b) =>
  //             new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  //         );

  //         // Remove the oldest pinned artifact
  //         const oldestArtifactKey = pinnedArtifacts[0].artifactKey;
  //         await this.unpinArtifact(loginId, oldestArtifactKey);
  //       }

  //       // Add the loginId with timestamp to the isPinned array
  //       artifactInfo.isPinned.push({
  //         loginId,
  //         timestamp: new Date().toISOString(),
  //       });

  //       // Save the updated artifact info back to Redis
  //       await this.redisService.setJsonData(
  //         artifactKey,
  //         JSON.stringify(artifactInfo),
  //       );

  //       return 'Artifact pinned successfully';
  //     } else {
  //       throw new NotFoundException('Artifact not found');
  //     }
  //   } catch (error) {
  //     await this.throwCustomException(error);
  //   }
  // }

  async getPinnedArtifactsByUser(loginId: string) {
    const keys = await this.redisService.getKeys('AFI', true);
    const pinnedArtifacts = [];
    for (const key of keys) {
      const artifactResponse = await this.redisService.getJsonData(key);
      if (artifactResponse) {
        const artifactInfo = JSON.parse(artifactResponse);
        if (artifactInfo.isPinned) {
          const pinInfo = artifactInfo.isPinned.find(
            (pin) => pin.loginId === loginId,
          );
          if (pinInfo) {
            pinnedArtifacts.push({
              artifactKey: key,
              timestamp: pinInfo.timestamp,
            });
          }
        }
      }
    }

    return pinnedArtifacts;
  }

  // async unpinArtifact(loginId: string, artifactKey: string) {
  //   try {
  //     const artifactResponse = await this.redisService.getJsonData(artifactKey);
  //     if (artifactResponse) {
  //       const artifactInfo = JSON.parse(artifactResponse);

  //       // Remove the loginId from the isPinned array
  //       artifactInfo.isPinned = artifactInfo.isPinned.filter(
  //         (pin) => pin.loginId !== loginId,
  //       );

  //       // Save the updated artifact info back to Redis
  //       await this.redisService.setJsonData(
  //         artifactKey,
  //         JSON.stringify(artifactInfo),
  //       );

  //       return 'Artifact unpinned successfully';
  //     } else {
  //       throw new NotFoundException('Artifact not found');
  //     }
  //   } catch (error) {
  //     await this.throwCustomException(error);
  //   }
  // }

  async handleArtifactPinAction(
    loginId: string,
    artifactKey: string,
    action: 'pin' | 'unpin',
  ) {
    try {
      const artifactResponse = await this.redisService.getJsonData(artifactKey);
  
      if (!artifactResponse) {
        throw new NotFoundException('Artifact not found');
      }
  
      const artifactInfo = JSON.parse(artifactResponse);
      artifactInfo.isPinned = artifactInfo.isPinned || [];
  
      if (action === 'pin') {
        // Check if the user has already pinned this artifact
        if (artifactInfo.isPinned.some((pin) => pin.loginId === loginId)) {
          throw new NotAcceptableException('Artifact already pinned');
        }
  
        // Get all pinned artifacts by the user
        const pinnedArtifacts = await this.getPinnedArtifactsByUser(loginId);
  
        if (pinnedArtifacts.length >= 3) {
          // Sort artifacts by timestamp and remove the oldest one
          pinnedArtifacts.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );
  
          // Remove the oldest pinned artifact
          const oldestArtifactKey = pinnedArtifacts[0].artifactKey;
          await this.handleArtifactPinAction(loginId, oldestArtifactKey, 'unpin');
        }
  
        // Add the loginId with timestamp to the isPinned array
        artifactInfo.isPinned.push({
          loginId,
          timestamp: new Date().toISOString(),
        });
  
        await this.redisService.setJsonData(
          artifactKey,
          JSON.stringify(artifactInfo),
        );
  
        return 'Artifact pinned successfully';
      } else if (action === 'unpin') {
        // Check if the artifact is currently pinned by the user
        const pinIndex = artifactInfo.isPinned.findIndex(
          (pin) => pin.loginId === loginId,
        );
  
        if (pinIndex === -1) {
          throw new NotAcceptableException('Artifact not pinned by this user');
        }
  
        // Remove the user's pin information
        artifactInfo.isPinned.splice(pinIndex, 1);
  
        await this.redisService.setJsonData(
          artifactKey,
          JSON.stringify(artifactInfo),
        );
  
        return 'Artifact unpinned successfully';
      } else {
        throw new BadRequestException('Invalid action');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getTenantProfile(tenant: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
        // `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
      );
      const envTemplate = tenantProfileTemplate.ENV;
      const updatedTemplate = { ...tenantProfileTemplate, ENV: envTemplate };
      if (responseFromRedis) {
        //send stored Tenant profile data from redis without AppGroups data
        const tenantProfileInfo = JSON.parse(responseFromRedis);
        const { ENV } = tenantProfileInfo;
        delete ENV.APPS;
        return { ...tenantProfileInfo, ENV: ENV };
      } else {
        return { ...updatedTemplate, Code: tenant };
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async postNewTenantResource(
    tenant: string,
    resourceArray: any[] | any,
    resourceType: 'app' | 'org' | 'env' | 'profile',
  ) {
    try {
      if (tenant && resourceArray && resourceType) {
        const tenantResourceKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`;
        const responseFromRedis =
          await this.redisService.getJsonData(tenantResourceKey);
        if (responseFromRedis) {
          const tenantProfile = JSON.parse(responseFromRedis);
          switch (resourceType) {
            case 'app':
              const validationResultAG = await this.validateJson(
                'redis',
                [
                  'CK:TRL:FNGK:AFRS:FNK:SETUP:CATK:TENANT:AFGK:PROFILE:AFK:TEMPLATE:AFVK:v1:tpc',
                ],
                [{ ...tenantProfile, AG:resourceArray}],
              );
              if (validationResultAG != 'Validation successfully') {
                throw new BadRequestException('JSON Validation failed');
              }
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({ ...tenantProfile, AG: resourceArray }),
              );
            case 'org':
              const validationResultORG = await this.validateJson(
                'redis',
                [
                  'CK:TRL:FNGK:AFRS:FNK:SETUP:CATK:TENANT:AFGK:PROFILE:AFK:TEMPLATE:AFVK:v1:tpc',
                ],
                [{ ...tenantProfile, orgGrp:resourceArray}],
              );
              if (validationResultORG != 'Validation successfully') {
                throw new BadRequestException('JSON Validation failed');
              }
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({ ...tenantProfile, orgGrp: resourceArray }),
              );
            case 'env':
              const validationResultENV = await this.validateJson(
                'redis',
                [
                  'CK:TRL:FNGK:AFRS:FNK:SETUP:CATK:TENANT:AFGK:PROFILE:AFK:TEMPLATE:AFVK:v1:tpc',
                ],
                [{ ...tenantProfile, env:resourceArray}],
              );
              if (validationResultENV != 'Validation successfully') {
                throw new BadRequestException('JSON Validation failed');
              }
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({ ...tenantProfile, env: resourceArray }),
              );
            case 'profile':
              const validationResult = await this.validateJson(
                'redis',
                [
                  'CK:TRL:FNGK:AFRS:FNK:SETUP:CATK:TENANT:AFGK:PROFILE:AFK:TEMPLATE:AFVK:v1:tpc',
                ],
                [{ ...tenantProfile, ...resourceArray}],
              );
              if (validationResult != 'Validation successfully') {
                throw new BadRequestException('JSON Validation failed');
              }
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({ ...tenantProfile, ...resourceArray }),
              );
            default:
              throw new BadRequestException(
                `Please provide valid resource type ${resourceType}`,
              );
          }
        } else {
          switch (resourceType) {
            case 'app':
              const validationResultAG = await this.validateJson(
                'redis',
                [
                  'CK:TRL:FNGK:AFRS:FNK:SETUP:CATK:TENANT:AFGK:PROFILE:AFK:TEMPLATE:AFVK:v1:tpc',
                ],
                [{ ...tenantProfileTemplate, AG:resourceArray}],
              );
              if (validationResultAG != 'Validation successfully') {
                throw new BadRequestException('JSON Validation failed');
              }
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({ ...tenantProfileTemplate, AG: resourceArray }),
              );
            case 'org':
              const validationResultORG = await this.validateJson(
                'redis',
                [
                  'CK:TRL:FNGK:AFRS:FNK:SETUP:CATK:TENANT:AFGK:PROFILE:AFK:TEMPLATE:AFVK:v1:tpc',
                ],
                [{ ...tenantProfileTemplate, orgGrp:resourceArray}],
              );
              if (validationResultORG != 'Validation successfully') {
                throw new BadRequestException('JSON Validation failed');
              }
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({
                  ...tenantProfileTemplate,
                  orgGrp: resourceArray,
                }),
              );
            case 'env':
              const validationResultENV = await this.validateJson(
                'redis',
                [
                  'CK:TRL:FNGK:AFRS:FNK:SETUP:CATK:TENANT:AFGK:PROFILE:AFK:TEMPLATE:AFVK:v1:tpc',
                ],
                [{ ...tenantProfileTemplate, env:resourceArray}],
              );
              if (validationResultENV != 'Validation successfully') {
                throw new BadRequestException('JSON Validation failed');
              }
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({
                  ...tenantProfileTemplate,
                  env: resourceArray,
                }),
              );
            case 'profile':
              const validationResult = await this.validateJson(
                'redis',
                [
                  'CK:TRL:FNGK:AFRS:FNK:SETUP:CATK:TENANT:AFGK:PROFILE:AFK:TEMPLATE:AFVK:v1:tpc',
                ],
                [{ ...tenantProfileTemplate, ...resourceArray}],
              );
              if (validationResult != 'Validation successfully') {
                throw new BadRequestException('JSON Validation failed');
              }
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({ ...tenantProfileTemplate, ...resourceArray }),
              );
            default:
              throw new BadRequestException(
                `Please provide valid resource type ${resourceType}`,
              );
          }
        }
      } else {
        throw new BadRequestException(
          'Please provide all necessary credentials',
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getTenantOrganizationMatrix(tenant: string) {
    try {
      if (!tenant) {
        throw new BadRequestException(
          'Please provide tenant to get organization matrix',
        );
      }
      const tenantResourceKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`;
      const responseFromRedis =
        await this.redisService.getJsonData(tenantResourceKey);
      if (!responseFromRedis) {
        throw new NotFoundException('No organization matrix found');
      }
      const tenantProfile = JSON.parse(responseFromRedis);
      if (tenantProfile?.orgGrp) {
        return tenantProfile.orgGrp;
      } else {
        throw new NotFoundException(
          'No organization matrix found , try setting an organization',
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getTenantEnvironment(code: string) {
    try {
      var alterdata = [];
      var responseFromRedis = JSON.parse(
        await this.redisService.getJsonData(
          `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${code}:AFK:PROFILE:AFVK:v1:tpc`,
        ),
      );
      var tenant = responseFromRedis.tenantList;
      if (tenant) {
        if (tenant.length > 0) {
          for (var i = 0; i < tenant.length; i++) {
            var tpc = JSON.parse(
              await this.redisService.getJsonData(
                `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant[i]}:AFK:PROFILE:AFVK:v1:tpc`,
              ),
            );
            console.log(tpc);
            var obj = {}; // console.log("tenantname", tenantname);
            obj['Code'] = tpc.Code;
            obj['Name'] = tpc.Name;
            obj['Logo'] = tpc.Logo;
            obj['ENV'] = tpc.ENV;
            alterdata.push(obj);
          }
        } else if (tenant.length == 0) {
          var envObjTemplate = tenantProfileTemplate;
          var res = {};
          res['Code'] = envObjTemplate.Code;
          res['Name'] = envObjTemplate.Name;
          res['Logo'] = envObjTemplate.Logo;
          res['ENV'] = envObjTemplate.ENV;
          alterdata.push(res);
        }
      } else {
        var envObjTemplate = tenantProfileTemplate;
        var res = {};
        res['Code'] = envObjTemplate.Code;
        res['Name'] = envObjTemplate.Name;
        res['Logo'] = envObjTemplate.Logo;
        res['ENV'] = envObjTemplate.ENV;
        alterdata.push(res);
      }

      return alterdata;
    } catch (error) {
      // Catch any other errors and throw a custom exception
      await this.throwCustomException(error);
    }
  }

  async postTenantEnvironment(clientCode: string, data: any[]) {
    try {
      const clientProfileResponse = JSON.parse(
        await this.redisService.getJsonData(
          `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`,
        ),
      );

      const tenantList = [];

      for (let i = 0; i < data.length; i++) {
        const newtenntCode = data[i].Code;
        const responseFromRedis = await this.redisService.getJsonData(
          `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${newtenntCode}:AFK:PROFILE:AFVK:v1:tpc`,
        );

        var updatedTenantProfile = {};
        if (responseFromRedis) {
          updatedTenantProfile = {
            ...JSON.parse(responseFromRedis),
            ...data[i],
          };
        } else {
          updatedTenantProfile = { ...tenantProfileTemplate, ...data[i] };
        }
        const validationResult = await this.validateJson(
          'redis',
          [
            'CK:TRL:FNGK:AFRS:FNK:SETUP:CATK:TENANT:AFGK:PROFILE:AFK:TEMPLATE:AFVK:v1:tpc',
          ],
          [updatedTenantProfile],
        );
        if (validationResult != 'Validation successfully') {
          throw new BadRequestException('JSON Validation failed');
        }
        await this.redisService.setJsonData(
          `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${newtenntCode}:AFK:PROFILE:AFVK:v1:tpc`,
          JSON.stringify(updatedTenantProfile),
        );
        tenantList.push(newtenntCode);
      }
      await this.redisService.setJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`,
        JSON.stringify({ ...clientProfileResponse, tenantList: tenantList }),
      );
      return 'success';
    } catch (error) {
      // Catch any other errors and throw a custom exception.
      throw new CustomException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAppEnv(tenantCode: string) {
    try {
      if (!tenantCode) {
        throw new BadRequestException(
          'Please provide tenant to get app env info',
        );
      }
      const tenantProfileInfo = JSON.parse(
        await this.redisService.getJsonData(
          `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenantCode}:AFK:PROFILE:AFVK:v1:tpc`,
        ),
      );
      if (
        !tenantProfileInfo ||
        !tenantProfileInfo.AG ||
        !tenantProfileInfo.hasOwnProperty('ENV')
      ) {
        throw new NotFoundException('No app env info found');
      }
      const resultArray = [];
      const appGroupData = tenantProfileInfo.AG;
      const envData = tenantProfileInfo.ENV;

      for (const appgrp of appGroupData) {
        const requiredAppGrp = {
          code: appgrp.code,
          name: appgrp.name,
          APPS: [],
        };
        if (appgrp.APPS && Array.isArray(appgrp.APPS)) {
          for (const app of appgrp.APPS) {
            const requiredAppCode = app.code;
            for (const env of envData) {
              env.APPS = env.APPS || [];
              const requiredAppEnvData = env.APPS.find(
                (envApp) => envApp?.code === requiredAppCode,
              );
              if (requiredAppEnvData) {
                const { code: envTitle, HostName, HostIP, volumePath } = env;
                const envData = {
                  env: envTitle,
                  HostName,
                  HostIP,
                  volumePath,
                };
                if (!requiredAppGrp.APPS.some((a) => a.code == app.code)) {
                  requiredAppGrp.APPS.push({
                    ...app,
                    ...requiredAppEnvData,
                    ...envData,
                  });
                }
              } else {
                if (!requiredAppGrp.APPS.some((a) => a.code == app.code)) {
                  requiredAppGrp.APPS.push({ ...app });
                }
              }
            }
          }
        }
        resultArray.push(requiredAppGrp);
      }

      return resultArray;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async potAppEnv(tenantCode: string, data: any[]) {
    try {
      if (!tenantCode || !data || !Array.isArray(data)) {
        throw new BadRequestException('lack of proper data to continue');
      }
      const tenantResourceKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenantCode}:AFK:PROFILE:AFVK:v1:tpc`;
      const tenantProfile = JSON.parse(
        await this.redisService.getJsonData(tenantResourceKey),
      );
      if (!tenantProfile) {
        throw new NotFoundException('No data found for a requested tenant');
      }
      const ENV = structuredClone(tenantProfile.ENV);
      const AG = [];
      for (const appgrp of data) {
        const requiredAppGrp = {
          code: appgrp.code,
          name: appgrp.name,
          APPS: [],
        };
        for (const app of appgrp.APPS) {
          if (app.env) {
            const appEnvInfo = {
              code: app.code,
              version: app?.version,
              status: app?.status,
              generatedUrl: app?.generatedUrl,
              accessUrl: app?.accessUrl,
              appPath: app?.appPath,
            };
            const existingEnvIndex = ENV.findIndex(
              (envObj: any) => envObj.code == app.env,
            );
            if (existingEnvIndex != -1) {
              const existingAppIndex = ENV[existingEnvIndex].APPS
                ? ENV[existingEnvIndex].APPS.findIndex(
                    (envApp) => envApp.code == appEnvInfo.code,
                  )
                : -1;
              if (existingAppIndex != -1) {
                ENV[existingEnvIndex].APPS[existingAppIndex] = appEnvInfo;
              } else {
                if (ENV[existingEnvIndex].APPS) {
                  ENV[existingEnvIndex].APPS.push(appEnvInfo);
                } else {
                  ENV[existingEnvIndex].APPS = [appEnvInfo];
                }
              }
              requiredAppGrp.APPS.push({ code: app?.code, name: app?.name });
            }
          }
        }
        AG.push(requiredAppGrp);
      }
      const validationResult = await this.validateJson(
        'redis',
        [
          'CK:TRL:FNGK:AFRS:FNK:SETUP:CATK:TENANT:AFGK:PROFILE:AFK:TEMPLATE:AFVK:v1:tpc',
        ],
        [{ ...tenantProfile, AG, ENV }],
      );
      if (validationResult != 'Validation successfully') {
        throw new BadRequestException('JSON Validation failed');
      }

      return await this.redisService.setJsonData(
        tenantResourceKey,
        JSON.stringify({ ...tenantProfile, AG, ENV }),
      );
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getClientProfile(clientCode: string) {
    const clientProfile = {};
    try {
      if (!clientCode) {
        throw new BadRequestException('Please provide client code');
      }
      const clientProfileKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`;
      const responseFromRedis =
        await this.redisService.getJsonData(clientProfileKey);
      if (!responseFromRedis) {
        throw new NotFoundException('No client profile found');
      } else {
        Object.entries(JSON.parse(responseFromRedis)).forEach(
          ([key, value]) => {
            if (typeof value == 'string') {
              clientProfile[key] = value;
            }
          },
        );
      }
      return clientProfile;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async PostClientProfile(clientCode: string, data: any) {
    try {
      if (!clientCode) {
        throw new BadRequestException('Please provide client code');
      }
      const clientResourceKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`;
      const responseFromRedis =
        await this.redisService.getJsonData(clientResourceKey);
      const clientProfile = JSON.parse(responseFromRedis);
      return await this.redisService.setJsonData(
        clientResourceKey,
        JSON.stringify({ ...clientProfile, ...data }),
      );
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async MyAccountForClient(token: string) {
    try {
      const payload: any = this.jwtService.decode(token);
      if (!payload) {
        throw new BadRequestException('Please provide valid token');
      } else {
        const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${payload.client}:AFK:PROFILE:AFVK:v1:users`;
        const responseFromRedis =
          await this.redisService.getJsonData(userCachekey);
        const userList = JSON.parse(responseFromRedis);
        const reqiredUser = userList.find(
          (user) => user.email === payload.email,
        );
        delete reqiredUser.password;
        return reqiredUser;
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async updateMyAccount(clientCode: string, data: any) {
    try {
      if (!clientCode) {
        throw new BadRequestException('Please provide client code');
      }
      const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:users`;
      const responseFromRedis =
        await this.redisService.getJsonData(userCachekey);
      const userList: any[] = JSON.parse(responseFromRedis);
      const reqiredUser = userList.find((user) => user.email === data.email);
      const reqiredUserIndex = userList.findIndex(
        (user) => user.email === data.email,
      );
      if (!reqiredUser) {
        throw new NotFoundException('User not found');
      }
      if (data?.password) {
        const hashedPassword = hashPassword(data.password);
        userList.splice(reqiredUserIndex, 1, {
          ...data,
          password: hashedPassword,
        });
      } else {
        userList.splice(reqiredUserIndex, 1, {
          ...data,
          password: reqiredUser.password,
        });
      }

      return await this.redisService.setJsonData(
        userCachekey,
        JSON.stringify(userList),
      );
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

 
   async clientUserAddition(clientCode: string, data: any,isTenantUser:boolean=false) {
    try {
      if (!clientCode || !data) {
        throw new BadRequestException('Invalid input parameters');
      }
      const userCachekey = isTenantUser? `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:users`: `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:users`;
      const clientProfileResourceKey = isTenantUser? `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`:`CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`;
     
      const userResponse = await this.redisService.getJsonData(userCachekey)
      console.log("userResponse", userResponse);
  
      const userList: any[] = userResponse? JSON.parse(userResponse) : []
      console.log("userList");
      
     
      const clientProfile = JSON.parse(
        await this.redisService.getJsonData(clientProfileResourceKey),
      );
     
      const { email, firstName, lastName, password, loginId } = data;
      const resForClientUserAddition = await this.redisService.getJsonData(`emailTemplates:clientUserAddition`)
      const clientUserAddition = JSON.parse(resForClientUserAddition);
      const updateclientUserAddition = (clientUserAddition.text as string).replaceAll('${clientProfile.clientName}', `${clientProfile.clientName}`).replace('${firstName}',`${firstName}`).replace('${lastName}',`${lastName}`)
            .replace('${clientCode}',`${clientCode}`).replace('${username}',`${loginId}`).replace('${password}',`${password}`)
      
      const updatedSubject = (clientUserAddition.subject as string).replaceAll('${clientProfile.clientName}',  isTenantUser? `${clientProfile.Name}`: `${clientProfile.clientName}`)      
      const updateclientUserAdditionHtml = (clientUserAddition.html as string)
      .replaceAll(
        "${clientProfile.clientName}",
        isTenantUser? `${clientProfile.Name}`: `${clientProfile.clientName}`
      )
      .replace("${firstName}", `${firstName}`)
      .replace("${lastName}", `${lastName}`)
      .replace("${clientCode}", `${clientCode}`)
      .replace("${username}", `${loginId}`)
      .replace("${password}", `${password}`);
 
      const mailOptions = {
        from: "support@torus.tech",
        to: email,
        subject: updatedSubject,
        // text: updateclientUserAddition,
        html : updateclientUserAdditionHtml
      };
  
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          throw new ForbiddenException('There is an issue with sending otp');
        } else {
          console.log('Email sent: ' + info.response);
          // return `Email sent`;
        }
      });
  
      userList.push({ ...data, password: hashPassword(data.password) });
      await this.redisService.setJsonData(
        userCachekey,
        JSON.stringify(userList),
      );
      const newUserList = structuredClone(userList);
  
      let result = [];
  
      for (const user of newUserList) {
        delete user.password;
        result.push(user);
      }
  
      return result;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  // async clientUserAddition(clientCode: string, data: any) {
  //   try {
  //     if (!clientCode || !data) {
  //       throw new BadRequestException('Invalid input parameters');
  //     }
  //     const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:users`;
  //     const clientProfileResourceKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`;
  //     const userList: any[] = JSON.parse(
  //       await this.redisService.getJsonData(userCachekey),
  //     );
  //     const clientProfile = JSON.parse(
  //       await this.redisService.getJsonData(clientProfileResourceKey),
  //     );
     
  //     const { email, firstName, lastName, password, loginId } = data;
  //     const resForClientUserAddition = await this.redisService.getJsonData(`emailTemplates:clientUserAddition`)
  //     const clientUserAddition = JSON.parse(resForClientUserAddition);
  //     const updateclientUserAddition = (clientUserAddition.text as string).replaceAll('${clientProfile.clientName}', `${clientProfile.clientName}`).replace('${firstName}',`${firstName}`).replace('${lastName}',`${lastName}`)
  //           .replace('${clientCode}',`${clientCode}`).replace('${username}',`${loginId}`).replace('${password}',`${password}`)
      
  //     const updatedSubject = (clientUserAddition.subject as string).replaceAll('${clientProfile.clientName}', `${clientProfile.clientName}`)      
  //     const updateclientUserAdditionHtml = (clientUserAddition.html as string)
  //     .replaceAll(
  //       "${clientProfile.clientName}",
  //       `${clientProfile.clientName}`
  //     )
  //     .replace("${firstName}", `${firstName}`)
  //     .replace("${lastName}", `${lastName}`)
  //     .replace("${clientCode}", `${clientCode}`)
  //     .replace("${username}", `${loginId}`)
  //     .replace("${password}", `${password}`);
 
  //     const mailOptions = {
  //       from: "support@torus.tech",
  //       to: email,
  //       subject: updatedSubject,
  //       // text: updateclientUserAddition,
  //       html : updateclientUserAdditionHtml
  //     };
  
  //     transporter.sendMail(mailOptions, async (error, info) => {
  //       if (error) {
  //         throw new ForbiddenException('There is an issue with sending otp');
  //       } else {
  //         console.log('Email sent: ' + info.response);
  //         // return `Email sent`;
  //       }
  //     });
  
  //     userList.push({ ...data, password: hashPassword(data.password) });
  //     await this.redisService.setJsonData(
  //       userCachekey,
  //       JSON.stringify(userList),
  //     );
  //     const newUserList = structuredClone(userList);
  
  //     let result = [];
  
  //     for (const user of newUserList) {
  //       delete user.password;
  //       result.push(user);
  //     }
  
  //     return result;
  //   } catch (error) {
  //     await this.throwCustomException(error);
  //   }
  // }
  
  async getDynamicTenantCode(
    clientCode: string,
    tenantName: string,
    Logo?: string,
  ) {
    try {
      if (!clientCode || !tenantName) {
        throw new BadRequestException('invalid input parameters');
      }
      const clientProfileKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`;
      const clientProfile = JSON.parse(
        await this.redisService.getJsonData(clientProfileKey),
      );
      const tenantList = clientProfile?.tenantList
        ? new Set(clientProfile?.tenantList)
        : new Set([]);
      const tenantKeys: string[] = await this.redisService.getKeys(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK`,
      );
      const dynamicTenantKeys = tenantKeys.filter((key) =>
        key.includes(`CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:TT`),
      );
      var newTenantCode = '';
      if (dynamicTenantKeys.length == 0) {
        newTenantCode = 'TT001';
      } else {
        const structuredClientKeys = dynamicTenantKeys.map(
          (key: string) => getRecentKeyStructure(key)['AFGK'],
        );
        const maxExistingCode = Math.max(
          ...structuredClientKeys.map((item) => parseInt(item.slice(2))),
        );
        newTenantCode = `TT${String(maxExistingCode + 1).padStart(3, '0')}`;
      }
      tenantList.add(newTenantCode);
      await this.redisService.setJsonData(
        clientProfileKey,
        JSON.stringify({
          ...clientProfile,
          tenantList: Array.from(tenantList),
        }),
      );
      await this.redisService.setJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${newTenantCode}:AFK:PROFILE:AFVK:v1:tpc`,
        JSON.stringify({
          ...tenantProfileTemplate,
          Code: newTenantCode,
          Name: tenantName,
          Logo: Logo ? Logo : '',
        }),
      );
      return newTenantCode;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async postClientUserRoles(clientCode: string, roles: any[]) {
    try {
      // Validate inputs
      if (!clientCode || !roles || !Array.isArray(roles)) {
        throw new BadRequestException('Improper data to continue');
      }
  
      // Cache keys for users and roles
      const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:users`;
      const roleCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:userRoles`;
  
      // Get the list of users from Redis
      const userList = JSON.parse(await this.redisService.getJsonData(userCachekey));
  
      if (userList && Array.isArray(userList)) {
        // Extract roles from the input for easier comparison
        const roleNames = roles.map(roleObj => roleObj.role);
  
        for (const userObj of userList) {
          if (userObj?.accessProfile && Array.isArray(userObj.accessProfile)) {
            // Filter the accessProfile array to only include roles present in roleNames
            userObj.accessProfile = userObj.accessProfile.filter(accessProfile =>
              roleNames.includes(accessProfile) || accessProfile == 'admin'
            );
          }
        }
  
        // Update the userList in Redis after filtering
        await this.redisService.setJsonData(userCachekey, JSON.stringify(userList));
  
        // Update the roles in Redis if needed (optional if roles need to be stored)
        await this.redisService.setJsonData(roleCachekey, JSON.stringify(roles));
  
        return { message: 'User roles successfully updated.' };
      } else {
        throw new BadRequestException('User list not found');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }
  
  async GetRoles(token: any) {
    try {
      const requiredUser = await this.MyAccountForClient(token);
      const payload: any = this.jwtService.decode(token);
  
      const userRoleKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${payload.client}:AFK:PROFILE:AFVK:v1:userRoles`;
      const userRoleResponse = await this.redisService.getJsonData(userRoleKey);
      const userRoleList: any[] = userRoleResponse ? JSON.parse(userRoleResponse) : [];
  
      const accessProfile: any[] = requiredUser?.accessProfile ? requiredUser.accessProfile : [];
  
      // Return 'admin' role if found
      if (accessProfile.includes("admin")) {
        return { result: "admin" };
      }
  
      let result: any = {};
  
      // Loop through the accessProfile and process roles
      accessProfile.forEach((assignedRole) => {
        const matchingRoleObj = userRoleList.find((userRole) => userRole?.role === assignedRole);
  
        if (matchingRoleObj) {
          const { roleActions } = matchingRoleObj;
  
          roleActions.forEach((roleAction) => {
            const itemCode = roleAction.code;
  
            // Initialize result entry for the role if not present
            if (!result[itemCode]) {
              result[itemCode] = null;
            }
  
            const hasEdit = roleAction.permissions.edit;
            const hasView = roleAction.permissions.view;
  
            // Handle the permission logic
            if (hasEdit) {
              result[itemCode] = "edit"; // Set to "edit" if any edit permission is true
            } else if (hasView && result[itemCode] !== "edit") {
              result[itemCode] = "view"; // Set to "view" only if not already set to "edit"
            }
          });
        }
      });
  
      return result;
  
    } catch (error) {
      console.error("Error:", error);
      await this.throwCustomException(error);
    }
  }
  
  
  async pushArtifactBuild( client: string,
    artifactKeyPrefix: string,
    loginId: string,
    tenant: string,
    appGrp: string,
    app: string,
    version?: string,) {
    try {
      this.logger.log('push to Build started');    
      var dfKeyArr = [], ObjTargetArr = [], artTargetKeyArr = [], nodeTargetKeyArr = []
      if (!tenant || !appGrp || !app || !artifactKeyPrefix || !loginId) {
        throw new BadRequestException('Invalid credentials');
      }   
      const structuredArtifactKey = getRecentKeyStructure(artifactKeyPrefix); 
      if (structuredArtifactKey['FNGK'] === 'AFC') {
        throw new NotAcceptableException(
          'Artifact already pushed to the build',
        );
      }
     
      const copiedArtifactKeyPrefix = await this.replaceKey(artifactKeyPrefix,appGrp, app,client,tenant)    
      
      const allKeysRelatedToArtifact: string[] = await this.redisService.getKeys(artifactKeyPrefix); 

      const UOKey = allKeysRelatedToArtifact.find((key: string) =>
        key.endsWith('UO'),
      );      
      let UOData 
      if (UOKey) {
        UOData = JSON.parse(await this.redisService.getJsonData(UOKey));       
      }
      if(UOData == null){
        throw new BadRequestException('UO data not found')
      }
      let DFDKey = UOData.source    
       //For remove duplicate dfKeys
       if(DFDKey && DFDKey.length > 0){
        for(let i=0;i<DFDKey.length;i++){    
          if(!dfKeyArr.includes(DFDKey[i].dfdKey)){
            dfKeyArr.push(DFDKey[i].dfdKey)                   
          }       
        }
       }     
      if(dfKeyArr && dfKeyArr.length > 0){ 
        for(let a=0; a<dfKeyArr.length;a++){           
          const ckKey = await this.replaceKey(dfKeyArr[a],appGrp, app,client,tenant)  
          await this.pushArtifactCopy(dfKeyArr[a],ckKey)  
          //Tenant DO JSON Changes        
          var doChangedJson = await this.doChangeKey(ckKey,appGrp, app,client,tenant)
          await this.redisService.setJsonData(ckKey+':DO',JSON.stringify(doChangedJson))            
        }
      } 

      //Artifact Level  
      let PFDKey = UOData.mappedData.artifact 

      var artifactEvents = PFDKey.events     
      if(artifactEvents && Object.keys(artifactEvents).length > 0){
       var artifactEveSummary = artifactEvents.eventSummary     
        if(artifactEveSummary != null && Object.keys(artifactEveSummary).length > 0){ 
          await this.getTargetKey(artifactEveSummary.children,artTargetKeyArr)
        }     
      }        


      // Node level
      let PFDnode = PFDKey.node         
      for(let j=0;j<PFDnode.length;j++){
        let pfnodeEvents = PFDnode[j].events       
        if(pfnodeEvents && Object.keys(pfnodeEvents).length > 0){
          var nodeEveSummary = pfnodeEvents.eventSummary          
          if(nodeEveSummary != null && Object.keys(nodeEveSummary).length > 0){
            await this.getTargetKey(nodeEveSummary.children,nodeTargetKeyArr)           
          }        
        }
       

        //Object Elements level
        let pfObjectElements = PFDnode[j].objElements              
        for(let k=0;k<pfObjectElements.length;k++){
          let pfobjEvents = pfObjectElements[k].events
          if(pfobjEvents != null && Object.keys(pfobjEvents).length > 0){
            var ObjeventSummary = pfobjEvents.eventSummary           
           if(ObjeventSummary != null && Object.keys(ObjeventSummary).length > 0){  
            await this.getTargetKey(ObjeventSummary.children,ObjTargetArr) 
           }           
          }          
        }        
      }   

      //Tenant UO JSON Changes  
      var uoTenantJson = await this.uoChangeKey(artifactKeyPrefix,appGrp,app, client,tenant)     
      await this.pushArtifactCopy(artifactKeyPrefix,copiedArtifactKeyPrefix)
      await this.redisService.setJsonData(copiedArtifactKeyPrefix+':UO',JSON.stringify(uoTenantJson)) 
      
      const uniqueArr = [...new Set([...artTargetKeyArr, ...nodeTargetKeyArr, ...ObjTargetArr])]      
      await this.changeAndCopySet(appGrp, app,client,tenant,uniqueArr)  
     
      //BLDC
        let redisKey: string;
        if (version) {
          redisKey = `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${appGrp}:AFK:${app}:AFVK:${version}:bldc`;          
        } 
        else {
          const versions = await this.getAssemblerVersion(          
             `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${appGrp}:AFK:${app}`
          ); 
          let newVersion;
          if (versions && Array.isArray(versions) && versions.length) {
            newVersion = Math.max(...versions.map((item) => parseInt(item.slice(1)))) + 1; 
          } else {
            newVersion = 1;
          }
          redisKey = `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${appGrp}:AFK:${app}:AFVK:v${newVersion}:bldc`;
        }
        const responseFromRedis = await this.redisService.getJsonData(redisKey);        
        const keystructure = getRecentKeyStructure(copiedArtifactKeyPrefix);       
        const recentBuildInfo = {
          artifactKey: artifactKeyPrefix,
          buildKey: copiedArtifactKeyPrefix,
          loginId,
          timestamp: new Date(),
          fabric: keystructure['FNK'],
        };       
        let updatedBuildKey = [recentBuildInfo];       
        if (responseFromRedis) {
          const bldc = JSON.parse(responseFromRedis);
          updatedBuildKey = bldc.buildKey
            ? [...bldc.buildKey, recentBuildInfo]
            : updatedBuildKey;
          await this.redisService.setJsonData(
            redisKey,
            JSON.stringify({
              ...bldc,
              buildKey: updatedBuildKey,
              setupKey: `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
            }),
          );
        } else {
          await this.redisService.setJsonData(redisKey,JSON.stringify({
              buildKey: updatedBuildKey,
              setupKey: `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
              artifactList: []}));
       }
       this.logger.log('Push to build completed');
       return 'Artifact pushed to build successfully';        
     
    } catch (error) {
      // await this.throwCustomException(error);
      if(error.message)
       throw new BadRequestException(error.message);
      else
       throw new BadRequestException(error);
    }
  }

  async changeAndCopySet(appGrp, app,client, tenant,targetArr:any){ 
    try{
      let uniqueKey = []
      for(let t=0; t<targetArr.length;t++){ 
        let versionkey = targetArr[t].split(':')
        let srcKey
        if(versionkey.length>14)
          versionkey.pop()
         
        srcKey = versionkey.join(':')  
        
        if(!uniqueKey.includes(srcKey)){
          uniqueKey.push(srcKey)
        }        
      } 
      let result; 
      for(let u=0;u<uniqueKey.length;u++){
        const tenantKey = await this.replaceKey(uniqueKey[u],appGrp, app,client,tenant)        
        await this.pushArtifactCopy(uniqueKey[u],tenantKey)
        //Tenant PO JSON Changes  
        if(tenantKey.includes(':FNK:PF-PFD:')){
          var poChangeJson = await this.poChangeKey(tenantKey,appGrp, app,client,tenant)
          result = await this.redisService.setJsonData(tenantKey+':PO',JSON.stringify(poChangeJson))
        }
       if(tenantKey.includes(':FNK:UF-UFD:')){
        var uochangeJson = await this.uoChangeKey(tenantKey,appGrp, app,client,tenant)
        result = await this.redisService.setJsonData(tenantKey+':UO',JSON.stringify(uochangeJson))
       } 
      }
      // this.changeAndCopySet(appGrp, app,client, tenant,targetArr)
      return result
    }catch(error){      
      throw error
    }     
  }

  async uoChangeKey(UOKey, appGrp, app,client,tenant){ 
    try { 
      this.logger.log('UOChange Key started')     
      var uojson = JSON.parse(await this.redisService.getJsonData(UOKey+':UO'))  
        
      if(!uojson) throw new NotFoundException(`${UOKey} does not exist`);
      //DO Source level
      if(uojson.source && uojson.source.length > 0){      
        for(let i=0;i<uojson.source.length;i++){  
          uojson.source[i].dfdKey = uojson.source[i].dfdKey?await this.replaceKey(uojson.source[i].dfdKey,appGrp,app,client,tenant):uojson.source[i].dfdKey
          uojson.source[i].dfoType = app
        }
      }

      let pfartifact = uojson.mappedData.artifact        
      
      //PO Artifact level     
      if(pfartifact && pfartifact.events && Object.keys(pfartifact.events).length > 0){
      var artifactEveSummary = pfartifact.events.eventSummary     
        if(artifactEveSummary != null && Object.keys(artifactEveSummary).length > 0){ 
          artifactEveSummary.children = await this.changeTargetKey(artifactEveSummary.children,appGrp,app,client,tenant)    
        }     
      } 
     
      var artifactMapper = pfartifact.mapper
      if(artifactMapper && artifactMapper.length>0){
        for(let item of artifactMapper){                   
          if(item.sourceKey && item.sourceKey.length > 0){
            for(let s=0; s<item.sourceKey.length; s++){
              item.sourceKey[s] = await this.replaceKey(item.sourceKey[s],appGrp,app,client,tenant)
            }
          }
          item.targetKey = await this.replaceKey(item.targetKey,appGrp,app,client,tenant)        
        }
      }

      //PO Node level   
      if(pfartifact.node && pfartifact.node.length >0){
        for(let j=0;j<pfartifact.node.length;j++){
          let pfnodeEvents = pfartifact.node[j].events       
          if(pfnodeEvents && Object.keys(pfnodeEvents).length > 0){
            var nodeEveSummary = pfnodeEvents.eventSummary          
            if(nodeEveSummary != null && Object.keys(nodeEveSummary).length > 0){
              nodeEveSummary.children = await this.changeTargetKey(nodeEveSummary.children,appGrp,app,client,tenant)          
            }        
          }

          let pfnodeMapper = pfartifact.node[j].mapper
          if(pfnodeMapper && pfnodeMapper.length>0){
            for(let item of pfnodeMapper){                   
              if(item.sourceKey && item.sourceKey.length > 0){
                for(let s=0; s<item.sourceKey.length; s++){
                  item.sourceKey[s] = await this.replaceKey(item.sourceKey[s],appGrp,app,client,tenant)
                }
              }
              item.targetKey = await this.replaceKey(item.targetKey,appGrp,app,client,tenant)        
            }
          }
  
          //PO Object Elements level
          let pfObjectElements = pfartifact.node[j].objElements 
          if(pfObjectElements && pfObjectElements.length>0){
            for(let k=0;k<pfObjectElements.length;k++){
              let pfobjEvents = pfObjectElements[k].events
                if(pfobjEvents != null && Object.keys(pfobjEvents).length > 0){
                  var ObjeventSummary = pfobjEvents.eventSummary           
                if(ObjeventSummary != null && Object.keys(ObjeventSummary).length > 0){ 
                  ObjeventSummary.children = await this.changeTargetKey(ObjeventSummary.children,appGrp,app,client,tenant) 
                }           
              }  

              let pfobjMapper = pfObjectElements[k].mapper
              if(pfobjMapper && pfobjMapper.length>0){
                for(let item of pfobjMapper){                   
                  if(item.sourceKey && item.sourceKey.length > 0){
                    for(let s=0; s<item.sourceKey.length; s++){
                      item.sourceKey[s] = item.sourceKey[s]?await this.replaceKey(item.sourceKey[s],appGrp,app,client,tenant):item.sourceKey[s]
                    }
                  }
                  item.targetKey = item.targetKey?await this.replaceKey(item.targetKey,appGrp,app,client,tenant):item.targetKey
                }
              }         
            } 
          }      
        } 
      }     
    
      //UO Security Level
      uojson.securityData.afk = uojson.securityData.afk?await this.replaceKey(uojson.securityData.afk,appGrp,app,client,tenant):uojson.securityData.afk
      
      if(uojson.target && Object.keys(uojson.target).length > 0){
        uojson.target.key = uojson.target.key?await this.replaceKey(uojson.target.key,appGrp,app,client,tenant):uojson.target.key
      }      

      if(uojson.selectedSource && uojson.selectedSource.length > 0){
        for(let s=0;s<uojson.selectedSource.length;s++){
          uojson.selectedSource[s].tKey = 'AFC'
          uojson.selectedSource[s].catalog = appGrp
          uojson.selectedSource[s].artifactGroup = app  
          uojson.selectedSource[s].path = uojson.selectedSource[s].path?await this.replaceKey(uojson.selectedSource[s].path,appGrp,app,client,tenant):uojson.selectedSource[s].path
        }
      }
     
      if(uojson.selectedTarget && Object.keys(uojson.selectedTarget).length > 0){
        uojson.selectedTarget.tKey = 'AFC'
        uojson.selectedTarget.catalog = appGrp
        uojson.selectedTarget.artifactGroup = app        
        uojson.selectedTarget.path = uojson.selectedTarget.path?await this.replaceKey(uojson.selectedTarget.path,appGrp,app,client,tenant):uojson.selectedTarget.path
      }
      
      if(uojson.nodes && uojson.nodes.length > 0){
        for(let n=0;n<uojson.nodes.length;n++){
          uojson.nodes[n].id = uojson.nodes[n].id?await this.replaceKey(uojson.nodes[n].id,appGrp,app,client,tenant):uojson.nodes[n].id
          if(uojson.nodes[n].type == "customSourceItems"){
            if(Object.keys(uojson.nodes[n].data).length > 0){
              uojson.nodes[n].data.path = uojson.nodes[n].data.path?await this.replaceKey(uojson.nodes[n].data.path,appGrp,app,client,tenant):uojson.nodes[n].data.path
                           
              if(Object.keys(uojson.nodes[n].data.dfo).length > 0){
                let nodedfoKey = Object.keys(uojson.nodes[n].data.dfo)   
                if(nodedfoKey && nodedfoKey.length > 0){
                  for(let d=0;d<nodedfoKey.length;d++){ 
                    let dfoVal = uojson.nodes[n].data.dfo[nodedfoKey[d]]  
                    if(dfoVal && dfoVal.length > 0){
                      for(let f=0;f<dfoVal.length;f++){
                        // dfoVal[f].nodeId = dfoVal[f].nodeId?await this.replaceKey(dfoVal[f].nodeId,appGrp,app,client,tenant):dfoVal[f].nodeId
                        var ifo = dfoVal[f].ifo
                        if(ifo && ifo.length > 0){
                          for(let f=0;f<ifo.length;f++){
                            ifo[f].path = ifo[f].path?await this.replaceKey(ifo[f].path,appGrp,app,client,tenant):ifo[f].path
                            ifo[f].artifact = ifo[f].artifact?await this.replaceKey(ifo[f].artifact,appGrp,app,client,tenant):ifo[f].artifact
                          }
                        }                                         
                      }  
                    }                             
                    
                    //Renaming the Object key with Tenant Key
                   
                    let renameKey = await this.replaceKey(nodedfoKey[d],appGrp,app,client,tenant)                
                    uojson.nodes[n].data.dfo[renameKey] = uojson.nodes[n].data.dfo[nodedfoKey[d]]                  
                    delete uojson.nodes[n].data.dfo[nodedfoKey[d]]  
                  } 
                }        
              } 
            }           
          }         
        }
      }
    
     
      if(uojson.edges && uojson.edges.length > 0){       
        for(var e=0;e<uojson.edges.length;e++){          
          uojson.edges[e].id = uojson.edges[e].id?await this.replaceKey(uojson.edges[e].id,appGrp,app,client,tenant):uojson.edges[e].id          
          uojson.edges[e].source = uojson.edges[e].source?await this.replaceKey(uojson.edges[e].source,appGrp,app,client,tenant):uojson.edges[e].source
          uojson.edges[e].sourceHandle = uojson.edges[e].sourceHandle?await this.replaceKey(uojson.edges[e].sourceHandle,appGrp,app,client,tenant):uojson.edges[e].sourceHandle
          uojson.edges[e].target = uojson.edges[e].target?await this.replaceKey(uojson.edges[e].target,appGrp,app,client,tenant):uojson.edges[e].target
          uojson.edges[e].targetHandle = uojson.edges[e].targetHandle?await this.replaceKey(uojson.edges[e].targetHandle,appGrp,app,client,tenant):uojson.edges[e].targetHandle
        }
      }
      this.logger.log('UOChange Key completed')
      return uojson
    } catch (error) {
      // console.log('UO ERROR:',error);      
      throw error
    }
  } 

  async doChangeKey(doTenantKey,appGrp, app,client,tenant){
    try {
      this.logger.log('DOChange Key started')
      var doJson = JSON.parse(await this.redisService.getJsonData(doTenantKey+':DO'))  
      if(!doJson) throw new NotFoundException(`${doJson} does not exist`);
      
      var doArtifactNode = doJson.mappedData.artifact.node   
      
        //DO Node Level (Data Set change)
        if(doArtifactNode && doArtifactNode.length > 0){
          for(let n=0;n<doArtifactNode.length;n++){
            var dataSet = doArtifactNode[n].DataSet
            if(dataSet && dataSet.length > 0){
              for(let d=0;d<dataSet.length;d++){
                dataSet[d].artifact = dataSet[d].artifact?await this.replaceKey(dataSet[d].artifact,appGrp, app,client,tenant):dataSet[d].artifact
                dataSet[d].path = dataSet[d].path?await this.replaceKey(dataSet[d].path,appGrp, app,client,tenant):dataSet[d].path
              }
            }
          }
        }

        //DO Security Level
        doJson.securityData.afk = doJson.securityData.afk?await this.replaceKey(doJson.securityData.afk,appGrp, app,client,tenant):doJson.securityData.afk
          
        if(doJson.selectedSource && Object.keys(doJson.selectedSource).length > 0){
          doJson.selectedSource.tKey = 'AFC'
          doJson.selectedSource.catalog = appGrp
          doJson.selectedSource.artifactGroup = app
          doJson.selectedSource.path = doJson.selectedSource.path?await this.replaceKey(doJson.selectedSource.path,appGrp, app,client,tenant):doJson.selectedSource.path
        }
               
        if(doJson.nodes && doJson.nodes.length>0){
          for(let i=0;i<doJson.nodes.length;i++){            
            doJson.nodes[i].id = doJson.nodes[i].id?await this.replaceKey(doJson.nodes[i].id,appGrp, app,client,tenant):doJson.nodes[i].id
            if(doJson.nodes[i].type == "customTargetItems"){
              if(doJson.nodes[i].data.length > 0){
                for(let d=0;d<doJson.nodes[i].data.length;d++){
                  doJson.nodes[i].data[d].artifact =  doJson.nodes[i].data[d].artifact?await this.replaceKey(doJson.nodes[i].data[d].artifact,appGrp, app,client,tenant):doJson.nodes[i].data[d].artifact
                  doJson.nodes[i].data[d].path =  doJson.nodes[i].data[d].path?await this.replaceKey(doJson.nodes[i].data[d].path,appGrp, app,client,tenant):doJson.nodes[i].data[d].path
                }
              }
            }
          }
        }
        if(doJson.target && Object.keys(doJson.target).length > 0){  
          //let targetDstKey = doJson.target.key
          doJson.target.key = doJson.target.key?await this.replaceKey(doJson.target.key,appGrp, app,client,tenant):doJson.target.key
          // if((await this.redisService.getKeys(doJson.target.key)).length == 0){
          //   let targetDstJson = await this.doChangeKey(targetDstKey,appGrp, app,client,tenant)
          //   //Tenant DF-DST setting
          //   await this.redisService.setJsonData(doJson.target.key+':DO',JSON.stringify(targetDstJson)) 
          // }
        }       
        
        if(doJson.targetItems && doJson.targetItems.length>0){
          for(let j=0;j<doJson.targetItems.length;j++){
            doJson.targetItems[j].artifact = doJson.targetItems[j].artifact?await this.replaceKey(doJson.targetItems[j].artifact,appGrp, app,client,tenant):doJson.targetItems[j].artifact
            doJson.targetItems[j].path = doJson.targetItems[j].path?await this.replaceKey(doJson.targetItems[j].path,appGrp, app,client,tenant):doJson.targetItems[j].path
          }
        }
        if(doJson.selectedTarget && Object.keys(doJson.selectedTarget).length > 0){
          doJson.selectedTarget.tKey = 'AFC'
          doJson.selectedTarget.catalog = appGrp
          doJson.selectedTarget.artifactGroup = app
          doJson.selectedTarget.path = doJson.selectedTarget.path?await this.replaceKey(doJson.selectedTarget.path,appGrp, app,client,tenant):doJson.selectedTarget.path
        }        
        
        if(doJson.edges && doJson.edges.length>0){
          for(let k=0;k<doJson.edges.length;k++){
            doJson.edges[k].id = doJson.edges[k].id?await this.replaceKey(doJson.edges[k].id,appGrp, app,client,tenant):doJson.edges[k].id
            doJson.edges[k].id = doJson.edges[k].id?await this.replaceKey(doJson.edges[k].id,appGrp, app,client,tenant):doJson.edges[k].id
            doJson.edges[k].source = doJson.edges[k].source?await this.replaceKey(doJson.edges[k].source,appGrp, app,client,tenant):doJson.edges[k].source
            doJson.edges[k].target = doJson.edges[k].target?await this.replaceKey(doJson.edges[k].target,appGrp, app,client,tenant):doJson.edges[k].target
            doJson.edges[k].sourceHandle = doJson.edges[k].sourceHandle?await this.replaceKey(doJson.edges[k].sourceHandle,appGrp, app,client,tenant):doJson.edges[k].sourceHandle
            doJson.edges[k].targetHandle = doJson.edges[k].targetHandle?await this.replaceKey(doJson.edges[k].targetHandle,appGrp, app,client,tenant):doJson.edges[k].targetHandle
          }
        }        
        this.logger.log('DOChange Key completed')
        return doJson
    } catch (error) {
      // console.log('DO Error',error);      
      throw error
    }      
  }  

  async poChangeKey(poTenantKey,appGrp, app,client,tenant){
    try {
      this.logger.log('POChange Key started')
      var poJson = JSON.parse(await this.redisService.getJsonData(poTenantKey+':PO')) 
      if(!poJson) throw new NotFoundException(`${poJson} does not exist`);
      //PO Security level
      poJson.securityData.afk = poJson.securityData.afk?await this.replaceKey(poJson.securityData.afk,appGrp, app,client,tenant):poJson.securityData.afk 
     
      if(poJson.source && poJson.source.length > 0){
        for(let i=0;i<poJson.source.length;i++){
          let srcUfKey = poJson.source[i].dfdKey
          poJson.source[i].dfdKey = poJson.source[i].dfdKey?await this.replaceKey(poJson.source[i].dfdKey,appGrp, app,client,tenant):poJson.source[i].dfdKey
          poJson.source[i].dfoType = app
          if(poJson.source[i].dfdKey.includes('FNK:UF-UFD')){                    
            if((await this.redisService.getKeys(poJson.source[i].dfdKey)).length == 0){              
              let srcUFJSon = await this.uoChangeKey(srcUfKey,appGrp, app,client,tenant)
                   
              await this.pushArtifactCopy(srcUfKey,poJson.source[i].dfdKey)
              await this.redisService.setJsonData(poJson.source[i].dfdKey+':UO',JSON.stringify(srcUFJSon))
            }
          }      
        }
      }

      if(poJson.target && Object.keys(poJson.target).length > 0){
        poJson.target.key = poJson.target.key?await this.replaceKey(poJson.target.key,appGrp, app,client,tenant):poJson.target.key
      }  

      if(poJson.selectedSource && poJson.selectedSource.length > 0){
        for(let j=0;j<poJson.selectedSource.length;j++){
          poJson.selectedSource[j].tKey = 'AFC'
          poJson.selectedSource[j].catalog = appGrp
          poJson.selectedSource[j].artifactGroup = app
          poJson.selectedSource[j].path = poJson.selectedSource[j].path?await this.replaceKey(poJson.selectedSource[j].path, appGrp, app, client, tenant) : poJson.selectedSource[j].path
        }
      }

      if(poJson.selectedTarget && Object.keys(poJson.selectedTarget).length > 0){
        poJson.selectedTarget.tKey = "AFC"
        poJson.selectedTarget.catalog = appGrp
        poJson.selectedTarget.artifactGroup = app
        poJson.selectedTarget.path = poJson.selectedTarget.path?await this.replaceKey(poJson.selectedTarget.path,appGrp, app,client,tenant):poJson.selectedTarget.path
      }
      
      if(poJson.nodes && poJson.nodes.length > 0){
        for(let k=0;k<poJson.nodes.length;k++){
          poJson.nodes[k].id = poJson.nodes[k].id?await this.replaceKey(poJson.nodes[k].id,appGrp, app,client,tenant):poJson.nodes[k].id
          if(poJson.nodes[k].type == "customSourceItems"){
            if(Object.keys(poJson.nodes[k].data).length > 0){
              
              poJson.nodes[k].data.path = poJson.nodes[k].data.path?await this.replaceKey(poJson.nodes[k].data.path,appGrp,app,client,tenant):poJson.nodes[k].data.path
              if(Object.keys(poJson.nodes[k].data.dfo).length > 0){
                let nodedfoKey = Object.keys(poJson.nodes[k].data.dfo)   
                for(let d=0;d<nodedfoKey.length;d++){
                  let dfoVal = poJson.nodes[k].data.dfo[nodedfoKey[d]]
                  for (let f = 0; f < dfoVal.length; f++) {
                    dfoVal[f].selectedDropdownName = dfoVal[f].selectedDropdownName ? await this.replaceKey(dfoVal[f].selectedDropdownName, appGrp, app, client, tenant) : dfoVal[f].selectedDropdownName
                    if (dfoVal[f].ifo && dfoVal[f].ifo.length > 0) {
                      for (let g = 0; g < dfoVal[f].ifo.length; g++) {
                        dfoVal[f].ifo[g].nodeId = await this.replaceKey(dfoVal[f].ifo[g].nodeId, appGrp, app, client, tenant)
                      }
                    }
                  }

                  //Renaming the Object key with Tenant Key
                  let renameKey = await this.replaceKey(nodedfoKey[d], appGrp, app, client, tenant)
                  poJson.nodes[k].data.dfo[renameKey] = poJson.nodes[k].data.dfo[nodedfoKey[d]]
                  delete poJson.nodes[k].data.dfo[nodedfoKey[d]]
                }
              }
            }
          }
        }
      }

      if(poJson.edges && poJson.edges.length > 0){
        for(let e=0;e<poJson.edges.length;e++){         
          poJson.edges[e].id = poJson.edges[e].id ? await this.replaceKey(poJson.edges[e].id, appGrp, app, client, tenant) : poJson.edges[e].id

          poJson.edges[e].source = poJson.edges[e].source ? await this.replaceKey(poJson.edges[e].source, appGrp, app, client, tenant) : poJson.edges[e].source
          poJson.edges[e].sourceHandle = poJson.edges[e].sourceHandle ? await this.replaceKey(poJson.edges[e].sourceHandle, appGrp, app, client, tenant) : poJson.edges[e].sourceHandle
          poJson.edges[e].target = poJson.edges[e].target ? await this.replaceKey(poJson.edges[e].target, appGrp, app, client, tenant) : poJson.edges[e].target
          poJson.edges[e].targetHandle = poJson.edges[e].targetHandle ? await this.replaceKey(poJson.edges[e].targetHandle, appGrp, app, client, tenant) : poJson.edges[e].targetHandle
        }
      }
      this.logger.log('POChange Key completed')
      return poJson 
    } catch (error) {
      // console.log('PO Error',error);      
      throw error
    }
  }

  async replaceKey(redisKey,appGrp, app,client,tenant){ 
    try {   
        
      if(typeof redisKey == 'string'){
        var Catkey = redisKey.split('CATK')[1].split(':')[1]
        var Afgkey = redisKey.split('AFGK')[1].split(':')[1]           
        var response = redisKey.replaceAll(`CATK:${Catkey}`,`CATK:${appGrp}`).replaceAll(`AFGK:${Afgkey}`, `AFGK:${app}`).replaceAll(':AF:', ':AFC:').replaceAll(`CK:${client}:`, `CK:${tenant}:`)
      }
            
      return response
    } catch (error) {
      throw error
    }  
  }

  async pushArtifactCopy(sourceKey,destinationKey){    
    try {       
        const srckeyChk = await redis.keys(sourceKey+':*')           
        const deskeyChk = await redis.keys(destinationKey+':*')                 
        if(deskeyChk.length > 0){          
            for(var d=0;d<deskeyChk.length;d++){                    
            await this.redisService.deleteKey(deskeyChk[d])          
        }        
    }                 
    if(srckeyChk.length > 0){            
        var resFlg = 0            
        for(var i=0;i<srckeyChk.length;i++){               
            var srcJson = await this.redisService.getJsonData(srckeyChk[i])                
            const result = await this.redisService.setJsonData(destinationKey+srckeyChk[i].replace(sourceKey, ''),srcJson)                         
            if(result){                
                resFlg++              
            }            
        }           
         if(resFlg == srckeyChk.length){             
            return 'Data Copied successfully';            
        }          
    }else{            
        throw `${sourceKey} source Key does not exists to copy`;          
    }            
} catch (error) {      
    throw error;    
}   
}

  async getTargetKey(data,eventSummary) {  
    try {
      if (data.length > 0) {
        for(var a= 0; a < data.length; a++) {
          if(data[a].key){ 
            if(!eventSummary.includes(data[a].key)){
              eventSummary.push(data[a].key) 
            }  
          } 
          if(data[a].targetKey){ 
            for(let i=0;i<data[a].targetKey.length;i++){
              if(!eventSummary.includes(data[a].targetKey[i])){
                eventSummary.push(data[a].targetKey[i])   
              } 
            }                 
          }        
          if(data[a].children?.length > 0) {         
            this.getTargetKey(data[a].children,eventSummary);
          }
        }  
      }  
    } catch (error) {
      throw new BadRequestException(error)
    }    
  }

  async changeTargetKey(data,appGrp,app,client,tenant) {  
    try {
      if (data.length > 0) {
        for(var a= 0; a < data.length; a++) {
          if(data[a].targetKey){ 
            let targetKey = data[a].targetKey
                          
            for(let t=0;t<targetKey.length;t++){ 
              var Catkey = targetKey[t].split('CATK')[1].split(':')[1]
              var Afgkey = targetKey[t].split('AFGK')[1].split(':')[1]           
              targetKey[t] = targetKey[t].replace(`CATK:${Catkey}`,`CATK:${appGrp}`).replace(`AFGK:${Afgkey}`, `AFGK:${app}`).replace(':AF:', ':AFC:').replace(`CK:${client}:`, `CK:${tenant}:`)
            }        
          }        
          if(data[a].children?.length > 0) {         
            this.changeTargetKey(data[a].children,appGrp,app,client,tenant);
          }
        }  
      }    
      return data
    } catch (error) {
      throw new BadRequestException(error)
    }  
  }




  // ====TP-Auth====
  async clientRegister(
    clientName: string,
    firstName: string,
    lastName: string,
    email: string,
    userName: string,
    mobile: string | number,
    password: string,
    team: boolean = false,
    isIdentityProvider: boolean = false,
    userImage: string = '',
  ) {
    try {
      if (team) {
        if (!clientName)
          throw new BadRequestException('Please provide client name');
      }
      // Step 1: Validate input data
      if (!firstName || !lastName || !email || !userName) {
        throw new BadRequestException('Not enough data to continue');
      }

      // Step 2: Determine client prefix based on team flag
      const clientPrefix = team ? 'CT' : 'CI';

      // Step 3: Get all relevant client keys from Redis
      const getAllClientKeys: string[] = await this.redisService.getKeys(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK`,
      );

      // Step 4: Filter keys that match the prefix and have 'users' in AFSK
      const userProfileKeys = getAllClientKeys.filter((key: string) => {
        const keyStructure = getRecentKeyStructure(key);
        return (
          keyStructure['AFGK'].includes(clientPrefix) &&
          keyStructure['AFSK'] == 'users'
        );
      });

      const logo = userImage ? userImage : undefined;

      function getFutureDateFormatted(days = 60, fromDate = new Date()) {
        const futureDate = new Date(fromDate);
        futureDate.setDate(futureDate.getDate() + days);
       
        const year = futureDate.getFullYear();
        const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
        const day = String(futureDate.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
      }

      // Step 5: Prepare the user object
      const userObject = [
        {
          loginId: userName,
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobile: mobile,
          password: hashPassword(password),
          '2FAFlag': 'N',
          scope: 'client_admin',
          status: 'active',
          accessProfile: ['admin'],
          accessExpires: getFutureDateFormatted(),
          dateAdded: new Date(),
          logo,
        },
      ];

      var newClientCode: string;

      // Check if email already exist for an individual
      
        for (const key of userProfileKeys) {
          const userJson = await this.redisService.getJsonData(key);
          if (userJson) {
            const userList: any[] = JSON.parse(userJson);
            const emailAlreadyExist = userList.find(
              (ele: any) => ele.email == email,
            );
            const userNameAlreadyExist = userList.find(
              (ele: any) => ele.loginId == userName,
            );
            if(!team){
              if (userNameAlreadyExist) {
                if (!isIdentityProvider) {
                  throw new NotAcceptableException(
                    'Username already exist, please provide another username',
                  );
                }
              }
            }
           
            if (emailAlreadyExist)
              throw new ForbiddenException(
                'Email already registered , please provide another email or signin to your account',
              );
          }
        }
     

      // Step 6: Handle new client or existing client code
      if (userProfileKeys.length == 0) {
        // No existing clients, create the first client code
        newClientCode = `${clientPrefix}001`;
      } else {
        // Existing clients, generate a new client code by incrementing the max code
        const structuredClientKeys = userProfileKeys.map(
          (key: string) => getRecentKeyStructure(key)['AFGK'],
        );
        const maxExistingCode = Math.max(
          ...structuredClientKeys.map((item) => parseInt(item.slice(2))),
        );
        newClientCode = `${clientPrefix}${String(maxExistingCode + 1).padStart(
          3,
          '0',
        )}`;
      }

      // Step 7: Save the user object in Redis
      await this.redisService.setJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${newClientCode}:AFK:PROFILE:AFVK:v1:users`,
        JSON.stringify(userObject),
      );
      await this.redisService.setJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${newClientCode}:AFK:PROFILE:AFVK:v1:tpc`,
        JSON.stringify({
          clientName: clientName,
          code: newClientCode,
          logo: '',
        }),
      );

      const responseFromRedis = await this.redisService.getJsonData(
        'emailTemplates:clientRegister',
      );

      const clientRegister = JSON.parse(responseFromRedis);

      const updatedTemplateText = (clientRegister.text as string)
        .replace('${name}', `${firstName ?? email} ${lastName ?? ''}`)
        .replace('${newClientCode}', `${newClientCode}`);

      // Step 8: send clientcode detail for client via email
      const updatedTemplateHtml = (clientRegister.html as string)
      .replace("${name}", `${firstName ?? email} ${lastName ?? ""}`)
      .replace("${newClientCode}", `${newClientCode}`);

    // Step 8: send clientcode detail for client via email
    const mailOptions = {
      from: "support@torus.tech",
      to: email,
      subject: "Registered successfully",
      // text: updatedTemplateText,
      html: updatedTemplateHtml,
    };

   

      if (team) {
        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            throw new ForbiddenException('There is an issue with sending otp');
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }

      return `New client created with code: ${newClientCode}`;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }


  async individualSignin(
    username: string,
    password: string,
    isIdentityProvider: boolean = false,
  ) {
    try {
      if (!isIdentityProvider) {
        if (!username || !password) {
          throw new BadRequestException('Not enough data to continue');
        }
      }
      const getAllClientKeys: string[] = await this.redisService.getKeys(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK`,
      );

      const userProfileKeys = getAllClientKeys.filter((key: string) => {
        const keyStructure = getRecentKeyStructure(key);
        return (
          keyStructure['AFGK'].includes('CI') && keyStructure['AFSK'] == 'users'
        );
      });
      let client: string;
      let email: string;
      let loginId: string;
      if(!isIdentityProvider &&userProfileKeys.length == 0){
        throw new ForbiddenException('No user found');
      }
      for (let index = 0; index < userProfileKeys.length; index++) {
        const element = userProfileKeys[index];
        const userJson = await this.redisService.getJsonData(element);
        if (userJson) {
          const userList = JSON.parse(userJson);
          let foundedUser: Record<string, string>;
          if (isIdentityProvider) {
            foundedUser = userList.find(
              (ele) => ele.loginId == username || ele.email == username,
            );
          } else {
            foundedUser = userList.find(
              (ele) =>
                (ele.loginId == username || ele.email == username) &&
                comparePasswords(password, ele.password),
            );
          }
          if (foundedUser) {
            delete foundedUser.password;
            client = getRecentKeyStructure(element)['AFGK'];
            email = foundedUser.email;
            loginId = foundedUser.loginId;
            const token = await this.jwtService.signAsync(
              { ...foundedUser, client: client },
              {
                secret: auth_secret,
                expiresIn: '1h',
              },
            );
            return { token, authorized: true, client, email, loginId };
          } else if (index == userProfileKeys.length - 1) {
            if (isIdentityProvider) {
              return undefined;
            } else {
              throw new ForbiddenException('Incorrect username or password');
            }
          }
        }
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async emailVerificationOtp(email: string, team: boolean = false) {
    try {
      if (!email) {
        throw new BadRequestException('Not enough data to continue');
      }
      const otpCacheKey = 'otpjson';
      if (!team) {
        const getAllClientKeys: string[] = await this.redisService.getKeys(
          `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK`,
        );
        const userProfileKeys = getAllClientKeys.filter((key: string) => {
          const keyStructure = getRecentKeyStructure(key);
          return (
            keyStructure['AFGK'].includes('CI') &&
            keyStructure['AFSK'] == 'users'
          );
        });
        for (let index = 0; index < userProfileKeys.length; index++) {
          const element = userProfileKeys[index];
          const userJson = await this.redisService.getJsonData(element);
          if (userJson) {
            const userList = JSON.parse(userJson);
            const foundedUser = userList.find((ele) => ele.email == email);
            if (foundedUser) {
              throw new NotAcceptableException('User already exist');
            }
          }
        }
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpJsonFromRedis = await this.redisService.getJsonData(otpCacheKey);
      var otpJson = [];

      if (otpJsonFromRedis) {
        otpJson = JSON.parse(otpJsonFromRedis);
        const existingIndex = otpJson.findIndex((ele) => ele.email == email);
        if (existingIndex != -1) {
          otpJson.splice(existingIndex, 1, { email, otp });
        } else {
          otpJson.push({ email, otp });
        }
      } else {
        otpJson.push({ email, otp });
      }
      await this.redisService.setJsonData(otpCacheKey, JSON.stringify(otpJson));
      const responseFromRedis = await this.redisService.getJsonData(
        'emailTemplates:mailVerficationOtp',
      );
      const verificationTemplate = JSON.parse(responseFromRedis);
      const updatedTemplate = (verificationTemplate.text as string)
        .replace('${email}', email.split('@')[0])
        .replace('${otp}', `${otp}`);
        const fabricatedUserName = email.split('@')[0]
      const mailOptions = {
        from: 'support@torus.tech',
        to: email,
        subject: verificationTemplate.subject,
        // text: updatedTemplate,
        html: verificationTemplate.html.replace('${email}', fabricatedUserName.charAt(0).toUpperCase() + fabricatedUserName.slice(1))
        .replace('${otp}', `${otp}`)
      };
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          throw new ForbiddenException('Please check email is correct');
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      return `Email sent`;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }


  async verifyMailId(
    client: string,
    email: string,
    otp: string,
    type: string = 't',
  ) {
    try {
      if (client && email && otp) {
        const otpCacheKey =
          type == 't'
            ? `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${client}:AFK:PROFILE:AFVK:v1:otp`
            : `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${client}:AFK:PROFILE:AFVK:v1:otp`;
        const otpJsonFromRedis =
          await this.redisService.getJsonData(otpCacheKey);
        if (otpJsonFromRedis) {
          const otpJson = JSON.parse(otpJsonFromRedis);
          const existingIndex = otpJson.findIndex((ele: any, index: number) => {
            if (ele.email == email && ele.otp == otp) {
              return ele;
            }
          });
          if (existingIndex != -1) {
            otpJson.splice(existingIndex, 1);
            await this.redisService.setJsonData(
              otpCacheKey,
              JSON.stringify(otpJson),
            );
            return `Email verified successfully`;
          } else {
            throw new NotFoundException(
              'No data found , Please check credentials',
            );
          }
        } else {
          throw new NotFoundException(
            'No data found , Please check credentials',
          );
        }
      } else {
        throw new BadRequestException('Please provide email and otp value');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async authValidateResetOtp(email: string, otp: string, clientCode: string) {
    try {
      const otpResponseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:otp`,
      );
      if (otpResponseFromRedis && email && otp && clientCode) {
        const otpList: any[] = JSON.parse(otpResponseFromRedis);
        const otpExistingIndex = otpList.findIndex(
          (ele) => ele.email == email && ele.otp == otp,
        );
        if (otpExistingIndex != -1) {
          otpList.splice(otpExistingIndex, 1);
          await this.redisService.setJsonData(
            `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:otp`,
            JSON.stringify(otpList),
          );
          return `Otp verified successfully`;
        } else {
          throw new NotAcceptableException('Invalid OTP or Otp expired');
        }
      } else {
        throw new NotFoundException('OTP not found');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }
  async sendResetOtp(
    email: string,
    team: boolean = false,
    clientCode?: string,
  ) {
    try {
      if (
        !email ||
        !email.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
      ) {
        throw new BadRequestException('Invalid email address');
      }

      let requiredClientCode: string;
      if (team) {
        if (!clientCode) {
          throw new BadRequestException(
            'Please give valid client code to continue',
          );
        }
        requiredClientCode = clientCode;
      } else {
        const allClientKeys: any[] = await this.redisService.getKeys(
          `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK`,
        );
        const allUserKeysRelatedToIndividualClients = allClientKeys.filter(
          (key: string) =>
            key.includes(`CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:CI`) &&
            key.endsWith('users'),
        );
        for (
          let index = 0;
          index < allUserKeysRelatedToIndividualClients.length;
          index++
        ) {
          const key = allUserKeysRelatedToIndividualClients[index];
          const userJson = await this.redisService.getJsonData(key);
          if (userJson) {
            const userList = JSON.parse(userJson);
            const existingUser = userList.find((ele) => ele.email == email);
            if (existingUser) {
              // const resolvePromise = await this.appService.getRecentKeyStructure(key)['AFGK'];
              requiredClientCode = key.split(':')[9];
              console.log('requiredClientCode', requiredClientCode);

              break;
            } else if (
              index ==
              allUserKeysRelatedToIndividualClients.length - 1
            ) {
              throw new NotFoundException('User not exists');
            }
          }
        }
      }

      const userResponseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${requiredClientCode}:AFK:PROFILE:AFVK:v1:users`,
      );
      if (!userResponseFromRedis) {
        throw new NotFoundException('Invalid client code');
      }
      const userList: any[] = JSON.parse(userResponseFromRedis);
      const foundedUser = userList.find((user: any) => user.email === email);
      if (!foundedUser) {
        throw new NotFoundException('User not found');
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpJsonFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${requiredClientCode}:AFK:PROFILE:AFVK:v1:otp`,
      );
      var otpJson = [];

      if (otpJsonFromRedis) {
        otpJson = JSON.parse(otpJsonFromRedis);
        const existingIndex = otpJson.findIndex((ele) => ele.email == email);
        if (existingIndex != -1) {
          otpJson.splice(existingIndex, 1, { email, otp });
        } else {
          otpJson.push({ email, otp });
        }
      } else {
        otpJson.push({ email, otp });
      }
      await this.redisService.setJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${requiredClientCode}:AFK:PROFILE:AFVK:v1:otp`,
        JSON.stringify(otpJson),
      );

      const responseFromRedis = await this.redisService.getJsonData(
        'emailTemplates:resetPasswordOtp',
      );
      const resetOtpTemplate = JSON.parse(responseFromRedis);
      const capitalizeFirstLetter = (str: string) => {
        if (!str) return str; // If the string is empty or null, return it as is.
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
      const updatedTemplateText = (resetOtpTemplate.text as string)
  .replace(
    '${name}',
    `${capitalizeFirstLetter(foundedUser.firstName ?? email)} ${capitalizeFirstLetter(foundedUser.lastName ?? '')}`,
  )
  .replace('${otp}', `${otp}`);
  const updatedTemplateHtml = (resetOtpTemplate.html as string)
  .replace(
    '${name}',
    `${capitalizeFirstLetter(foundedUser.firstName ?? email)} ${capitalizeFirstLetter(foundedUser.lastName ?? '')}`,
  )
  .replace('${otp}', `${otp}`);

      const mailOptions = {
        from: 'support@torus.tech',
        to: email,
        subject: resetOtpTemplate.subject,
        // text: updatedTemplateText,
        // html: `<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>Document</title><style>.banner {width: 65.5%;background-image: url(https://res.cloudinary.com/dhesy4xco/image/upload/v1730880270/dcbw3xm1cyawcx9bxze1.png);background-size: cover;background-color: #000e2f;padding: 20px;text-align: center;} .card { background: white; margin: 100px auto 0 auto; color: #000; width: 76.3%; max-width: 500px; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); text-align: left; } .card h2 { color: #0736C4; margin-top: 0; } .social-icons { margin-top: 20px; } .social-icons a { text-decoration: none; margin-right: 20px; } .social-icons img { width: 24px; height: 24px; } .verify-code { font-size: 24px; font-weight: bold; color: #333; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9; text-align: center; } .footer { font-size: 12px; border-top: solid 1px; color: #ccc; margin-top: 20px; text-align: center; } .footer a { color: #ccc; text-decoration: none; } @media (max-width: 1400px) { .banner { width: 100%; } }</style></head><body style=\"display: flex; flex-direction: column; justify-content: center; align-items: center;\"><div class=\"banner\"><div class=\"card\"><h2>Hey, ${email}</h2><p>Thank you for verifying your account on Torus!</p><p>To complete the sign-up process, enter the 6-digit code in the original window:</p><div class=\"verify-code\">${otp}</div></div><div class=\"social-icons\"><a href=\"https://linkedin.com\"><img src=\"https://res.cloudinary.com/dhesy4xco/image/upload/v1730892702/dkxkn9sqjvdy0ywvgw7p.png\" alt=\"linkedIn\" /></a><a href=\"https://instagram.com\"><img src=\"https://res.cloudinary.com/dhesy4xco/image/upload/v1730892802/igfy5ykbihg1wn9zy7ou.png\" alt=\"Instagram\" /></a><a href=\"https://facebook.com\"><img src=\"https://res.cloudinary.com/dhesy4xco/image/upload/v1730892911/kajxhnz1zatmgebq9xhc.png\" alt=\"Facebook\" /></a><a href=\"https://x.com\"><img src=\"https://res.cloudinary.com/dhesy4xco/image/upload/v1730893028/vjqc6yfcp68xikpzz17u.png\" alt=\"Twitter\" /></a><a href=\"https://youtube.com\"><img src=\"https://res.cloudinary.com/dhesy4xco/image/upload/v1730893065/il07xkltl1nr7yayckxo.png\" alt=\"YouTube\" /></a></div><div class=\"footer\"><p>If you have any questions, feel free to message us at <a href=\"mailto:support@torus.tech\" style=\"font-weight: 700\">support@torus.tech</a>.</p><p>All rights reserved. Update email preferences or unsubscribe.</p><p>Ward 41G, Vasanthapuram, South<br />Bypass Road, Tirunelveli, Tamil Nadu 627005</p><p><a href=\"#\">Terms of Use</a> | <a href=\"#\">Privacy Policy</a></p></div></div></body></html>`
        html:updatedTemplateHtml
      };
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          throw new ForbiddenException('There is an issue with sending otp');
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      return {
        data: `Email sent to the Client=${requiredClientCode}`,
        clientCode: requiredClientCode,
      };
    } catch (error) {
      await this.throwCustomException(error);
    }
  }


  async verifyEmailOtp(email: string, otp: number) {
    try {
      if (!email || !otp) {
        throw new BadRequestException('Not enough data to continue');
      }

      const otpCacheKey = 'otpjson';
      const otpJsonFromRedis = await this.redisService.getJsonData(otpCacheKey);
      if (otpJsonFromRedis) {
        const otpJson = JSON.parse(otpJsonFromRedis);
        const existingIndex = otpJson.findIndex(
          (ele) => ele.email == email && ele.otp == otp,
        );
        if (existingIndex != -1) {
          otpJson.splice(existingIndex, 1);
          await this.redisService.setJsonData(
            otpCacheKey,
            JSON.stringify(otpJson),
          );
          return `OTP verified successfully`;
        } else {
          throw new ForbiddenException('Invalid OTP');
        }
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async authResetPassword(email: string, password: string, clientCode: string) {
    try {
      if (!email || !password || !clientCode) {
        throw new BadRequestException('Invalid input parameters');
      }
      const userResponseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:users`,
      );
      if (userResponseFromRedis) {
        const userList: any[] = JSON.parse(userResponseFromRedis);
        const userIndexAndUser = Object.entries(userList).find(
          ([index, user]) => user.email === email,
        );
        
        if (userIndexAndUser) {
          const [index, foundedUser] = userIndexAndUser;
        
          const isSamePassword =comparePasswords(password, foundedUser.password);
         
          if (isSamePassword) {          
            throw new BadRequestException ('Same Password Doest not allowed');
          }
          
          foundedUser.password = hashPassword(password)

          userList.splice(Number(index), 1, foundedUser);
          await this.redisService.setJsonData(
            `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:users`,
            JSON.stringify(userList),
          );
          return `Password reset successfully`;
        } else {
          throw new NotFoundException('User not found');
        }
      } else {
        throw new NotFoundException('No record found in the client');
      }
    } catch (error) {
      throw error;
    }
  }

  async postIdentityProvider(user: any, account: any) {
    try {
      if (user && account) {
        const existingUserToken = await this.individualSignin(
          user?.email,
          '',
          true,
        );
        if (existingUserToken) {
          return existingUserToken;
        } else {
          const registerClient = await this.clientRegister(
            '', //ClientName for individual not exist
            user?.name, //firstName for registration
            user?.name, //lastName for registration
            user?.email, //email for registration
            user?.name, //userName for registration
            '', //mobile for registration
            '', //password for registration
            false, //flag for mentioning as Individual
            true, //flag for mentioning as social login
          );

          const newUserToken = await this.individualSignin(
            user?.email,
            '',
            true,
          );
          if (newUserToken) {
            return newUserToken;
          } else {
            throw new NotFoundException('User name or email has conflicts');
          }
        }
      } else {
        throw new BadRequestException('Not enough data to continue');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  //=====TM=====
  async getschema(key): Promise<any> {
    try {  
      var arr = []; 
      var nodeId;  
        
      const dfjson = JSON.parse(await this.redisService.getJsonData(key + 'DFS'));     
      for (var i = 0; i < dfjson.length; i++) {
        if (dfjson[i].nodeType != 'startnode' && dfjson[i].nodeType != 'endnode') {
        var ndpjson = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + dfjson[i].nodeId))  
        if (ndpjson.nodeType == 'dbnode') {
          try{
            this.logger.log("DB Node execution started")
            var reqparams:any = ndpjson.data.operationName    
            var oprkey = Object.keys(ndpjson.data)
            if(oprkey.includes(reqparams))
              if(reqparams == 'select'){
                reqparams = ndpjson.data[reqparams]     
                reqparams=reqparams.selectColumns
              
              }   
              let obj = {};  
              obj['nodeId'] = ndpjson.nodeId; 
              obj['nodeName'] = ndpjson.nodeName;
              obj['nodeType'] = ndpjson.nodeType;         
              obj['schema'] = (reqparams)
              arr.push(obj);

              nodeId = dfjson[i].routeArray[0].nodeId;  
          
          }catch(error){
            throw new BadRequestException(error)
          } 
        }

        if (ndpjson.nodeType == 'apinode'|| ndpjson.nodeType == 'restAPInode') {
          try{  
            this.logger.log("API Node execution started")
            var reqparams:any = ndpjson.data.operationName
            let request = []
            var oprkey = Object.keys(ndpjson.data)
            if(oprkey.includes(reqparams)){ 
            
              if(reqparams == 'get'){  
                  var apiList = ndpjson.data[reqparams]
                  var apidata=apiList.api
                    var reqfield =apidata.queryParams
                    for (let i = 0; i < reqfield.length; i++) {
                      const { name, type } = reqfield[i];
                      request.push({ name, type });  
                    }
              }
              if(reqparams == 'post'){  
                var apiList = ndpjson.data[reqparams]
                var apidata=apiList.api
                var reqfield=apidata.body
                for (let i = 0; i < reqfield.length; i++) {
                  const { name, type } = reqfield[i];
                  request.push({ name, type });
                }
               
              }
              if(reqparams == 'getById'){  
                  var apiList = ndpjson.data[reqparams]
                  var apidata=apiList.api
                    var req=apidata.queryParams
                    for (let i = 0; i < reqfield.length; i++) {
                      const { name, type } = reqfield[i];
                      request.push({ name, type });
                    }     
              }
              if(reqparams == 'put'){ 
                  var apiList = ndpjson.data[reqparams]
                  var apidata=apiList.api
                    var req=apidata.body
              }
              if(reqparams == 'delete'){ 
                  var apiList = ndpjson.data[reqparams]
                  var apidata=apiList.api
                    var req=apidata.body
              }
            }
              let obj = {};  
              obj['nodeId'] = ndpjson.nodeId; 
              obj['nodeName'] = ndpjson.nodeName;
              obj['nodeType'] = ndpjson.nodeType; 
              if(Object.keys(request).length>0){
                obj['schema'] = Object.values(request)
              } 
              else{
                throw 'No schema found'
              }     
              
              arr.push(obj);
            
              nodeId = dfjson[i].routeArray[0].nodeId;  
          
          }catch(error){
            throw error
          } 
        }

        if (ndpjson.nodeType == 'streamnode') {
          try{
            this.logger.log("Stream Node execution started")
            let reqparams:any = ndpjson.data.operationName
            let oprkey = Object.keys(ndpjson.data)    
            if(oprkey.includes(reqparams))
              if(reqparams == 'write'){
                var oprname = ndpjson.data[reqparams] 
                var req = oprname.requestparams         
              }
              let obj = {};  
              obj['nodeId'] = ndpjson.nodeId; 
              obj['nodeName'] = ndpjson.nodeName;
              obj['nodeType'] = ndpjson.nodeType;          
              obj['schema'] = Object.keys(req)
              arr.push(obj);
              
          }catch(error){
            throw new BadRequestException(error)
          } 
        }
      }      
    } 

    
  }
  catch(error){
    throw new BadRequestException(error)
  }
    // return arr;
  
    
    return {status:'Success',statusCode:201,result:arr}
  }

  async prepareDFOSchema(key){
    this.logger.log("prepareDFOSchema Started....")     
    try{ 
     
        if(!await this.redisService.exist(key+'AFI')){         
          var tslerror = await this.teCommonService.getTSL(key,'','ArtifactInfo does not exist',400,'') 
          throw tslerror 
        }
        var mode = JSON.parse(await this.redisService.getJsonDataWithPath(key+'AFI','.executionMode'))
       
      if(!await this.redisService.exist(key+'DFS')){ 
        var tslerror = await this.teCommonService.getTSL(key,'','ProcessFlow does not exist',400,mode)
        throw tslerror       
        
       }else{
         if(!await this.redisService.exist(key+'NDP')){
          var tslerror = await this.teCommonService.getTSL(key,'','NodeProperty does not exist',400,mode)
          throw tslerror                      
         }
       }
        
        var nodeid;         
        let dfjson = JSON.parse(await this.redisService.getJsonData(key + 'DFS')); 
        
        var schemaarr = []
        if(dfjson.length>0){
          for (var i = 0; i < dfjson.length; i++) {
            // Start Node
            if (dfjson[i].nodeType == 'startnode') {
              nodeid = dfjson[i].routeArray[0].nodeId;  
            }
    
            // DBnode
            if (nodeid == dfjson[i].nodeId && dfjson[i].nodeType == 'dbnode' && dfjson[i].nodeType != 'startnode' && dfjson[i].nodeType != 'endnode') {
            
              try{
              this.logger.log("DB Node execution started")
                var dbres:any
                var qryres:any 
                var customConfig:any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + dfjson[i].nodeId))
                if(customConfig){
                  var connectors:any= customConfig.data?.connectorName 
                  var link = customConfig.data?.linkParam
                  if(!link){
                    var tslerror = await this.teCommonService.getTSL(key,'','Link Param not found',400,mode)
                    throw tslerror 
                  }
                  var dbconfig = JSON.parse(await this.redisService.getJsonData(connectors))
                  if(!dbconfig){                 
                    throw `Invalid DB connector ${connectors}`
                  }

                  if(dbconfig.basic){
                    if(!dbconfig.basic.host || !dbconfig.basic.port || !dbconfig.basic.userName || !dbconfig.basic.password || !dbconfig.basic.databaseName){
                      throw `Invalid DB credentials`
                    }
                    const { Client } = pg
                    var client = new Client({
                      host: dbconfig.basic.host,
                      port:  dbconfig.basic.port,
                      user:  dbconfig.basic.userName,
                      password:  dbconfig.basic.password,
                      database:  dbconfig.basic.databaseName,
                    }) ;  
                  }

                  var schemaname = customConfig.data.schemaName  
                  var tablename = customConfig.data.tableName           
                  if(!schemaname || !tablename){
                    throw `Schema Name/Table Name not found`
                  }
                  var oprkey = Object.keys(customConfig.data)
                  var qry = `SELECT column_name, data_type from information_schema.columns WHERE table_schema = '${schemaname}' AND table_name = '${tablename}'`
                                            
                  await client.connect()
                  dbres = await client.query(qry)
                  if(dbres)
                    qryres = dbres.rows

                  await client.end() 
                  let dbarr = [], dfobj = {}
                  if(qryres && qryres.length>0){
                    for(var j=0;j<qryres.length;j++){
                      var qryobj={}
                      qryobj['name']=qryres[j].column_name
                      qryobj['type']=qryres[j].data_type
                      dbarr.push(qryobj)
                    }
                  }else{
                    throw 'No Records Found'
                  }                       
                         
                  dfobj['nodeId'] = dfjson[i].nodeId
                  dfobj['nodeName'] = dfjson[i].nodeName
                  dfobj['nodeType'] = dfjson[i].nodeType
                  dfobj['schema'] = dbarr
                  schemaarr.push(dfobj)
                  await this.redisService.setJsonData(key + 'DFO', JSON.stringify(schemaarr))
                  this.logger.log("DB Node execution completed")
                  nodeid = dfjson[i].routeArray[0].nodeId;  
                } 
              }catch(error){
                var tslError = await this.teCommonService.getTSL(key,'',error,400,mode)
                return tslError
                // throw (error)
              } 
            
            }  
    
            // Api Node
    
            if (nodeid == dfjson[i].nodeId && dfjson[i].nodeType == 'apinode' && dfjson[i].nodeType != 'startnode' && dfjson[i].nodeType != 'endnode') {
              try{
                this.logger.log("Api Node execution started")                
                
                  var customConfig:any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + dfjson[i].nodeId))
                  if(customConfig){
                    var connectors= customConfig.data?.connectorName     
                    var link = customConfig.data?.linkParam
                    if(!link){
                      var tslerror = await this.teCommonService.getTSL(key,'','Link Param not found',400,mode)
                      throw tslerror 
                    }
                    //var apiconfig = JSON.parse(await this.redisService.getJsonData(connectors))
                    var oprname:any= customConfig.data.operationName  
                    var oprkey = Object.keys(customConfig.data)
                    if(oprname && oprkey.includes(oprname)){                   
                          if(oprname == 'get'){   
                            var api = customConfig.data[oprname].api
                            if (api && api.endpoint) {    
                              var postres = await this.commonService.getCall(api.endpoint)
                              if (postres && postres.result)
                                var apires: any = postres.result
                            }else {
                              throw 'Endpoint not found'
                            }
                            if (postres.status != 'Success' || apires.length == 0) {
                              throw 'Data not found'
                            }

                            if(postres.status && postres.status != 'Success'){                           
                              return postres.response.data
                            }
                            var value,columname
                            var apiarr =[]
                            if(Array.isArray(apires)){
                              if(apires.length>0){
                                columname = Object.keys(apires[0]) 
                                value = Object.values(apires[0])                                               
                                for (var k = 0; k < value.length; k++) {
                                  var obj ={}
                                  var datatype = typeof value[k]
                                  obj['name']=columname[k]
                                  obj['type']= datatype
                                  apiarr.push(obj)
                                }
                              }else{
                                var postres = await this.commonService.getCall(api.endpoint+'/schema')
                                if(Object.keys(apires).length > 0){
                                  columname = Object.keys(apires) 
                                  value = Object.values(apires)                                               
                                  for (var k = 0; k < value.length; k++) {
                                    var obj ={}                              
                                    obj['name']=columname[k]
                                    obj['type']= value[k]
                                    apiarr.push(obj)
                                  }
                                }else{
                                  throw 'value is empty'
                                }     
                              }                           
                            }                     
                            var dfobj = {}
                            dfobj['nodeId'] =  dfjson[i].nodeId
                            dfobj['nodeName'] = dfjson[i].nodeName
                            dfobj['nodeType'] = dfjson[i].nodeType
                            dfobj['schema']= apiarr
                            schemaarr.push(dfobj)
                            console.log("schemaarr",schemaarr);
                            
                            await this.redisService.setJsonData(key+'DFO',JSON.stringify(schemaarr))
                          
                            nodeid = dfjson[i].routeArray[0].nodeId; 
                            }   
                            this.logger.log("Api Node execution completed")
                    }else{
                      throw 'Operation name not found'
                    }
                  }
                  
              } catch (error) {
                var tslError = await this.teCommonService.getTSL(key,'',error,400,mode)
                return tslError
              }                
            }
    
            //streamnode
            if (nodeid == dfjson[i].nodeId && dfjson[i].nodeType == 'streamnode' && dfjson[i].nodeType != 'startnode' && dfjson[i].nodeType != 'endnode') {
              try{ 
                this.logger.log("Stream Node execution started")
                    let streamarr = []
                      var customConfig:any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + dfjson[i].nodeId)) 
                      if(customConfig){
                        var connectors:any= customConfig.data?.connectorName      
                        var link = customConfig.data?.linkParam
                        if(!link){
                          var tslerror = await this.teCommonService.getTSL(key,'','Link Param not found',400,mode)
                          throw tslerror 
                        }
                        var streamconfig = JSON.parse(await this.redisService.getJsonData(connectors))
                        if (!streamconfig) throw `Invalid stream connector ${connectors}`
                        if(streamconfig.basic){
                          if(!streamconfig.basic.host || !streamconfig.basic.port) {
                            throw 'Invalid stream credentials'
                          }
                          var redis = new Redis({
                            host: streamconfig.basic.host,
                            port: streamconfig.basic.port
                          })
                        }
                        var oprname:any= customConfig.data.operationName           
                        var oprkey = Object.keys(customConfig.data)
                              
                      if(oprname && oprkey.includes(oprname)){
                        if(oprname == "read"){
                          var streamName = customConfig.data[oprname].streamName 
                          var consumerGroup = customConfig.data[oprname].consumerGroup
                          var consumerName = customConfig.data[oprname].consumerName
                          if (!streamName || !consumerGroup || !consumerName) {
                            throw 'Stream RequestParams were empty'
                          }
                          var reqparams = customConfig.data[oprname].requestparams 
                          var field = customConfig.data[oprname].field  
                     
                          if (await redis.call('EXISTS', streamName)) {
                              var grpInfo: any = await redis.xinfo('GROUPS', streamName)
                              if (grpInfo.length == 0) {
                                await redis.xgroup('CREATE', streamName, consumerGroup, '0', 'MKSTREAM');
                              } else if (!grpInfo[0].includes(consumerGroup)) {
                                await redis.xgroup('CREATE', streamName, consumerGroup, '0', 'MKSTREAM');
                              }
    
                              var streamData = [];
    
                              let streamResult: any = await redis.xreadgroup('GROUP', consumerGroup, consumerName, 'STREAMS', streamName, '>');
                             
                              if (streamResult) {
                                streamResult.forEach(([key, message]) => {
                                  message.forEach(([messageId, data]) => {
                                    var obj = {};
                                    obj['msgid'] = messageId;
                                    obj['data'] = data;
                                    streamData.push(obj);
                                  });
                                });
                              }
                              else {
                                throw 'No New Data available to read';
                              }
    
                              if (streamData && streamData.length > 0) {
                                var streamres = []
                                for (var s = 0; s < streamData.length; s++) {
                                  var msgid = streamData[s].msgid;
                                  var data = streamData[s].data
                                  var report = JSON.parse(data[1])
                                  await this.redisService.ackMessage(streamName, consumerGroup, msgid);
                                }
                              }
                          }
                          let columname = Object.keys(report)
                          let value = Object.values(report)
                          if(value.length > 0){
                            for (let q = 0; q < value.length; q++) {
                              var obj ={}
                              var datatype = typeof value[q]
                              obj['name']=columname[q]
                              obj['type']= datatype
                              streamarr.push(obj)
                            }
                          }                         
                          await this.redisService.setJsonData(key+'NDP', JSON.stringify(streamarr),dfjson[i].nodeId+'.data.'+oprname+'.response')
                    
                        }
                        var dfobj = {}
                        dfobj['nodeId'] =  dfjson[i].nodeId
                        dfobj['nodeName'] = dfjson[i].nodeName
                        dfobj['nodeType'] = dfjson[i].nodeType
                        dfobj['schema']= streamarr
                        schemaarr.push(dfobj)
                        await this.redisService.setJsonData(key+'DFO',JSON.stringify(schemaarr))
                    
                      } else {
                        throw 'Operation name not found'
                      }
                      
                      nodeid = dfjson[i].routeArray[0].nodeId; 
                      this.logger.log("Stream Node execution completed") 
                      }
                    
              }catch(error){
                var tslError = await this.teCommonService.getTSL(key,'',error,400,mode)
                return tslError
              }
            }

            // filenode
            if (nodeid == dfjson[i].nodeId &&  dfjson[i].nodeType == 'filenode' && dfjson[i].nodeType != 'startnode' && dfjson[i].nodeType != 'endnode') {
              try{ 
                  this.logger.log("File Node execution started") 
                  var customConfig:any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + dfjson[i].nodeId))   
                  if(customConfig){
                    var connectors:any= customConfig.data?.connectorName 
                    var link = customConfig.data?.linkParam
                    if(!link){
                      var tslerror = await this.teCommonService.getTSL(key,'','Link Param not found',400,mode)
                      throw tslerror 
                    }
                    var fileconfig = JSON.parse(await this.redisService.getJsonData(connectors))
                    if (!fileconfig) {
                      throw `Invalid File connector ${connectors}`                      
                    }
                    if(fileconfig.basic){
                      if(!fileconfig.basic.host || !fileconfig.basic.port || !fileconfig.basic.accessKey || !fileconfig.basic.secretKey){  
                        throw `Invalid File credentials`                        
                      }
                      var minioConfig = {
                        endPoint: fileconfig.basic.host,
                        port: Number(fileconfig.basic.port),
                        useSSL: fileconfig.basic.useSSL,
                        accessKey: fileconfig.basic.accessKey,
                        secretKey: fileconfig.basic.secretKey,
                      };
                    }
                
                    var oprname:any= customConfig.data.operationName 
                    var oprkey = Object.keys(customConfig.data)
                    let filearr=[]
                    if(oprname && oprkey.includes(oprname)){
                      var reqparams = customConfig.data[oprname].request
                      var fileupload:any;
                      if(oprname == 'read'){                  
                        var fileBuffer = await this.getfileNode(minioConfig,reqparams.fileName,reqparams.bucket,reqparams.folder)
                    
                        let file = fileBuffer.toString();
                        if(file)
                           var filedata = JSON.parse(file) 

                        let filecolumn = Object.keys(filedata[0]) 
                        let filevalue = Object.values(filedata[0])    
                        if(filevalue.length > 0){
                          for (let b = 0; b < filevalue.length; b++) {
                            let obj ={}
                            var filedatatype = typeof filevalue[b]
                            obj['name']=filecolumn[b]
                            obj['type']= filedatatype
                            filearr.push(obj)
                          }
                        }                       
                      
                        var dfobj = {}
                        dfobj['nodeId'] =  dfjson[i].nodeId
                        dfobj['nodeName'] = dfjson[i].nodeName
                        dfobj['nodeType'] = dfjson[i].nodeType
                        dfobj['schema']= filearr
                        schemaarr.push(dfobj)
                        await this.redisService.setJsonData(key+'DFO',JSON.stringify(schemaarr))
                      }
                    }
                  nodeid = dfjson[i].routeArray[0].nodeId;                
                  this.logger.log("File Node execution completed") 
                  }
              }catch(error){
                var tslError = await this.teCommonService.getTSL(key,'',error,400,mode)
                return tslError
              }
            }
            // End node
            if (dfjson[i].nodeType == 'endnode') { 
              break;
            }
          } 
        } 
        this.logger.log('prepareDFOSchema completed!'); 
        return {status:'Success',statusCode:201}      
        
    }catch(error){     
      if(error.message)
        throw new BadRequestException(error.message)
      else
        throw new BadRequestException(error)
    }
  }

  async getfileNode(minioConfig:any,fileName: string,bucketFolderame?: string,folderPath?: string,): Promise<Buffer> {
    try {
      
      const minioClient = new Minio.Client(minioConfig);
     
      const bucketName = bucketFolderame ? bucketFolderame : 'torus9x';
      const bucketExists = await minioClient.bucketExists(bucketName);
    
      if (!bucketExists) {
        throw new CustomException(
          'Bucket does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      const fullFileName = folderPath ? `${folderPath}/${fileName}` : fileName;
     
      const fileStream = await minioClient.getObject(bucketName, fullFileName);
     
      const chunks: any[] = [];
      for await (const chunk of fileStream) {
      
        chunks.push(chunk);
      }
      const fileBuffer = Buffer.concat(chunks);
  
      return fileBuffer;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error; 
      }
      throw new CustomException(
        'An error occurred while downloading the file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async prepareHLRSchema(key,nodeId){
    try {
      var ufid
      var type
      let schema = []
      let response ={}
      var ufJson = JSON.parse(await this.redisService.getJsonData(key+'UFS'))
      if(!ufJson){
        throw ('UFS is not found in UF key')
      }
     if(ufJson.length>0){
      var componentFlg = 0
      for (var i = 0; i < ufJson.length; i++) { 
      if(ufJson[i].id == nodeId){
        ufid = ufJson[i].id
        type = ufJson[i].type
      }else{
        componentFlg++        
      }
    }
    if(componentFlg == ufJson.length){
      throw 'component name mismatched'
    }
    for (var j = 0; j < ufJson.length; j++) {
      if(ufJson[j].T_parentId == ufid && ufJson[j].type != 'button'){
        let obj = {}
         obj['name'] = ufJson[j].label
         obj['type'] = ufJson[j].type
         obj['id'] = ufJson[j].id
         schema.push(obj)
      }
    }
    response['nodeId']=ufid
    response['nodeName'] = nodeId
    response['nodeType'] = type
    response['schema']= schema
    await this.redisService.setJsonData(key+'UFO',JSON.stringify(response))
    return response
   }else{
    throw ('UFS is empty')
   }  
  
   } 
    catch (error) {
      return {status:400,error:error} 
    }
  }

  // async Saveas(SOURCE,TARGET,sourceKey:any, destinationKey: any){
  //   var Skey = 'CK:' + sourceKey[0] + ':FNGK:' + sourceKey[1] + ':FNK:' + sourceKey[2] + ':CATK:' +sourceKey[3]+':AFGK:' + sourceKey[4] +':AFK:' +sourceKey[5] +':AFVK:' + sourceKey[6];
  //   var Dkey ='CK:' +destinationKey[0] + ':FNGK:' +destinationKey[1] +':FNK:' + destinationKey[2] +':CATK:' + destinationKey[3] +':AFGK:' + destinationKey[4] + ':AFK:' + destinationKey[5] +':AFVK:' + destinationKey[6];
  //   var Sourcekey
  //   var Desinationkey
    
  //   if(SOURCE == "redis"){
  //    Sourcekey = await redis.keys(Skey + ':*');
  //    Desinationkey = await redis.keys(Dkey + ':*');
  // }
  // if(SOURCE == "mongo"){
  //   Sourcekey = this.convert8keysinto16keys(sourceKey,false)
  //   Desinationkey = this.convert8keysinto16keys(destinationKey,false)
  // }
  //   if (SOURCE == "redis" && Desinationkey.length > 0) {
  //     throw new BadRequestException('Destination Key already exists');
  //   } else {
  //     let result
  //     if(TARGET == "redis"){
  //     if (Sourcekey.length > 0) {
  //      // var resFlg = 0;
  //       for (var i = 0; i < Sourcekey.length; i++) {
         
  //            result = await redis.call(
  //             'COPY',
  //             Sourcekey[i],
  //             `${Dkey}${Sourcekey[i].replace(Skey, '')}`,
  //           );
  //         }
  //       }
  //       else {
  //         throw new BadRequestException('Source Key does not exists to copy');
  //       }
  //     }else if(TARGET == "mongo"){
  //       var res = await this.mongoService.CloneDocument(Sourcekey)
  //       var value = res[0]
  //      var Value= value['AFSK'];
  //      Desinationkey['AFSK']=Value
  //       result = await axios.post('http://localhost:3002/api/writekey',
  //         {
  //               SOURCE: SOURCE,
  //               TARGET: TARGET,
  //               ...Desinationkey,
  //             }
  //       )
  //       var msg = result.data.message
  //     }
  //         if (result == 1 || msg == 'Value Inserted') {
  //           return { message: `Key copied from ${Skey} to ${Dkey}` };
  //         }
        
  //   }
  
  // }

  convert8keysinto16keys(arrKey: string[], isArray = true): keys16 {
    let returnKeys = isArray
      ? {
          CK: '',
          FNGK: '',
          FNK: '',
          CATK: [],
          AFGK: [],
          AFK: [],
          AFVK: [],
          AFSK: '',
        }
      : {
          CK: '',
          FNGK: '',
          FNK: '',
          CATK: '',
          AFGK: '',
          AFK: '',
          AFVK: '',
          AFSK: '',
        };
    for (let i = 0; i < arrKey.length; i++) {
      let key = Object.keys(returnKeys)[i];
      if (Array.isArray(returnKeys[key])) {
        returnKeys[key] = [arrKey[i]];
      } else {
        returnKeys[key] = arrKey[i];
      }
    }
    return returnKeys;
  }

  async getEmployee(){
    try{
      let result = JSON.parse(await this.redisService.getJsonData('EmployeeDetails'))
      return result
    }catch(err){
      throw new BadRequestException(err)
    }
    
  }
  async getHandlers(type: string, artifact: string, version: string) {
    try {
      let handleKey = JSON.parse(
        await this.redisService.getJsonData(
          `CK:TRL:FNGK:AFR:FNK:UF-UFD:CATK:Handlers:AFGK:${type}:AFK:${artifact}:AFVK:${version}:HLR`,
        ),
      );
      if (!handleKey) {
        return {};
      }
      console.log('handleKey', handleKey);
      return handleKey;
    } catch (error) {
      console.error('Error in getHandlers:', error);
    }
  }

  async validateJson(SOURCE:string,schemakey: any, data: any) {
    
      let dataarr = []
      let userSchema
      let isValid
      try {
      for(let i = 0; i < schemakey.length; i++){
        if(SOURCE == 'redis'){
          userSchema =JSON.parse(await this.redisService.getJsonData(schemakey[i]));
        }
        else{
          var finalkey =  getKeyArrayStructure(schemakey[i])
          //console.log(finalkey);
          userSchema = await this.mongoService.getKeys(finalkey)
        }
        var validate = this.ajv.compile(userSchema); 
        isValid = validate(data[i]);
       if(validate.errors)
        dataarr.push(validate.errors[0])
      }
      
      if (dataarr.length == 0) {
        return 'Validation successfully';
      }else
      return dataarr
      
    } catch (error) {  
    throw error
    }
  
  }

// TM  //

async Saveas(SOURCE,TARGET,sourceKey,destinationKey,loginId){
  this.logger.log("Save as started...")
  try{
    var Skey = 'CK:' + sourceKey[0] + ':FNGK:' + sourceKey[1] + ':FNK:' + sourceKey[2] + ':CATK:' +sourceKey[3]+':AFGK:' + sourceKey[4] +':AFK:' +sourceKey[5] +':AFVK:' + sourceKey[6];
    var Dkey ='CK:' +destinationKey[0] + ':FNGK:' +destinationKey[1] +':FNK:' + destinationKey[2] +':CATK:' + destinationKey[3] +':AFGK:' + destinationKey[4] + ':AFK:' + destinationKey[5] +':AFVK:v1' ;
  
    var olduojson = JSON.parse(await this.redisService.getJsonData(Skey+':UO'))
    if(olduojson == null){
     throw Skey+' key not found in redis'
    }
    await this.saveAsUFKey(Skey,loginId,Dkey,destinationKey)

    //UO source

    var dfdkey = []
    var source = olduojson.source 
    if(source.length>0){
      for(var a=0;a<source.length;a++){ 
        dfdkey.push(source[a].dfdKey)  
      }
    }
       
    await this.saveasdfdkey(dfdkey,loginId,destinationKey,Dkey)
    
    
    
    // Pf
    var artifactTargetArr = [],NodeTargetArr =[],ObjTargetArr = []

    
    //pf Artifact level events
    var pfartifactJson = olduojson?.mappedData?.artifact?.events
    if(pfartifactJson && Object.keys(pfartifactJson).length > 0){     
      if(pfartifactJson?.eventSummary && Object.keys(pfartifactJson?.eventSummary).length > 0){  
        await this.getTargetKey(pfartifactJson.eventSummary?.children,artifactTargetArr) 
      }  
    }

    //pf node level events
    var pfNodeJson = olduojson?.mappedData?.artifact?.node
    if(pfNodeJson && pfNodeJson.length > 0){
      for(let n = 0; n<pfNodeJson.length; n++){
        var nodeEvents = pfNodeJson[n]?.events
        if(nodeEvents && Object.keys(nodeEvents).length > 0){
          if(nodeEvents?.eventSummary && Object.keys(nodeEvents?.eventSummary).length > 0){  
            await this.getTargetKey(nodeEvents.eventSummary?.children,NodeTargetArr) 
          }
        }
      }
    }

    // var pfjson = JSON.parse(await this.redisService.getJsonDataWithPath(Skey+':UO','.mappedData.artifact.node'))
    var pfjson = olduojson?.mappedData?.artifact?.node
    if(pfjson && pfjson.length>0){
      for(var c=0;c<pfjson.length;c++){
        let pfObjectElements = pfjson[c].objElements              
        for(let k=0;k<pfObjectElements.length;k++){
          let pfobjEvents = pfObjectElements[k].events
          if(pfobjEvents != null && Object.keys(pfobjEvents).length > 0){
            var ObjeventSummary = pfobjEvents.eventSummary           
           if(ObjeventSummary != null && Object.keys(ObjeventSummary).length > 0){  
            await this.getTargetKey(ObjeventSummary.children,ObjTargetArr) 
           }           
          }           
        }        
      }
    }
    var eventArr   
    if(artifactTargetArr.length > 0)
      eventArr = artifactTargetArr
    else if(NodeTargetArr.length > 0)
      eventArr = NodeTargetArr
    else if(ObjTargetArr.length > 0)
      eventArr = ObjTargetArr

    await this.saveaspfdkey(eventArr,loginId,destinationKey,Dkey,sourceKey[5])
    
    return `${Dkey} Saved Successfully`
  }catch(err){   
    throw new BadRequestException(err)
  }
}

async changeArtifact(sourcekey: string, destinationKey:any) {  
  

  var skey = await this.getRecentKeyStructure(sourcekey)
  var scatk = skey.CATK
  var safgk = skey.AFGK
  var safk = skey.AFK
  var safvk = skey.AFVK
  var dcatk = destinationKey[3]
  var dafgk = destinationKey[4]
  var dafk = destinationKey[5]
  var dafvk = 'v1'
  var result = sourcekey.replaceAll(`CATK:${scatk}`,`CATK:${dcatk}`).replaceAll(`AFGK:${safgk}`, `AFGK:${dafgk}`).replaceAll(`AFK:${safk}`, `AFK:${dafk}`).replaceAll(`AFVK:${safvk}`, `AFVK:${dafvk}`)
  return result
}

async saveasdfdkey(dfdkeyarr,loginId,destinationKey,Dkey){  
 try {
  if(dfdkeyarr.length>0){
    for(var d=0;d<dfdkeyarr.length;d++){
      // var source = dfdkeyarr[d].split(':')[11]
    
       var dfnewArtifact = await this.changeArtifact(dfdkeyarr[d],destinationKey)
       var newdfdst = dfnewArtifact.replace('DF-DFD','DF-DST')
      await this.commonsaveaskey(dfdkeyarr[d],dfnewArtifact,'DFO','DFS',loginId)
    
     //DO
      var dfdDo =  JSON.parse(await this.redisService.getJsonData(dfdkeyarr[d]+':DO'))
     if(!dfdDo){
       throw ` ${dfdkeyarr[d]} key DO not found in redis`
     }
      // selectedsource
      if(dfdDo.selectedSource){
        dfdDo.selectedSource.artifact = destinationKey[5]
        dfdDo.selectedSource.path = dfdDo.selectedSource.path?await this.changeArtifact(dfdDo.selectedSource.path,destinationKey):dfdDo.selectedSource.path
      }
      // nodes
      var nodes = dfdDo.nodes
      if(nodes.length>0){
        for(var e=0;e<nodes.length;e++){
          nodes[e].id = nodes[e].id?await this.changeArtifact(nodes[e].id,destinationKey):nodes[e].id
          if(nodes[e].type == "customTargetItems"){
            if(nodes[e].data.length>0){
              for(var k=0;k<nodes[e].data.length;k++){
                nodes[e].data[k].artifact = nodes[e].data[k].artifact?await this.changeArtifact(nodes[e].data[k].artifact,destinationKey):nodes[e].data[k].artifact
                nodes[e].data[k].path =  nodes[e].data[k].path?await this.changeArtifact(nodes[e].data[k].path,destinationKey): nodes[e].data[k].path
              }
            }
          }
      
        }
      }
      //target
      if(dfdDo.target){
        var dfdstkey = dfdDo.target.key
        var fngk = dfdstkey.split('FNGK')[1]
        var fngkey = fngk.split(':')[1]
        var getobjectkey = dfdstkey.replace(fngkey,fngkey+'P')
        var dstafpkey = newdfdst.replace(fngkey,fngkey+'P')
        if(dfdstkey)
        var dstvalue = JSON.parse(await this.redisService.getJsonData(dfdstkey+':DO'))
      if(getobjectkey)
        var dsobject = JSON.parse(await this.redisService.getJsonData(getobjectkey+':DS_Object'))
      
        dfdDo.target.key = dfdDo.target.key?await this.changeArtifact(dfdDo.target.key,destinationKey):dfdDo.target.key
        dfdDo.target.targetName = destinationKey[5]
      }
      if(dstvalue)
      await this.redisService.setJsonData(newdfdst+':DO',JSON.stringify(dstvalue))
    if(dsobject)
      await this.redisService.setJsonData(dstafpkey+':DS_Object',JSON.stringify(dsobject))

      // selectedTarget
      if(dfdDo.selectedTarget){
        dfdDo.selectedTarget.artifact = destinationKey[5]
        dfdDo.selectedTarget.path = dfdDo.selectedTarget.path?await this.changeArtifact(dfdDo.selectedTarget.path,destinationKey):dfdDo.selectedTarget.path
      }
      // mappedData
      dfdDo.mappedData.artifact.name = destinationKey[5]
      var mapnode = dfdDo.mappedData.artifact.node
      if(mapnode.length>0){
        for(var f=0;f<mapnode.length;f++){
          if(mapnode[f].DataSet.length>0){
            for(var g=0;g<mapnode[f].DataSet.length;g++){
              mapnode[f].DataSet[g].artifact = mapnode[f].DataSet[g].artifact?await this.changeArtifact(mapnode[f].DataSet[g].artifact,destinationKey):mapnode[f].DataSet[g].artifact
              mapnode[f].DataSet[g].path =  mapnode[f].DataSet[g].path?await this.changeArtifact(mapnode[f].DataSet[g].path,destinationKey): mapnode[f].DataSet[g].path
            }
          }
          
        }
      }
          
      // securityData
      if(dfdDo.securityData){
        dfdDo.securityData.afk =  dfdDo.securityData.afk?await this.changeArtifact(dfdDo.securityData.afk,destinationKey): dfdDo.securityData.afk
        var accessprofile = dfdDo.securityData.accessProfile
        if(accessprofile.length>0){
          for(var h=0;h<accessprofile.length;h++){
            accessprofile[h].security.artifact.resource = destinationKey[5]
          }
        }
        dfdDo.securityData.securityTemplate.security.artifact.resource = destinationKey[5]
      }
         
      //targetItems
    var targetItems = dfdDo.targetItems
    if(targetItems.length>0){
      for(var i=0;i<targetItems.length;i++){
        targetItems[i].artifact =   targetItems[i].artifact?await this.changeArtifact(targetItems[i].artifact,destinationKey): targetItems[i].artifact
        targetItems[i].path =  targetItems[i].path?await this.changeArtifact(targetItems[i].path,destinationKey):targetItems[i].path
      }
    }
    //edges
    var edges = dfdDo.edges
    if(edges.length>0){
      for(var j=0;j<edges.length;j++){
        edges[j].source = edges[j].source?await this.changeArtifact(edges[j].source,destinationKey):edges[j].source
        edges[j].target =  edges[j].target?await this.changeArtifact(edges[j].target,destinationKey):edges[j].target
        edges[j].sourceHandle = edges[j].sourceHandle?await this.changeArtifact(edges[j].sourceHandle,destinationKey):edges[j].sourceHandle
        edges[j].targetHandle = edges[j].targetHandle?await this.changeArtifact(edges[j].targetHandle,destinationKey):edges[j].targetHandle
        edges[j].id = edges[j].id?await this.changeArtifact(edges[j].id,destinationKey):edges[j].id 
      
        //edges[j].id = edges[j].id.replaceAll(`AFK:${source}`,`AFK:${artifact}`)
      }
    }
      await this.redisService.setJsonData(dfnewArtifact+':DO',JSON.stringify(dfdDo))
    
    }
  }
  
 } catch (error) {
  throw error
 }
}

async saveaspfdkey(pfdkeyarr,loginId,destinationKey,Dkey,sourceKey){
  try{
    if(pfdkeyarr.length>0){
      for(var k=0;k<pfdkeyarr.length;k++){
        var pfkey= pfdkeyarr[k].split(':').slice(0, -1).join(':');
        // var pfartifact = pfdkeyarr[k].split(':')[11]
        var pfnewArtifact = await this.changeArtifact(pfkey,destinationKey)
        await this.commonsaveaskey(pfkey,pfnewArtifact,'PFO','PFS',loginId)
    
     //PO
      var pfdPo =  JSON.parse(await this.redisService.getJsonData(pfkey+':PO'))
      if(!pfdPo){
        throw ` ${pfkey} key PO not found in redis`
      }
      //mappedData
      if(pfdPo.mappedData)
      pfdPo.mappedData.artifact.name = destinationKey[5]
    
      //securityData
      if(pfdPo.securityData){
        pfdPo.securityData.afk = pfdPo.securityData.afk?await this.changeArtifact(pfdPo.securityData.afk,destinationKey):pfdPo.securityData.afk
      var accessprofile = pfdPo.securityData.accessProfile
      if(accessprofile.length>0){
        for(var l=0;l<accessprofile.length;l++){
          accessprofile[l].security.artifact.resource = destinationKey[5]
        }
      }
      pfdPo.securityData.securityTemplate.security.artifact.resource = destinationKey[5]
      }
      
    
      //target
      if(pfdPo.target){
        pfdPo.target.key =  pfdPo.target.key?await this.changeArtifact(pfdPo.target.key,destinationKey): pfdPo.target.key
        pfdPo.target.targetName = destinationKey[5]
      }
     
      //selectedSource
     var selectedSource = pfdPo.selectedSource
     if(selectedSource.length>0){
      for(var m=0;m<selectedSource.length;m++){
        selectedSource[m].artifact= destinationKey[5]
        selectedSource[m].path =  selectedSource[m].path?await this.changeArtifact(selectedSource[m].path,destinationKey): selectedSource[m].path
     }
     }
       
     //selectedTarget
     if(pfdPo.selectedTarget){
      pfdPo.selectedTarget.artifact = destinationKey[5]
      pfdPo.selectedTarget.path =  pfdPo.selectedTarget.path?await this.changeArtifact(pfdPo.selectedTarget.path,destinationKey): pfdPo.selectedTarget.path
     }
   
     //nodes
     var nodes = pfdPo.nodes
     if(nodes.length>0){
      for(var n=0;n<nodes.length;n++){
        nodes[n].id =  nodes[n].id?await this.changeArtifact(nodes[n].id,destinationKey): nodes[n].id
        if(nodes[n].type == "customSourceItems"){
          nodes[n].data.path = nodes[n].data.path?await this.changeArtifact(nodes[n].data.path,destinationKey):nodes[n].data.path
          var sourceufKey:any =  Object.keys(nodes[n].data.dfo)
          if(sourceufKey.length>0){
            for(var z=0;z<sourceufKey.length;z++){
              if(sourceufKey[z].includes(sourceKey)){
                var skeys = sourceufKey[z]
              }
            }
          }
        
         var res = nodes[n].data.dfo[skeys]
         if(res.length>0){
          for(var p=0;p<res.length;p++){
            res[p].selectedDropdownName = await this.changeArtifact( res[p].selectedDropdownName,destinationKey)
            if(res[p].ifo){
              var ifo = res[p].ifo
              if(ifo.length>0){
                for(var q=0;q<ifo.length;q++){
                  ifo[q].nodeId = ifo[q].nodeId?await this.changeArtifact(ifo[q].nodeId,destinationKey):ifo[q].nodeId
                 }
              }
            }
          }
         }
          
            let renamekey = await this.changeArtifact(skeys,destinationKey)
          pfdPo.nodes[n].data.dfo[renamekey] = pfdPo.nodes[n].data.dfo[skeys] 
           delete pfdPo.nodes[n].data.dfo[skeys]  
        }
        }
     }
    
      //edges
      var edges = pfdPo.edges
      if(edges.length>0){
        for(var r=0;r<edges.length;r++){
          edges[r].source =  edges[r].source?await this.changeArtifact(edges[r].source,destinationKey):edges[r].source
          edges[r].sourceHandle = edges[r].sourceHandle?await this.changeArtifact(edges[r].sourceHandle,destinationKey):edges[r].sourceHandle
          edges[r].target =  edges[r].target?await this.changeArtifact(edges[r].target,destinationKey):edges[r].target
          edges[r].targetHandle = edges[r].targetHandle?await this.changeArtifact(edges[r].targetHandle,destinationKey):edges[r].targetHandle
          edges[r].id = edges[r].id?await this.changeArtifact(edges[r].id,destinationKey):edges[r].id
          //edges[r].id = await this.changeArtifact(Skey,destinationKey)
          
        }
      }
      
      //source
      var source = pfdPo.source
      if(source.length>0){
        for(var s=0;s<source.length;s++){
          if(pfdPo.source[s].dfdKey.indexOf(sourceKey) != -1){
             pfdPo.source[s].dfdKey = pfdPo.source[s].dfdKey?await this.changeArtifact(pfdPo.source[0].dfdKey,destinationKey):pfdPo.source[s].dfdKey
             pfdPo.source[s].dfoName = destinationKey[5]
           }
         }
      }     
      await this.redisService.setJsonData(pfnewArtifact+':PO',JSON.stringify(pfdPo))
      }
    }
  
  }catch(err){
  throw err
  }
}

async saveAsUFKey(Skey,loginId,Dkey,destinationKey){
  try{
  //   var ufkey = key.split(':')[11]

  // var ufnewArtifact = key.replace(`${ufkey}`, `${artifact}`)
  await this.commonsaveaskey(Skey,Dkey,'UFO','UFS',loginId)

  //NDU
  var ufnde = JSON.parse(await this.redisService.getJsonData(Skey+':NDU'))
  await this.redisService.setJsonData(Dkey+':NDU',JSON.stringify(ufnde))
  //UO
  
  var uojson = JSON.parse(await this.redisService.getJsonData(Skey+':UO'))

  // security data
  if(uojson.securityData)
  uojson.securityData.afk = uojson.securityData.afk?await this.changeArtifact(uojson.securityData.afk,destinationKey):uojson.securityData.afk
  var accessprofile = uojson.securityData.accessProfile
  if(accessprofile.length>0){
    for(var h=0;h<accessprofile.length;h++){
      accessprofile[h].security.artifact.resource = destinationKey[5]
      accessprofile[h].security.artifact.resourceID = destinationKey[5]
    }
  }
  uojson.securityData.securityTemplate.security.artifact.resource = destinationKey[5]
  uojson.securityData.securityTemplate.security.artifact.resourceID = destinationKey[5]


  //NEW UO edges
  var edges = uojson.edges
  if(edges.length>0){
    for(var b=0;b<edges.length;b++){
      uojson.edges[b].source = uojson.edges[b].source?await this.changeArtifact(edges[b].source,destinationKey):uojson.edges[b].source
      uojson.edges[b].sourceHandle = uojson.edges[b].sourceHandle?await this.changeArtifact(edges[b].sourceHandle,destinationKey):uojson.edges[b].sourceHandle
      uojson.edges[b].target = uojson.edges[b].target?await this.changeArtifact(edges[b].target,destinationKey):uojson.edges[b].target
      uojson.edges[b].targetHandle = uojson.edges[b].targetHandle?await this.changeArtifact(edges[b].targetHandle,destinationKey):uojson.edges[b].targetHandle
      uojson.edges[b].id = uojson.edges[b].id?await this.changeArtifact (edges[b].id,destinationKey):uojson.edges[b].id
    }
  }

  //UO source
  var source = uojson.source 
  if(source.length>0){
    for(var a=0;a<source.length;a++){   
      source[a].dfdKey =  source[a].dfdKey?await this.changeArtifact(source[a].dfdKey,destinationKey): source[a].dfdKey
      source[a].dfoName = destinationKey[5]
    }
  }
    // mappedData
  uojson.mappedData.artifact.name = destinationKey[5]

  //Target artifact level events
  var pfArtifactjson = uojson.mappedData?.artifact?.events
  if(pfArtifactjson && Object.keys(pfArtifactjson).length > 0){
    if(pfArtifactjson?.eventSummary && Object.keys(pfArtifactjson?.eventSummary).length > 0){
      await this.changePFKeyartifact(pfArtifactjson?.eventSummary.children,destinationKey) 
    }
  }

 //Target Node level events
 var pfNodejson = uojson.mappedData?.artifact?.node
 if(pfNodejson && pfNodejson.length > 0){
   for(var n=0; n<pfNodejson.length; n++){
    var nodeEvents = pfNodejson[n].events
    if(nodeEvents && Object.keys(nodeEvents).length > 0){
      if(nodeEvents?.eventSummary && Object.keys(nodeEvents?.eventSummary).length > 0){
        await this.changePFKeyartifact(nodeEvents?.eventSummary.children,destinationKey) 
      }
    }
   }
 }
  
  //Target Object level events
  var pfjson = uojson.mappedData.artifact.node
  if(pfjson.length>0){
    for(var c=0;c<pfjson.length;c++){
      let pfObjectElements = pfjson[c].objElements
      if(pfObjectElements.length>0){
        for(let k=0;k<pfObjectElements.length;k++){
          let pfobjEvents = pfObjectElements[k].events
          if(pfobjEvents != null && Object.keys(pfobjEvents).length > 0){
            var ObjeventSummary = pfobjEvents.eventSummary           
          if(ObjeventSummary != null && Object.keys(ObjeventSummary).length > 0){  
            await this.changePFKeyartifact(ObjeventSummary.children,destinationKey) 
          }           
          }           
        }
      }       
    } 
  }
  //target
  if(uojson.target){
    uojson.target.key = uojson.target.key?await this.changeArtifact(uojson.target.key,destinationKey):uojson.target.key
    uojson.target.targetName = destinationKey[5]
    }
  
  // selectedsource
  var selsrce = uojson.selectedSource
  if(selsrce.length>0){
    for(var n=0;n<selsrce.length;n++){
      selsrce[n].artifact = destinationKey[5]
      selsrce[n].path = selsrce[n].path?await this.changeArtifact(selsrce[n].path,destinationKey):selsrce[n].path
    }
  }
  

  // selectedTarget
  if( uojson.selectedTarget){
    uojson.selectedTarget.artifact = destinationKey[5]
    uojson.selectedTarget.path = uojson.selectedTarget.path?await this.changeArtifact(uojson.selectedTarget.path,destinationKey):uojson.selectedTarget.path
  
  }

  //nodes
  var ufnode = uojson.nodes
  if(ufnode.length>0){
    for(var m=0;m<ufnode.length;m++){
      ufnode[m].id = await this.changeArtifact(ufnode[m].id,destinationKey)
      if(ufnode[m].type == "customSourceItems"){
        var dfokey:any = Object.keys(ufnode[m].data.dfo)
      
        var dfovalue:any = (Object.values(ufnode[m].data.dfo))  
        if(dfokey.length>0){
          for(var p=0;p<dfokey.length;p++){
            const newkey =await this.changeArtifact(dfokey[p],destinationKey)
            ufnode[m].data.dfo[newkey]= dfovalue[p]
          }
        }
        delete ufnode[m].data.dfo[dfokey]
        var newval:any = (Object.values(ufnode[m].data.dfo)).flat()
        if(newval.length>0){
          for(var q=0;q<newval.length;q++){
            newval[q].nodeId = newval[q].nodeId?await this.changeArtifact(newval[q].nodeId,destinationKey):newval[q].nodeId
          }
        }
          ufnode[m].data.path =  ufnode[m].data.path?await this.changeArtifact(ufnode[m].data.path,destinationKey): ufnode[m].data.path
      }
      
    }
  }
  
  
  await this.redisService.setJsonData(Dkey+':UO',JSON.stringify(uojson))
  }catch(err){
    throw err
  }
}

  async commonsaveaskey(Skey,newkey,dataset,flowarr,loginId){
    try{
      if(!await this.redisService.exist(Skey+':'+flowarr)){
        throw Skey+ ' is not found in redis'
      }
      //AFI
      var afi = JSON.parse(await this.redisService.getJsonData(Skey+':AFI'))  
      afi['createdBy'] = loginId
      afi['createdOn'] = format(new Date(),'yyyy-MM-ddT0HH:mm:ss.SSS');
      afi['updatedBy'] = ''
      afi['updatedOn'] = ''
      await this.redisService.setJsonData(newkey+':AFI',JSON.stringify(afi))
      // Dataset

      if(dataset != 'PFO'){
        var cfo = JSON.parse(await this.redisService.getJsonData(Skey+':'+dataset))
        await this.redisService.setJsonData(newkey+':'+dataset,JSON.stringify(cfo))
      }
      
      //summary
      var cfs = JSON.parse(await this.redisService.getJsonData(Skey+':'+flowarr))
      await this.redisService.setJsonData(newkey+':'+flowarr,JSON.stringify(cfs))
      // NDS
      var nds = JSON.parse(await this.redisService.getJsonData(Skey+':NDS'))
      await this.redisService.setJsonData(newkey+':NDS',JSON.stringify(nds))
    // NDE
    var nde = JSON.parse(await this.redisService.getJsonData(Skey+':NDE'))
    await this.redisService.setJsonData(newkey+':NDE',JSON.stringify(nde))
    //NDP
    var ndp = JSON.parse(await this.redisService.getJsonData(Skey+':NDP'))
    await this.redisService.setJsonData(newkey+':NDP',JSON.stringify(ndp))
    }catch(err){
      throw err
    }
  }

  async changePFKeyartifact(data,destinationKey) {  
  try {
    if (data.length > 0) {
      for(var a= 0; a < data.length; a++) {
        if(data[a].targetKey){ 
          for(let i=0;i<data[a].targetKey.length;i++){
            data[a].targetKey[i] = await this.changeArtifact(data[a].targetKey[i],destinationKey)
          }                 
        }        
        if(data[a].children?.length > 0) {         
          this.changePFKeyartifact(data[a].children,destinationKey);
        }
      }  
    }  
  } catch (error) {
    throw error
  }    
  }

  async savenewversion(key){
    var sourcekey = 'CK:' + key[0] + ':FNGK:' + key[1] + ':FNK:' + key[2] + ':CATK:' +key[3]+':AFGK:' + key[4] +':AFK:' +key[5] +':AFVK:' + key[6];
    var oldVersion = key[6]
    var version = key[6].split('v')[1]
     var incversion = parseInt(version)+1;
    var destinationkey = 'CK:' + key[0] + ':FNGK:' + key[1] + ':FNK:' + key[2] + ':CATK:' +key[3]+':AFGK:' + key[4] +':AFK:' +key[5] +':AFVK:v' + incversion;
    var newVersion = destinationkey.split(':')[13]
    //console.log("newVersion",newVersion);
    
    await this.pushArtifactCopy(sourcekey,destinationkey)
    if(key[2] == 'DF-DFD'){
      var dojson = JSON.parse(await this.redisService.getJsonData(destinationkey+':DO'))
      //console.log("dojson",dojson);
    //mappedData
       var node = dojson.mappedData.artifact.node
       for(var a=0;a<node.length;a++){
        var DataSet = node[a].DataSet 
        for(var b=0;b<DataSet.length;b++){
          DataSet[b].artifact = await this.changeVersion(DataSet[b].artifact,oldVersion,newVersion)
          DataSet[b].path = await this.changeVersion(DataSet[b].path,oldVersion,newVersion)
        }
       }
    //securityData
       dojson.securityData.afk = await this.changeVersion(dojson.securityData.afk,oldVersion,newVersion)
    //selectedSource
       dojson.selectedSource.version = newVersion
       dojson.selectedSource.path = await this.changeVersion(dojson.selectedSource.path,oldVersion,newVersion)
    //nodes
       var nodes = dojson.nodes
       for(var c=0;c<nodes.length;c++){
        nodes[c].id = await this.changeVersion(nodes[c].id,oldVersion,newVersion)
        if(nodes[c].type == "customTargetItems"){
          var data = nodes[c].data
          for(var d=0;d<data.length;d++){
           data[d].artifact = await this.changeVersion(data[d].artifact,oldVersion,newVersion)
           data[d].path = await this.changeVersion(data[d].path,oldVersion,newVersion)
          }
        }
       }
    //target
       dojson.target.key = await this.changeVersion(dojson.target.key,oldVersion,newVersion)

    //targetItems
       var targetItems = dojson.targetItems
       for(var e=0;e<targetItems.length;e++){
        targetItems[e].artifact = await this.changeVersion(targetItems[e].artifact,oldVersion,newVersion)
        targetItems[e].path = await this.changeVersion(targetItems[e].path,oldVersion,newVersion)
       }

    //selectedTarget
       dojson.selectedTarget.version = newVersion
       dojson.selectedTarget.path = await this.changeVersion(dojson.selectedTarget.path,oldVersion,newVersion)

    //edges
       var edges = dojson.edges
       for(var f=0;f<edges.length;f++){
        edges[f].id =  edges[f].id.replaceAll(oldVersion,newVersion)
        edges[f].source = await this.changeVersion(edges[f].source,oldVersion,newVersion)
        edges[f].target = await this.changeVersion(edges[f].target,oldVersion,newVersion)
        edges[f].sourceHandle = await this.changeVersion(edges[f].sourceHandle,oldVersion,newVersion)
        edges[f].targetHandle = await this.changeVersion(edges[f].targetHandle,oldVersion,newVersion)
       }
        await this.redisService.setJsonData(destinationkey+':DO',JSON.stringify(dojson))
    }
    if(key[2] == 'PF-PFD'){
      var pojson = JSON.parse(await this.redisService.getJsonData(destinationkey+':PO'))
      //securityData
      pojson.securityData.afk = await this.changeVersion(pojson.securityData.afk,oldVersion,newVersion)
      //target
      pojson.target.key = await this.changeVersion(pojson.target.key,oldVersion,newVersion)
      //selectedTarget
      pojson.selectedTarget.version = newVersion
      pojson.selectedTarget.path = await this.changeVersion(pojson.selectedTarget.path,oldVersion,newVersion)
      //nodes
      var nodes = pojson.nodes
      for(var c=0;c<nodes.length;c++){
        nodes[c].id = await this.changeVersion(nodes[c].id,oldVersion,newVersion)
      }
      //edges
     var edges = pojson.edges
      for(var f=0;f<edges.length;f++){
        edges[f].target = await this.changeVersion(edges[f].target,oldVersion,newVersion)
        edges[f].targetHandle = await this.changeVersion(edges[f].targetHandle,oldVersion,newVersion)
        if( edges[f].id.indexOf(sourcekey) != -1){
          edges[f].id = edges[f].id.replaceAll(oldVersion,newVersion)
          }
      }
      await this.redisService.setJsonData(destinationkey+':PO',JSON.stringify(pojson))
     
    }
    if(key[2] == 'UF-UFD'){
      var uojson = JSON.parse(await this.redisService.getJsonData(destinationkey+':UO'))
      //securityData
      uojson.securityData.afk = await this.changeVersion(uojson.securityData.afk,oldVersion,newVersion)
      //target
      uojson.target.key = await this.changeVersion(uojson.target.key,oldVersion,newVersion)
      //selectedTarget
      uojson.selectedTarget.version = newVersion
      uojson.selectedTarget.path = await this.changeVersion(uojson.selectedTarget.path,oldVersion,newVersion)

      //nodes
      var nodes = uojson.nodes
      for(var z=0;z<nodes.length;z++){
        if( nodes[z].id.indexOf(sourcekey) != -1){
          nodes[z].id = await this.changeVersion(nodes[z].id,oldVersion,newVersion)
        }
      }
      //edges
      var edges = uojson.edges
      for(var f=0;f<edges.length;f++){
        edges[f].target = await this.changeVersion(edges[f].target,oldVersion,newVersion)
        edges[f].targetHandle = await this.changeVersion(edges[f].targetHandle,oldVersion,newVersion)
        if( edges[f].id.indexOf(sourcekey) != -1){
        edges[f].id =  edges[f].id.replaceAll(oldVersion,newVersion)
        }
      }
      await this.redisService.setJsonData(destinationkey+':UO',JSON.stringify(uojson))
    }
    }
    
  async changeVersion(key,oldeversion,newversion){
      // const parts = key.split(':'); 
      // const index = parts.findIndex(part => part === 'AFVK');
     
      // if (index !== -1) {
      //   console.log('parets',parts[index+1] );
        
      //   parts[index+1] = version; 
      // }
      // return parts.join(':');
      if(key.includes(':AFVK:'+oldeversion)){
        return key.replace(oldeversion,newversion)
      }
     
    }

// TE
async createEjs(key) {
  try{
  var arr = []
  if(await this.redisService.exist(key+'PO'))
  var pojson = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'PO', '.mappedData.artifact.node'));
  else
    throw key+'PO does not exist'
  for (var i = 0; i < pojson.length; i++) {
    if (pojson[i].nodeType != 'startnode')
      if (pojson[i].events.sourceStatus)
        arr.push(pojson[i].events.sourceStatus)
  }

  let app_name: any = path.join('src', 'TS');

  await this.createFolder(app_name);   
  await this.CreateSchemaFile('./src/appTemplate/service.ejs', 'TS', '', 'src/TS/ts.service.ts', 'PoEvent')
  await this.CreateSchemaFile('./src/appTemplate/controller.ejs', 'TS', arr, 'src/TS/ts.controller.ts', 'PoEvent')
  await this.CreateSchemaFile('./src/appTemplate/module.ejs', 'TS', '', 'src/TS/ts.module.ts')
  this.logger.log('TS folder created')
  return 'Success'
}catch(err){
 return {status:400,error:err}
}
}


async CreateSchemaFile(template, data, relation, path, event?) {
  try {

    let objtemplate: any = await this.ReadFile(template);
    //console.log(objtemplate);
    let fn = ejs.compile(objtemplate);
    let str = fn({
      data: data,
      relation: relation,
      event: event
    });
    // let str = fn(data);
    if (str != '') {
      // console.log(str);       
      fs.writeFileSync(path, str)
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async ReadFile(strReadPath: any) {
  try {
    return await fs.readFileSync(strReadPath, 'utf8');
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async createFolder(foldername: string) {
  // let strroot_path: string = path.join('src', foldername)
  fs.mkdirSync(foldername, { recursive: true });
  return await ('success')
}

async createFile(template, data, path) {
  try {

    let objtemplate: any = await this.ReadFile(template);
    //console.log(objtemplate);
    let fn = ejs.compile(objtemplate);
    let str = fn(data)
    if (str != '') {
      // console.log(str);       
      fs.writeFileSync(path, str)
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async splitcommonkey(key, spliter){ 
  const parts = key.split(':'); 
  const index = parts.findIndex(part => part === spliter);
 
  if (index !== -1) {
    console.log(parts[index+1])
    return parts[index+1]; 
  }
  
}

async getcustomcodeSchema(key,nodeId){
  try {
    var pojson = JSON.parse(await this.redisService.getJsonData(key + 'PO'));  
    if(pojson){    
    var ifoarr = []
    var ifoflg = 0
    var node = pojson.mappedData.artifact.node
    for(var j=0;j<node.length;j++){
      if(node[j].nodeId != nodeId){
        ifoflg++
      }else{
        break;
      }
    }   
    
    if(node && node.length > 0){
      for(var i=0;i<=ifoflg;i++){
       // if(node[i].nodeName == nodeName){
          if(node[i].ifo){
            var schema = node[i].ifo        
            if(schema && schema.length > 0){          
              for(var j=0;j<schema.length;j++){
                if(!ifoarr.includes(schema[j].name.toLowerCase()))                      
                ifoarr.push(schema[j].name.toLowerCase())
              }
            }
          }
      //  }
       
      }
    }
    if(ifoarr.length == 0)
      throw 'No fields in IFO'
 
    return {status:201,result:ifoarr}
    }else{
      throw 'key does not exist'
    }
  } catch (error) {
   // throw new BadRequestException(error)
   return {status:400,error:error}
  }  
}

async getDFcustomcodeSchema(key,nodeId){
  try {
    var pojson = JSON.parse(await this.redisService.getJsonData(key + 'DO'));  
    if(pojson){    
    var ifoarr = []
    var node = pojson.mappedData.artifact.node
    for(var j=0;j<node.length;j++){
      if(node[j].ifo){
        if(node[j].nodeId == nodeId){
        var schema = node[j].ifo        
        if(schema && schema.length > 0){          
          for(var k=0;k<schema.length;k++){
            if(!ifoarr.includes(schema[k].name.toLowerCase()))                      
            ifoarr.push(schema[k].name.toLowerCase())
          }
        }
      }
    }
    }  
   
    if(ifoarr.length == 0)
      throw 'No fields in IFO'
 
    return {status:201,result:ifoarr}
    }else{
      throw 'key does not exist'
    }
  } catch (error) {
   // throw new BadRequestException(error)
   return {status:400,error:error}
  }  
}


}
