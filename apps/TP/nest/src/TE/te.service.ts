import { BadRequestException, Inject, Injectable, Logger} from '@nestjs/common';
import { RedisService } from 'src/redisService';
import * as pg from "pg";
//import * as ftp from 'ftp'
import Redis from 'ioredis';
import { CronJob } from 'cron';
import { PoEvent } from './Dto/poevent';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { SecurityService } from 'src/securityService';
import { pfDto } from './Dto/pfdto';
import { AxiosRequestConfig } from 'axios';
import { CommonService } from 'src/commonService';
import { TeCommonService } from './teCommonService';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ApiService } from 'src/apiService';
const  Xid = require('xid-js');

/*
  # This is process flow execution service. 
  # Each and Every node is executed in the "getProcess method".
  # The key is combination of tenantName, appGroupName, appName, artifacts and resource.
  # Each and Every node validates a config, workflow and set a placeholders in the "pfpreprocessor method".
  # OverAll nodes are could be processed in the  "pfprocessor method".
  # In the "pfpostprocessor method" are used for garbage clean.
  # In the  api node to read a pre config to set npc and ipc in the "nodepreprocessor method".
  # In the  api node to read a pro config to set npc and ipc in the "nodeprocessor method".
  # In the  api node to read a post config to set npc and ipc in the "nodepostprocessor method".
  # To check the permission for the role in the "getSecurityJson method".
*/

@Injectable()
export class TeService {  
 
  constructor(@Inject('PO') private readonly poClient: ClientProxy,
  private schedulerRegistry: SchedulerRegistry,
  private readonly redisService: RedisService, 
  private readonly commonService: CommonService, 
  private readonly teCommonService: TeCommonService,
  private readonly securityService: SecurityService,
  private readonly apiService:ApiService) {}
  private readonly logger = new Logger(TeService.name); 

   
  async EventEmitter(pfdto: pfDto,node?){
    try {
      this.logger.log("PoEvent Emmiter Started....")    
      if(node == null || node == undefined){
        var node = await this.securityService.getSecurityTemplate(pfdto.key+'PO')
      }     
      var event; 
      let pid;  
      var invalidEventFlg = 0 
      var flg = 0

      var fngkKey = pfdto.key.split('FNGK')[1].split(':')[1]
      if (pfdto.key.includes(fngkKey)) {
        var processedKey = pfdto.key.replace(fngkKey, fngkKey + 'P')
      }
      var pfjson = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'PFS'));
      var poArtifact = JSON.parse(await this.redisService.getJsonDataWithPath(pfdto.key + 'PO', '.mappedData.artifact'));
      var poNode = poArtifact.node      
      var Ndp = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'NDP'));
      var afi = JSON.parse(await this.redisService.getJsonData(pfdto.key + 'AFI'))
      if (afi != null && afi.executionMode)
        var mode = afi.executionMode
      else      
        mode = 'E'  

       //Rule,code,event in Artifact level
       var RCMresult:any = await this.teCommonService.getRuleCodeMapper(poArtifact,pfdto.data)
       // console.log('SEARC',RCMresult);
       let zenresult = RCMresult.rule
       let customcoderesult = RCMresult.code
       
      // nodeid validation
      for (var e = 0; e < poNode.length; e++) {        
        if(pfdto.nodeId){
          if(pfdto.nodeId == poNode[e].nodeId){
            if(pfdto.event != poNode[e].events.sourceStatus){
              throw 'Event and nodeId mismatched'
            }else{             
             // break
            }
          }else{
            flg++
          }        
        }
        if(poNode[e].nodeType != 'startnode' && poNode[e].nodeType != 'endnode'){          
          if(!poNode[e].events.sourceStatus){
            throw 'Event source status does not exist in '+poNode[e].nodeName
          }
        }
      }
      if(flg == poNode.length){
        throw 'Invalid nodeId'
      }

      if(pfdto.upId)
        pid = pfdto.upId      
   
      this.logger.log(pfdto.upId)     
      
      for (var i = 0; i < poNode.length; i++) {
        if (!pfdto.nodeId) {
          pfdto.nodeId = poNode[i].nodeId
        }
        // if (!pfdto.nodeName) {
        //   pfdto.nodeName = poNode[i].nodeName
        // }
        if (!pfdto.nodeType) {
          pfdto.nodeType = poNode[i].nodeType
        }
        let srcQueue;
        if (poNode[i].nodeType == 'startnode' && pid == undefined) {
          this.logger.log('Start node')       
            if (poNode[1].events.sourceStatus) {
              if (pfdto.event == poNode[1].events.sourceStatus) {
                if (!pfdto.upId) 
                  pfdto.upId = Xid.next()
                await this.pfPreProcessor(processedKey,pfjson,pfdto.upId)
                 srcQueue = poNode[1].events.sourceQueue 
                if(!srcQueue) 
                  srcQueue = 'TEH'          
                await this.redisService.setStreamData(srcQueue, 'TASK - ' + pfdto.upId, JSON.stringify({ "PID": pfdto.upId, "TID": pfdto.nodeId, "EVENT": pfdto.event }))
                await this.teCommonService.getTPL(processedKey, pfdto.upId,mode,poNode[i], 'Success', pfdto.token,'PF')
              }             
            }          
        }

        else if (poNode[i].nodeType == 'humantasknode' && poNode[i].nodeId == pfdto.nodeId )  {
          this.logger.log('Human Task node started')
          if(pfdto.upId){
          //Node level security check
          var nodedetails = await this.securityService.getNodeSecurityTemplate(node, poNode[i].nodeName)
          if(nodedetails?.status == '200') {             
            if (pfdto.event == null && event == poNode[i].events.sourceStatus) {
              return { upId: pfdto.upId, message: `Awaiting for: ${poNode[i].nodeName}`,event:event }
            } 
            if (pfdto.event == poNode[i].events.sourceStatus) {
              if (pfdto.data) {
                if (Object.keys(pfdto.data).length == 0) {
                  throw 'Data should not be Empty'
                } else {                  
                  //Setting PIDlogs for accessing Data
                   var npvdata = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey + pfdto.upId + ':NPV:'+poNode[i].nodeName+'.PRO','.request')) 
                   console.log("npvdata",npvdata);
                   if(npvdata && Object.keys(npvdata).length>0){
                      pfdto.data = { ...npvdata, ...pfdto.data }
                      await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:'+poNode[i].nodeName+'.PRO', JSON.stringify(pfdto.data),'request')
                      console.log( pfdto.data); 
                    }else{
                      await this.redisService.setJsonData(processedKey + pfdto.upId + ':NPV:'+poNode[i].nodeName+'.PRO', JSON.stringify(pfdto.data),'request')
                    }                 

                  //Setting Up Node response          
                  var nodeObjArr = []
                  nodeObjArr.push({
                    nodeName: poNode[i].nodeName,
                    nodeId: pfdto.nodeId,
                    nodeType: pfdto.nodeType,
                    sourceStatus: pfdto.event,
                    timeStamp: new Date().toString(),
                    currentStatus: "Failed"
                  })

                  if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse')) {
                    await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr[0]))
                  }
                  else {
                    await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr))
                  }

                  // Event Emmiting logic
                  var eventResponse = await firstValueFrom(this.poClient.send(
                    pfdto.event,
                    new PoEvent(pfdto.key, pfdto.upId, pfdto.event, pfdto.data, pfdto.token, pfdto.nodeId, poNode[i].nodeName, pfdto.nodeType),
                  ))
                 
                  if(eventResponse == undefined){throw 'Event Response is undefined'}
 
                  if (!eventResponse.status && eventResponse.status != 200) {                                                
                    throw eventResponse
                  }
                  console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);

                  //Change current status to success  
                  var getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse'))              
                  for (var s = 0; s < getNodeResponse.length; s++) {
                    if (getNodeResponse[s].nodeId == pfdto.nodeId) {
                      await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', '"Success"', '[' + s + '].currentStatus')
                    }
                  }
                  //breakPoint logic
                  if (mode == 'D' && Ndp[poNode[i].nodeId].breakPoint == 'Y') {
                    return { key: pfdto.key, processedKey: processedKey + pfdto.upId, upId: pfdto.upId, tId: pfdto.nodeId, nodeName: poNode[i].nodeName, targetStatus: eventResponse.targetStatus }
                  }

                  nodeObjArr = null
                  pfdto.data = null
                  pfdto.event = null
                  pfdto.nodeId = null
                  //pfdto.nodeName = null
                  pfdto.nodeType = null
                  event = eventResponse.targetStatus
                }
              }
            }else{  
              pfdto.nodeId = null
              //pfdto.nodeName = null
              pfdto.nodeType = null            
              invalidEventFlg++
            }

          } else {
            throw nodedetails
          }
        }else{
          throw 'Process Id not found'
        }
        }

        else {         
          this.logger.log('Decision/Api node started')
          //Node level security check
          if(pfdto.upId){
          if(poNode[i].nodeId == pfdto.nodeId){
          var nodedetails = await this.securityService.getNodeSecurityTemplate(node, poNode[i].nodeName)
          if (nodedetails?.status == '200') {
            //End node returning logic
            if (poNode[i].nodeType == 'endnode') {              
              var getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse'))                     
               if(getNodeResponse != null){  
                let flg=0            
                  for(var pfs = 0; pfs < pfjson.length; pfs++){                
                    if(getNodeResponse[getNodeResponse.length-1].nodeId == pfjson[pfs].nodeId){
                      var routeArray = pfjson[pfs].routeArray                 
                      for(var r=0 ; r < routeArray.length; r++){
                        if(routeArray[r].nodeName == 'End'){
                          await this.redisService.setStreamData(srcQueue, 'TASK - ' + pfdto.upId, JSON.stringify({ "PID": pfdto.upId, "TID": pfdto.nodeId, "EVENT": 'ProcessCompleted' }))
                          await this.teCommonService.getTPL(processedKey, pfdto.upId, mode, poNode[i], 'Success', pfdto.token,'PF')
                           return { upId: pfdto.upId, message: 'Success',event: 'ProcessCompleted' } 
                        } else{
                          flg++                          
                        }                   
                      }if(flg == routeArray.length) {
                          throw 'Event Mismatched'
                      }                              
                    }
                  }  
              }else
              throw 'Invalid Request'                                  
            }
           
            if(poNode[i].nodeType != 'endnode'){
               srcQueue = poNode[i].events.sourceQueue
               if(!srcQueue)
                srcQueue = 'TEH'
            }    

            // Reading event source queue
            if (await this.redisService.exist(srcQueue)) {
              var grpInfo = await this.redisService.getInfoGrp(srcQueue)
              if (grpInfo.length == 0) {
                await this.redisService.createConsumerGroup(srcQueue, 'TaskGroup')
              } else if (!grpInfo[0].includes('TaskGroup')) {
                await this.redisService.createConsumerGroup(srcQueue, 'TaskGroup')
              }
             
              let streamData: any = await this.redisService.readConsumerGroup(srcQueue, 'TaskGroup', pfdto.event || event);
              if (streamData != 'No Data available to read') {
                for (var s = 0; s < streamData.length; s++) {
                  var msgid = streamData[s].msgid;
                  var data = streamData[s].data
                  if(event == JSON.parse(data[1]).EVENT){
                    event = JSON.parse(data[1]).EVENT
                    await this.redisService.ackMessage(srcQueue, 'TaskGroup', msgid);
                  }                  
                }
              }
            }
                      
            if(!event){                      
              event = pfdto.event 
            }
          
            if (event == poNode[i].events.sourceStatus) {
              if(!pfdto.data){               
                pfdto.data = JSON.parse(await this.redisService.getJsonDataWithPath(processedKey+pfdto.upId+':NPV:'+poNode[i].nodeName+'.PRO','.request'))
              }
              //Setting Up Node response    
              var nodeObjArr = []
              nodeObjArr.push({
                nodeName: poNode[i].nodeName,
                nodeId: pfdto.nodeId,
                nodeType: pfdto.nodeType,
                sourceStatus: event,
                timeStamp: new Date().toString(),
                currentStatus: "Failed"
              })

              if (await this.redisService.exist(processedKey + pfdto.upId + ':nodeResponse')) {
                await this.redisService.AppendJsonArr(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr[0]))
              }
              else {
                await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', JSON.stringify(nodeObjArr))
              }
              
              // Event Emmiting logic
              var eventResponse = await firstValueFrom(this.poClient.send(
                event,
                new PoEvent(pfdto.key, pfdto.upId, event, pfdto.data, pfdto.token, pfdto.nodeId, poNode[i].nodeName, pfdto.nodeType),
              ))
              
              if (eventResponse == undefined) { throw 'Event Response is undefined' }

              if (!eventResponse.status && eventResponse.status != 200) {
                throw eventResponse
              }
              console.log(`${eventResponse.targetStatus} Event emitted successfully by ${poNode[i].nodeName}`);

              //Change current status to success   
              var getNodeResponse = JSON.parse(await this.redisService.getJsonData(processedKey + pfdto.upId + ':nodeResponse'))                         
              for (var s = 0; s < getNodeResponse.length; s++) {
                if (getNodeResponse[s].nodeId == pfdto.nodeId) {
                  await this.redisService.setJsonData(processedKey + pfdto.upId + ':nodeResponse', '"Success"', '[' + s + '].currentStatus')
                }
              }

              //breakPoint logic
              if (mode == 'D' && Ndp[poNode[i].nodeId].breakPoint == 'Y') {
                return { key: pfdto.key, processedKey: processedKey + pfdto.upId, upId: pfdto.upId, tId: pfdto.nodeId, nodeName: poNode[i].nodeName, targetStatus: eventResponse.targetStatus }
              }
              nodeObjArr = null
              pfdto.data = null
              pfdto.event = null
              pfdto.nodeId = null
              //pfdto.nodeName = null
              pfdto.nodeType = null
              event = eventResponse.targetStatus
            }else{
              pfdto.nodeId = null
              //pfdto.nodeName = null
              pfdto.nodeType = null              
              invalidEventFlg++
            }
          } else {
            throw nodedetails
          }

        }
      } else{
        throw 'Process Id not found'
      }      
      }  
      }
      
      if(invalidEventFlg == poNode.length-2){
        throw `${event} doesn't matched`
      }     

    } catch (error) {           
      console.log('PO ERROR:', error);  
      if(pfdto.upId){
        var secError = await this.teCommonService.getTPL(processedKey, pfdto.upId,mode,poNode[i], 'Failed', pfdto.token,'PF', '',pfdto.data,error) 
        throw new BadRequestException(secError)
      }else{
        var tslerror = await this.teCommonService.getTSL(pfdto.key,pfdto.token,error,'')
        throw new BadRequestException (tslerror)
      }    
    }
  }

  async TSValidate(key,token){
   
      this.logger.log("TS validate")
      var valarr: any = []  
      if(!await this.redisService.exist(key+'AFI')){
        var mode = JSON.parse(await this.redisService.getJsonDataWithPath(key+'AFI','.executionMode'))
        await this.teCommonService.getTSL(key,token,'ArtifactInfo does not exist',400,mode) 
        valarr.push({'error':'ArtifactInfo does not exist'})
      } else{
        if(!await this.redisService.exist(key+'PFS')){ 
          await this.teCommonService.getTSL(key,token,'ProcessFlow does not exist',400,mode)         
          valarr.push({'error':'ProcessFlow does not exist'})
         } else{
          if(!await this.redisService.exist(key+'NDP')){
            await this.teCommonService.getTSL(key,token,'NodeProperty does not exist',400,mode) 
            valarr.push({'error':'NodeProperty does not exist'})            
          }
         }
      }   
     
      if (valarr.length == 0) {
        var arrobj = {}
        arrobj['validateresult'] = 'validation completed'         
        return arrobj  
      }
      return valarr    
  }
  
  async pfPreProcessor(processedKey,pfjson, upId) {
    this.logger.log('Pf PreProcessor started!');
    try {        
      var placeholder = { "request": {}, "response": {}, "exception": {} }
      for(var i=0;i<pfjson.length;i++){          
        if (pfjson[i].nodeType != 'startnode' && pfjson[i].nodeType != 'endnode') {
          //set npc, ipc placeholders
          await this.redisService.setJsonData(processedKey + upId + ':NPV:' + pfjson[i].nodeName + '.PRE', JSON.stringify(placeholder))
          await this.redisService.setJsonData(processedKey + upId + ':NPV:' + pfjson[i].nodeName + '.PRO', JSON.stringify(placeholder))
          await this.redisService.setJsonData(processedKey + upId + ':NPV:' + pfjson[i].nodeName + '.PST', JSON.stringify(placeholder))
        }  
      } 
      this.logger.log("pf Preprocessor completed")
      return 'Success'
    } catch (error) {
      throw error
    }
  }

  //--------------------DF---------------------------------  

  async securityAccess(key,token){
    try{      
        var upid = Xid.next() 
        var process = await this.getProcess(key,token,upid) 
        return process        
    }catch(err){    
      throw new BadRequestException (err)
    }
  }

  async getProcess(key,token,upid?) {
    this.logger.log("Data Fabric Started....") 
    try{      
     
      var nodedet = await this.securityService.getSecurityTemplate(key+'DO')  
            
      var nodeid,sparekey;  
          
      var mode = JSON.parse(await this.redisService.getJsonDataWithPath(key+'AFI','.executionMode'))
      const dfjson: any = JSON.parse(await this.redisService.getJsonData(key + 'DFS')); 
      
      if(dfjson && dfjson.length>0){         
        var placeholder = {"request":{},"response":{},"exception":{}}  
        var fngkey = key.split('FNGK')[1].split(':')[1]
        if (key.includes(fngkey)) {
          sparekey = key.replace(fngkey, fngkey + 'P')
        }
        var dstkey = sparekey.replace('DF-DFD','DF-DST')
        var doJson:any = JSON.parse(await this.redisService.getJsonData(key + 'DO')) 
        if(await this.redisService.exist(key + 'DFO')){
          var dfo:any = JSON.parse(await this.redisService.getJsonData(key + 'DFO')) 
          if(dfo.length == 0){
            var tslerror = await this.teCommonService.getTSL(key,token,'DFO was empty',400,mode)
            throw tslerror
          }
        }        
        else{         
          var tslerror = await this.teCommonService.getTSL(key,token,'DFO not found',400,mode)
          throw tslerror 
        }
        var doNode = doJson.mappedData.artifact.node
        if(!doNode || doNode.length == 0){
          throw 'NodeDetails was empty in DO'
        }
        var targetItems = doJson.targetItems
        if(!targetItems || targetItems.length == 0){
          throw 'TargetItems was empty in DO'
        }
        var mergearr = [],singleNode = []      
        
        for (var i = 0; i < dfjson.length; i++) {
          if (dfjson[i].nodeType != 'startnode' && dfjson[i].nodeType != 'endnode') {
            singleNode.push(dfjson[i])
            if(upid)
              await this.redisService.setJsonData(sparekey + upid + ':DS:' + dfjson[i].nodeName, JSON.stringify(placeholder))
          }

          // Start Node
          if (dfjson[i].nodeType == 'startnode') {
            //  logging nodename in stream 
            if(upid){              
              await this.teCommonService.getTPL(sparekey, upid, 'E', dfjson[i], 'Success', token, 'DF')
            }
            nodeid = dfjson[i].routeArray[0].nodeId;
          }

          // DBnode
          if (nodeid == dfjson[i].nodeId && dfjson[i].nodeType == 'dbnode' && dfjson[i].nodeType != 'startnode' && dfjson[i].nodeType != 'endnode') {
            try {
              this.logger.log("DB Node execution started")
              if (nodedet) {
                let nodeJson = await this.securityService.getNodeSecurityTemplate(nodedet, dfjson[i].nodeName)
                if (nodeJson && nodeJson.status && nodeJson.status == '200') {                 
                  let dfoSchema: any
                  let dfoColumn: any = []
                  for (let item of dfo) {
                    if (item.nodeId == dfjson[i].nodeId) {
                      if (item.schema){
                        dfoSchema = item.schema
                        if(dfoSchema && dfoSchema.length>0){
                          for(let d=0;d<dfoSchema.length;d++){
                            dfoColumn.push(dfoSchema[d].name)
                          }
                        }
                      }
                    }
                  }                 
                 
                  var dbres: any, qryres: any              
                  var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + dfjson[i].nodeId))

                  if (customConfig) {
                    var connectors: any = customConfig.data?.connectorName
                    var link = customConfig.data?.linkParam
                    if(!link){
                      throw 'linkParam not found'
                    }
                    let objlevelChk = await this.securityService.getObjectSecurityTemplate(nodeJson.data,dfoColumn)
                    if(objlevelChk?.status == 201 && objlevelChk?.data){                     
                      if(objlevelChk?.data.includes(link)){
                        throw 'Required field were blocked please change the security flag'
                      }
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
                        port: dbconfig.basic.port,
                        user: dbconfig.basic.userName,
                        password: dbconfig.basic.password,
                        database: dbconfig.basic.databaseName,
                      });
                    }
                  
                    var oprname: any = customConfig.data.operationName
                    var schemaname = customConfig.data.schemaName
                    var tablename = customConfig.data.tableName
                    if(!schemaname || !tablename){
                      throw `Schema Name/Table Name not found`
                    }
                    var oprkey = Object.keys(customConfig.data)

                    if (oprname && oprkey.includes(oprname)) {                 
                      //"select"
                      if (oprname == 'select') {
                        var selcol = customConfig.data[oprname].selectColumns
                        var filcol = customConfig.data[oprname].filterColumns
                        var filval = customConfig.data[oprname].filterValues
                        if (customConfig.data.manualQuery) {
                          var qry = customConfig.data.manualQuery
                        } else {
                          if (filcol && filcol.length > 0 && filval && filval.length > 0) {
                            if (selcol && selcol.length == 0)
                              qry = 'select * from "' + schemaname + '".' + tablename + ' where ' + filcol + ' = ' + filval
                            else
                              qry = 'select ' + selcol + ' from "' + schemaname + '".' + tablename + ' where ' + filcol + ' = ' + filval
                          }
                          else {
                            if (selcol && selcol.length == 0)
                              qry = 'select * from "' + schemaname + '".' + tablename
                            else {
                              qry = 'select ' + selcol + ' from "' + schemaname + '".' + tablename
                            }
                          }

                          if (qry)
                            await this.redisService.setJsonData(key + 'NDP', JSON.stringify(qry), dfjson[i].nodeId + '.data.autoQuery')
                        }
                        await client.connect()
                        qryres = await client.query(qry)
                        if (qryres)
                          dbres = qryres.rows

                        var RCMresult: any = await this.teCommonService.getRuleCodeMapper(dfjson[i], dbres)
                        if (RCMresult) {
                          let zenresult = RCMresult.rule
                          let customcoderesult = RCMresult.code
                        }
                        let dataSet = await this.getIfoAndDataSet(doNode, dfjson[i].nodeId)
                        let dsarr
                        if (dataSet) {
                          dsarr = dataSet.dsarr                                                   
                          if(dsarr?.length>0 && objlevelChk?.data?.length>0){                         
                          dsarr = dsarr.filter(item => !objlevelChk?.data.includes(item)); 
                          }
                        }
                       
                        if (dbres && dbres.length > 0) {
                          var dbfilteredData = dbres.map(item => {
                            return dsarr.reduce((acc, key) => {
                              acc[key] = item[key];
                              return acc;
                            }, {});
                          });
                                               
                          mergearr.push(dbfilteredData)
                        } else {
                          throw 'No Records Found'
                        }
                        await client.end()
                      }
                      else {
                        throw 'Invalid Operation Name'
                      }
                      if (qryres)
                        await this.redisService.setJsonData(key + 'NDP', JSON.stringify(qryres), dfjson[i].nodeId + '.data.' + oprname + '.response')

                      nodeid = dfjson[i].routeArray[0].nodeId;
                    
                      if (upid) {
                        await this.teCommonService.getTPL(sparekey, upid, 'E', dfjson[i], "Success", token, 'DF', '', qry, dfoSchema)
                      }
                      this.logger.log("DB Node execution completed")
                        
                    } else {
                      throw 'Operation name not found'
                    }
                  }
                }else {                     
                  throw nodeJson
                }
              }
            } catch (error) {             
              if(upid){   
                if(error.message){
                  error = error.message
                }          
                var dberror = await this.teCommonService.getTPL(sparekey, upid, 'E', dfjson[i], 'Failed', token,'DF','', qry, error)
                throw dberror
              }else{
                throw error
              }
            }
          }

          // Api Node
          if (nodeid == dfjson[i].nodeId && dfjson[i].nodeType == 'apinode' && dfjson[i].nodeType != 'startnode' && dfjson[i].nodeType != 'endnode') {
            try {
              this.logger.log("Api Node execution started")
              if (nodedet) {                   
                let nodeJson = await this.securityService.getNodeSecurityTemplate(nodedet, dfjson[i].nodeName)
                if (nodeJson?.status == '200'){ 
                  let dfoSchema: any
                  let dfoColumn: any = []
                  for (let item of dfo) {
                    if (item.nodeId == dfjson[i].nodeId) {
                      if (item.schema){
                        dfoSchema = item.schema
                        if(dfoSchema && dfoSchema.length>0){
                          for(let d=0;d<dfoSchema.length;d++){
                            dfoColumn.push(dfoSchema[d].name)
                          }
                        }
                      }
                    }
                  }       
                 var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + dfjson[i].nodeId))
                 if (customConfig) {
                    var connectors = customConfig.data?.connectorName
                    var link = customConfig.data?.linkParam
                    if(!link){
                      throw 'linkParam not found'
                    }
                    let objlevelChk = await this.securityService.getObjectSecurityTemplate(nodeJson.data,dfoColumn)
                                        
                    if(objlevelChk?.status == 201 && objlevelChk?.data){                     
                      if(objlevelChk?.data.includes(link)){
                        throw 'Required field were blocked please change the security flag'
                      }
                    }
                   // if(connectors)
                    // var apiconfig = JSON.parse(await this.redisService.getJsonData(connectors))
                                    
                    var oprname: any = customConfig.data.operationName                    

                    
                    var oprkey = Object.keys(customConfig.data)
                    if (oprname && oprkey.includes(oprname)) {
                      var oprval = customConfig.data[oprname].apipath                     
                      if (oprname == 'get') {
                        var pagination = customConfig.data[oprname].pagination
                        var selectcolumn = customConfig.data[oprname].selectColumns
                        var filtercolumns = customConfig.data[oprname].filterColumns
                        var reqparams = oprval
                        var api = customConfig.data[oprname].api
                             
                        if (api && api.endpoint) {
                          var postres = await this.commonService.getCall(api.endpoint)
                          if (postres && postres.result)
                            var apires: any = postres.result

                        } else {
                          throw 'Endpoint not found'
                        }

                        if (postres.status != 'Success' || postres.result.length == 0) {
                          throw 'Data not found'
                        }

                        var RCMresult: any = await this.teCommonService.getRuleCodeMapper(dfjson[i], apires)
                        if (RCMresult) {
                          let zenresult = RCMresult.rule
                          let customcoderesult = RCMresult.code
                        }
                        let dataSet = await this.getIfoAndDataSet(doNode, dfjson[i].nodeId)
                        let dsarr
                        if (dataSet) {
                          dsarr = dataSet.dsarr
                          if(dsarr?.length>0 && objlevelChk?.data?.length>0){     
                            dsarr = dsarr.filter(item => !objlevelChk?.data.includes(item)); 
                          }
                        }
                                               
                        if (apires && apires.length > 0) {
                          var apifilteredData = apires.map(item => {
                            return dsarr.reduce((acc, key) => {
                              acc[key] = item[key];
                              return acc;
                            }, {});
                          });

                          mergearr.push(apifilteredData)
                        }
                      }
                     
                      
                      if (postres.status == 'Success') {
                        await this.redisService.setJsonData(key + 'NDP', JSON.stringify(postres), dfjson[i].nodeId + '.data.' + oprname + '.response')
                      } else {
                        throw postres
                      }
                      nodeid = dfjson[i].routeArray[0].nodeId;
                      
                      if (upid) {
                        if (api && api.endpoint && dfoSchema)
                          await this.teCommonService.getTPL(sparekey, upid, 'E', dfjson[i], 'Success', token, 'DF', '', api.endpoint, dfoSchema)
                      }
                      this.logger.log("Api Node execution completed")

                    } else {
                      throw 'Operation name not found'
                    }
                  }
                }else {                      
                  throw nodeJson
                }
              }
            } catch (error) {              
              if(upid){          
                if(error.message){
                  error = error.message
                }      
                var apierror = await this.teCommonService.getTPL(sparekey, upid, 'E', dfjson[i], 'Failed', token,'DF', '','', error)
                throw apierror
              }else{
                throw error
              }
                         
            }
          }

          //Stream Node
          if (nodeid == dfjson[i].nodeId && dfjson[i].nodeType == 'streamnode' && dfjson[i].nodeType != 'startnode' && dfjson[i].nodeType != 'endnode') {
            try {
              this.logger.log("Stream Node execution started")
              if (nodedet) {                  
                let nodeJson = await this.securityService.getNodeSecurityTemplate(nodedet, dfjson[i].nodeName)
                if (nodeJson?.status == '200'){
                  let dfoSchema: any
                  let dfoColumn: any = []
                  for (let item of dfo) {
                    if (item.nodeId == dfjson[i].nodeId) {
                      if (item.schema){
                        dfoSchema = item.schema
                        if(dfoSchema && dfoSchema.length>0){
                          for(let d=0;d<dfoSchema.length;d++){
                            dfoColumn.push(dfoSchema[d].name)
                          }
                        }
                      }
                    }
                  }        
                  var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + dfjson[i].nodeId))
                  if (customConfig) {
                    var connectors: any = customConfig.data?.connectorName
                    var link = customConfig.data?.linkParam
                    if(!link){
                      throw 'linkParam not found'
                    }
                    let objlevelChk = await this.securityService.getObjectSecurityTemplate(nodeJson.data,dfoColumn)
                    if(objlevelChk?.status == 201 && objlevelChk?.data){                     
                      if(objlevelChk?.data.includes(link)){
                        throw 'Required field were blocked please change the security flag'
                      }
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
                  
                    var oprname: any = customConfig.data.operationName
                    var oprkey = Object.keys(customConfig.data)                
                    if (oprname && oprkey.includes(oprname)) {
                      let reqparams = customConfig.data[oprname]?.requestparams
                      var field = customConfig.data[oprname].field

                      if (oprname == 'read') {
                        var streamName = customConfig.data[oprname]?.streamName
                        var consumerGroup = customConfig.data[oprname]?.consumerGroup
                        var consumerName = customConfig.data[oprname]?.consumerName
                        if (!streamName) {
                          throw 'Stream RequestParams were empty'
                        }
                        if (await redis.call('EXISTS', streamName)) {
                          // var grpInfo: any = await redis.xinfo('GROUPS', streamName)
                          // if (grpInfo.length == 0) {
                          //   await redis.xgroup('CREATE', streamName, consumerGroup, '0', 'MKSTREAM');
                          // } else if (!grpInfo[0].includes(consumerGroup)) {
                          //   await redis.xgroup('CREATE', streamName, consumerGroup, '0', 'MKSTREAM');
                          // }

                          var streamData = [];

                          // let streamResult: any = await redis.xreadgroup('GROUP', consumerGroup, consumerName, 'STREAMS', streamName, '>');
                          let streamResult: any = await redis.xread('STREAMS', streamName, 0);

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
                              var data = streamData[s].data[1]
                              streamres.push(JSON.parse(data))
                              await this.redisService.ackMessage(streamName, consumerGroup, msgid);
                            }
                          }
                        }
                      }

                      var RCMresult: any = await this.teCommonService.getRuleCodeMapper(dfjson[i], streamres)
                      if (RCMresult) {
                        let zenresult = RCMresult.rule
                        let customcoderesult = RCMresult.code
                      }
                      let dataSet = await this.getIfoAndDataSet(doNode, dfjson[i].nodeId)
                      let dsarr
                      if (dataSet) {
                        dsarr = dataSet.dsarr
                        if(dsarr?.length>0 && objlevelChk?.data?.length>0){     
                          dsarr = dsarr.filter(item => !objlevelChk?.data.includes(item)); 
                        }
                      }

                      if (streamres && streamres.length > 0) {
                        var streamfilteredData = streamres.map(item => {
                          return dsarr.reduce((acc, key) => {
                            acc[key] = item[key];
                            return acc;
                          }, {});
                        });
                       
                        mergearr.push(streamfilteredData)
                      }
                      if (streamres)
                        await this.redisService.setJsonData(key + 'NDP', JSON.stringify(streamres), dfjson[i].nodeId + '.data.' + oprname + '.response')

                    } else {
                      throw 'Operation name not found'
                    }

                    if (upid) {
                      await this.teCommonService.getTPL(sparekey, upid, 'E', dfjson[i], 'Success', token, 'DF', '', streamName, dfoSchema)
                    }
                    nodeid = dfjson[i].routeArray[0].nodeId;
                    this.logger.log("Stream Node execution completed")

                  }
                }else{                    
                  throw nodeJson
                }
              }   
            } catch (error) {
              if(upid){  
                if(error.message){
                  error = error.message
                }            
                var streamerror = await this.teCommonService.getTPL(sparekey, upid, 'E', dfjson[i], 'Failed', token,'DF','', streamName, error)
                throw streamerror
              }else{
                throw error
              }
            }
          }

          // File node
          if (nodeid == dfjson[i].nodeId && dfjson[i].nodeType == 'filenode' && dfjson[i].nodeType != 'startnode' && dfjson[i].nodeType != 'endnode') {
            try {
              this.logger.log("File Node execution started")
              if (nodedet) {                  
                let nodeJson = await this.securityService.getNodeSecurityTemplate(nodedet, dfjson[i].nodeName)
                if (nodeJson?.status == '200') {
                  let dfoSchema: any
                  let dfoColumn: any = []
                  for (let item of dfo) {
                    if (item.nodeId == dfjson[i].nodeId) {
                      if (item.schema){
                        dfoSchema = item.schema
                        if(dfoSchema && dfoSchema.length>0){
                          for(let d=0;d<dfoSchema.length;d++){
                            dfoColumn.push(dfoSchema[d].name)
                          }
                        }
                      }
                    }
                  }     
                  var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + dfjson[i].nodeId))
                  
                  if (customConfig) {
                        var connectors: any = customConfig.data?.connectorName
                        var link = customConfig.data?.linkParam
                        if(!link){
                          throw 'linkParam not found'
                        }
                        let objlevelChk = await this.securityService.getObjectSecurityTemplate(nodeJson.data,dfoColumn)
                        if(objlevelChk?.status == 201 && objlevelChk?.data){                     
                          if(objlevelChk?.data.includes(link)){
                            throw 'Required field were blocked please change the security flag'
                          }
                        }
                        var fileconfig = JSON.parse(await this.redisService.getJsonData(connectors))
                        if (!fileconfig) {
                          throw `Invalid File connector ${connectors}`                      
                        }
                        var oprname: any = customConfig.data.operationName
                        var oprkey = Object.keys(customConfig.data)
                        var requestparams = customConfig.data[oprname].request
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

                        var oprname: any = customConfig.data.operationName
                        var oprkey = Object.keys(customConfig.data)
                        if (oprname && oprkey.includes(oprname)) {
                          var reqparams = customConfig.data[oprname].request
                          if (oprname == 'read') {
                            if(!reqparams || !reqparams.fileName || !reqparams.bucket || !reqparams.folder){
                              throw 'Invalid request parameters'
                            }
                            var fileBuffer = await this.apiService.getfileNode(minioConfig, reqparams.fileName, reqparams.bucket, reqparams.folder)

                            let file = fileBuffer.toString();
                            if (file)                            
                              var fileres = JSON.parse(file)
                            
                            if (fileres == undefined || fileres.length == 0) {
                              throw 'Data not found'
                            }
                            

                            var RCMresult:any = await this.teCommonService.getRuleCodeMapper(dfjson[i],fileres)                        
                            if(RCMresult){
                              let zenresult = RCMresult.rule
                              let customcoderesult = RCMresult.code 
                            }
                          
                            let dataSet = await this.getIfoAndDataSet(doNode, dfjson[i].nodeId)
                            let dsarr
                            if(dataSet){
                              dsarr = dataSet.dsarr
                              if(dsarr?.length>0 && objlevelChk?.data?.length>0){     
                                dsarr = dsarr.filter(item => !objlevelChk?.data.includes(item)); 
                              }
                            }
                            
                            if (fileres && fileres.length > 0) {
                              var filefilteredData = fileres.map(item => {
                                return dsarr.reduce((acc, key) => {
                                  acc[key] = item[key];
                                  return acc;
                                }, {});
                              });
                              // console.log(filefilteredData, 'filefilteredData');

                              mergearr.push(filefilteredData)
                            }
                            nodeid = dfjson[i].routeArray[0].nodeId;
                          }
                        } else {
                          throw 'Operation name not found'
                        }                       
                        if(upid){
                          await this.teCommonService.getTPL(sparekey, upid, 'E', dfjson[i], 'Success', token,'DF','', reqparams, dfoSchema)
                        }                    
                        this.logger.log("File Node execution completed")
                                
                  }
                }else{                    
                  throw nodeJson
                }
              }   
            } catch (error) {
              if(upid){
                if(error.message){
                  error = error.message
                } 
                var fileerror = await this.teCommonService.getTPL(sparekey, upid, 'E', dfjson[i], 'Failed', token,'DF','', reqparams, error)
                throw fileerror
              }else{
                throw error
              }
              
            }

          }

          //Scheduler node
          if (nodeid == dfjson[i].nodeId && dfjson[i].nodeType == 'schedulernode' && dfjson[i].nodeType != 'startnode' && dfjson[i].nodeType != 'endnode') {
            try {
              this.logger.log("Scheduler Node execution started")
              if (nodedet) {                
                let nodeJson = await this.securityService.getNodeSecurityTemplate(nodedet, dfjson[i].nodeName)
                if (nodeJson && nodeJson.status && nodeJson.status == '200') {
                  var customConfig: any = JSON.parse(await this.redisService.getJsonDataWithPath(key + 'NDP', '.' + dfjson[i].nodeId))

                  var data = customConfig.data
                  var int = data.interval
                  var sec = int.seconds + ' ' + int.minutes + ' ' + int.hours + ' ' + int.dayOfmonth + ' ' + int.months + ' ' + int.dayOfweek
                  var api = data.api
                  await this.SchedulerJob('dynamicJob', `${sec}`, api, dfjson[i], dstkey, key, upid, token);
                }else{
                  throw nodeJson
                }
              }
            } catch (error) {
              throw error
            }
          }

          // End node
          if (dfjson[i].nodeType == 'endnode') {
            if(upid)
            await this.teCommonService.getTPL(sparekey, upid, 'E', dfjson[i], 'Success', token, 'DF')
            break;
          }
        }  

      var targetItemArr = []     
      for(let targetElement of targetItems){
        targetItemArr.push(targetElement.id)
      }
      if(!targetItemArr.includes('process_id'))
        targetItemArr.push('process_id')     
    
      if(singleNode.length > 1){
        var datasetarr = await this.mergeArraysOfObjects(key,token,mode,targetItemArr,mergearr,link)       
      }
      
      var obj = {}
      obj['key'] = key
      if (datasetarr && datasetarr.length > 0) {
        obj['data'] = datasetarr
      }
      else if(singleNode && singleNode.length == 1)
        obj['data'] = mergearr[0]
      else
        obj['data'] = mergearr

      await this.redisService.setJsonData(dstkey + 'DS_Object', JSON.stringify(obj))

      this.logger.log("Data Fabric completed....")
      return { status: 'Success',statusCode:201,processKey:dstkey,dataset:obj}
      } else{
        var tslerror = await this.teCommonService.getTSL(key,token,'DFS not found',400,mode)
        throw tslerror
      }  
    }catch(error){ 
      throw error
    }   
  }

  async getIfoAndDataSet(doNode:any,currentNodeId){
    try {
      if(!currentNodeId)
        throw 'NodeId not found'

      var DataSet: any   
      var dsarr = []   
      if(doNode && doNode.length>0){
        for(var d=0; d<doNode.length; d++){
          if(doNode[d].nodeId == currentNodeId){
            if(doNode[d].ifo)
              DataSet = doNode[d].ifo 
            else
              throw 'IFO not found'                       
          }           
        }   
      }     
      if(DataSet && DataSet.length>0){
        for(var e=0; e<DataSet.length; e++){
          if(DataSet[e].name)               
            dsarr.push(DataSet[e].name)                  
        }        
        if(!dsarr.includes('process_id'))
          dsarr.push('process_id')
      }else{
        throw 'IFO was empty'  
      }
      
      return {dsarr}
    } catch (error) {      
      throw error
    }   
  } 
  
  async mergeArraysOfObjects(key,token,mode,targetItems,arrays: any[][],link): Promise<any>{
    try { 
      if(!link){
        var tslerror = await this.teCommonService.getTSL(key,token,'Link Param not found',400,mode)
        throw tslerror        
      }
      this.logger.log('linkParam:',link);

      const result: Record<number, any> = {};

      arrays.forEach(array => {
        array.forEach(obj => {
          if (link) 
            var linkId = obj[link];
          
          const { ...rest } = obj;
      
          if (!result[linkId]) {          
            result[linkId] = { ...rest };
          } else {
            if (rest) {              
              if (!result[linkId].child) {
                result[linkId].child = [];
              }
              const childObject: Record<string, any> = {};
              for (let element of targetItems) {
                if (!result[linkId].hasOwnProperty(element)) {
                  childObject[element] = rest[element];
                }
              }               
            
              if (Object.keys(childObject).length > 0) {               
                result[linkId].child.push(childObject);
              }
            } else {             
              Object.assign(result[linkId], rest);
            }
          }
        });
      });      
      return Object.values(result);
    } catch (error) {
      throw error
    }    
  }  

  async SchedulerJob(name: string, cronTime: string,api:any,dfjson:any,dstkey:any,key:any,upid,token) { 
    try {
      this.logger.log(`Cron job ${name} added with pattern ${cronTime}`);
        const job = new CronJob(cronTime, async() => {
          const requestConfig: AxiosRequestConfig = {
            headers: api.headers
          };                            
            // Get the endpoint dynamically and call the Api
          var res = await this.commonService.getCall(api.endpoint,requestConfig) 
          var schemaarr=[], objarr=[]
          var str = {}, obj = {}

          if(res != undefined){
            str['nodeId']=dfjson.nodeId;
            str['nodeName'] = dfjson.nodeName
            str['nodeType']=dfjson.nodeType;
            str['schema'] = Object.keys(res.result) 
            schemaarr.push(str)
            await this.redisService.setJsonData( dstkey+'DS_Schema', JSON.stringify(schemaarr))
            obj['nodeId']=dfjson.nodeId;
            obj['nodeName'] = dfjson.nodeName
            obj['nodeType']=dfjson.nodeType;
            obj['data'] = res.result
            objarr.push(obj)   
            await this.redisService.setJsonData(dstkey+'DS_Object', JSON.stringify(objarr))
          
            if(res.status == 'Success'){
              var logs={}
                    logs['nodeid']=dfjson.nodeId
                    logs['nodename']=dfjson.nodeName
                    logs['request']=api
                    logs['response']=res
                    await this.redisService.setStreamData('TPL', key+upid , JSON.stringify(logs));

                    this.logger.log("Scheduler Node execution completed")
            }else{
             // this.teCommonService.getDFException(key,upid,dfjson.nodeName,dfjson.nodeId,'E',token,'Scheduler Api Failed')
              throw new BadRequestException('Scheduler Api Failed')
            }
          } else{ 
            //this.teCommonService.getDFException(key,upid,dfjson.nodeName,dfjson.nodeId,'E',token,'Scheduler Api Failed') 
            throw new BadRequestException('...Scheduler Api Failed')
          }  
          
        });
      
        this.schedulerRegistry.addCronJob(name, job);
        job.start();   
        return job
      
    } catch (error) {
      throw error
    }    
  }
}


