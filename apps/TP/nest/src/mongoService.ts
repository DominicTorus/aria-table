import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { BadRequestException } from "@nestjs/common";
import { WriteMDdto } from "src/writeMDdto";
import { RedisService } from "src/redisService";
import { ApiService } from "./apiService";
import jsonata from "jsonata";

export class MongoService{
    constructor(@InjectModel('TLC') private readonly model: Model<any>
    ){}    

    async getAMK(key,fngkFlag): Promise<any>{
        var skey = key.split(':') 
        var fngk;
        if(fngkFlag)
         fngk = 'FRP'
        else
         fngk = 'FR'
        var fnk = skey[2]
        var catk = skey[3]        
        var afgk = skey[4]
        var afk = skey[5]
        var afvk = skey[6]
        
        var path = fngk+'.'+fnk+'.'+catk+'.'+afgk+'.'+afk+'.'+afvk 
        const sf = await this.model.db.collection('TCL').find({[path]:{$exists:true}}).toArray()       
        var result = sf[0][fngk][skey[2]][skey[3]][skey[4]][skey[5]][skey[6]][skey[7]];       
        return result      
      
    }

    async setPlaceholder(key,upId,npc,nodename): Promise<any>{
        var result;
        var pfkey = key.split(':') 
        var placeholder = {"request":{},"response":{},"exception":{}} 
        var fngk = 'FRP'
        var fnk = pfkey[2]
        var catk = pfkey[3]        
        var afgk = pfkey[4]
        var afk = pfkey[5]
        var afvk = pfkey[6]
        var FRKP = {[fngk]:{[fnk]:{[catk]:{[afgk]:{[afk]:{[afvk]:{[upId]:{[npc]:{[nodename]:{'PRE':placeholder,'PRO':placeholder,'PST':placeholder}}}}}}}}}}
        var path = fngk+'.'+fnk+'.'+catk+'.'+afgk+'.'+afk+'.'+afvk 
      

        const sf = await this.model.db.collection('TCL').find({[path]:{$exists:true}}).toArray()      
        if(sf.length>0){                     
            await this.update(key,upId+'.'+npc+'.'+nodename+'.'+'PRE',sf[0]['_id'],placeholder,true)
            await this.update(key,upId+'.'+npc+'.'+nodename+'.'+'PRO',sf[0]['_id'],placeholder,true)
            result = await this.update(key,upId+'.'+npc+'.'+nodename+'.'+'PST',sf[0]['_id'],placeholder,true)            
            return sf[0]['_id']

        }else{
            result = await this.model.db.collection('TCL').insertOne(FRKP)           
            return result.insertedId
        }  
    }

    async getObjId(key){
        var pfkey = key.split(':')
        var docs = await this.model.db.collection('TCL').find().toArray()
        for(var i=0;i<docs.length;i++){       
          if(docs[i][pfkey[1]+':'+pfkey[2]+':'+pfkey[3]+':'+pfkey[4]+':'+pfkey[5]+':'+pfkey[6]]){          
            return docs[i]['_id']
          }
        }
    }

    async update(key:any,path:any,objId:any,value:any,fngkFlag): Promise<any> {    
      try {
        var pfkey = key.split(':')
        var jsonpath
        if(fngkFlag == true){
          jsonpath = `FRP.${pfkey[2]}.${pfkey[3]}.${pfkey[4]}.${pfkey[5]}.${pfkey[6]}.${path}`     
        }else if(fngkFlag == false || fngkFlag == undefined){
           jsonpath = `FR.${pfkey[2]}.${pfkey[3]}.${pfkey[4]}.${pfkey[5]}.${pfkey[6]}.${path}`
        } 
        const setvalue = { $set:{[jsonpath]:value}}          
        return this.model.db.collection('TCL').updateOne({ _id: objId},setvalue);
      } catch (error) {
        throw error
      }   
   
    } 

    async setKey(key): Promise<any>{
      try {
        var setkey;    
        var CK = key.CK
        var FNGK = key.FNGK
        var FNK = key.FNK
        var CATK = key.CATK
        var AFGK = key.AFGK
        var AFK = key.AFK
        var AFVK = key.AFVK
        var AFSK = key.AFSK  
        var afskkey = Object.keys(AFSK) 
        var afskvalue = Object.values(AFSK)   
        // var isexist = await this.model.db.collection(CK).find({'FNGK':FNGK,'FNK':FNK,'CATK':CATK,'AFGK':AFGK,'AFK':AFK,'AFVK':AFVK,['AFSK.'+afskkey[0]]:{$exists:true}},{projection:{_id:1}}).toArray()
        var isexist = await this.model.db.collection(CK).find({'FNGK':FNGK,'FNK':FNK,'CATK':CATK,'AFGK':AFGK,'AFK':AFK,'AFVK':AFVK},{projection:{_id:1}}).toArray()
      
        if(isexist.length > 0){
          setkey = await this.model.db.collection(CK).updateOne({'FNGK':FNGK,'FNK':FNK,'CATK':CATK,'AFGK':AFGK,'AFK':AFK,'AFVK':AFVK},{$set: {['AFSK.'+afskkey[0]]: afskvalue[0]}})          
          if(setkey.modifiedCount > 0){             
            return {"message":"Value Inserted","insertedId":isexist[0]['_id']}
          }
          else{
            return {"message":"Same value can not be updated","insertedId":isexist[0]['_id']}
          }       
        }else{
            setkey = await this.model.db.collection(CK).insertOne({
              "FNGK":FNGK,
              "FNK":FNK,
              "CATK":CATK,
              "AFGK":AFGK,
              "AFK":AFK,
              "AFVK":AFVK,
              "AFSK":AFSK,      
            })   
            if(setkey.insertedId){
              return {"message":"Value Inserted","insertedId":setkey.insertedId}
            }else{
              return {"message":"Value not Inserted"}
            }      
           
        }
      } catch (error) {
        throw error
      }
    }   

  async getKeys(key): Promise<any>{     
    var json:any
    var finalArr = []
    var CK = key.CK
    var FNGK = key.FNGK
    var FNK = key.FNK
    var CATK = key.CATK
    var AFGK = key.AFGK
    var AFK = key.AFK
    var AFVK = key.AFVK
    var AFSK = key.AFSK
    var PATH = key.PATH
    if(AFSK && PATH == undefined ){
      json= await this.model.db.collection(CK).find({'FNGK':FNGK,'FNK':FNK,'CATK':{$in:CATK},'AFGK':{$in:AFGK},'AFK':{$in:AFK},'AFVK':{$in:AFVK},['AFSK.'+AFSK]:{$exists:true}},{projection:{[`AFSK.${AFSK}`]:1,_id:0}}).toArray();

      if(json.length > 0){
        return json[0]['AFSK'][AFSK]
      }else{
        throw new BadRequestException(`Key not found in collection ${CK}`)
      }      
    } else if(AFSK && PATH){ 
      json = await this.model.db.collection(CK).find({'FNGK':FNGK,'FNK':FNK,'CATK':{$in:CATK},'AFGK':{$in:AFGK},'AFK':{$in:AFK},'AFVK':{$in:AFVK},[`AFSK.${AFSK}.${PATH}`]:{$exists:true}},{projection:{[`AFSK.${AFSK}.${PATH}`]:1,_id:0}}).toArray();

      if(json.length > 0){
        var splittedPath = PATH.split('.')
        if(splittedPath.length > 0){            
          //   var field = ''
          //   for(var i=0;i<splittedPath.length;i++){
          //    field = field + '['+splittedPath[i]+']'
          //   }            
          //   return json[0]['AFSK'][AFSK].field
          var field = json[0]['AFSK'][AFSK];
          for (var i = 0; i < splittedPath.length; i++) {
            if (field[splittedPath[i]] !== undefined) {
              field = field[splittedPath[i]];                 
            } else {
              throw new BadRequestException(`Path not found`) 
            }
        }
        return field;
        }

        return json[0]['AFSK'][AFSK][PATH]
      }else{
        throw new BadRequestException(`Key not found in collection ${CK}`)
      }

    }
    else{  
    let querypath: any = {
      'FNGK': FNGK,
      'FNK': FNK,
    };    

    if (CATK.length > 0) {
      querypath['CATK'] = { $in: CATK };
    }

    if (AFGK.length > 0) {
      querypath['AFGK'] = { $in: AFGK };
    }

    if (AFK.length > 0) {
      querypath['AFK'] = { $in: AFK };
    }

    if (AFVK.length > 0) {
      querypath['AFVK'] = { $in: AFVK };
    }    
    json = await this.model.db.collection(CK).find(querypath,{projection:{_id: 0} }).toArray()
    if(json.length == 0){
      throw new BadRequestException(`Key not found in collection ${CK}`)
    }
      const processObject = (obj) => {
        const values = Object.values(obj).slice(0, -1);
        const nestedKeys = obj.AFSK ? Object.keys(obj.AFSK) : [];
        return [...values, ...nestedKeys];
      };
      const ArrResult = json.map(processObject);

      for(let i = 0; i < ArrResult.length; i++) {          
        if(CATK.includes(ArrResult[i][2]) || CATK.length == 0){  
          if(AFGK.includes(ArrResult[i][3]) || AFGK.length == 0){  
            if(AFK.includes(ArrResult[i][4]) || AFK.length == 0){
              if(AFVK.includes(ArrResult[i][5]) || AFVK.length == 0){  
                finalArr.push(ArrResult[i])
              }                
            }            
          }            
        }          
      }      
      const output = { FNGKList: [] };

      finalArr.forEach((item) => {
        const fngk = item[0];
        const fnk = item[1];
        const catk = item[2];
        const afgk = item[3];
        const afk = item[4];
        const afvk = item[5];
        const afskList = item.slice(6);

        let fngkObj = output.FNGKList.find((obj) => obj.FNGK === fngk);
        if (!fngkObj) {
          fngkObj = { FNGK: fngk, FNKList: [] };
          output.FNGKList.push(fngkObj);
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
          afvkObj = { AFVK: afvk, AFSKList: afskList };
          afkObj.AFVKList.push(afvkObj);
        }          
      });    
    //   return output;
    var jsonPath
    if(key.AFVK.length > 0 ){
      jsonPath = 'FNGKList.FNKList.CATKList.AFGKList.AFKList.AFVKList'  
     }
    else if(key.AFK.length > 0){
      jsonPath = 'FNGKList.FNKList.CATKList.AFGKList.AFKList'
    }
    else if(key.AFGK.length > 0){
      jsonPath = 'FNGKList.FNKList.CATKList.AFGKList'
    }
    else if(key.CATK.length > 0){
      jsonPath = 'FNGKList.FNKList.CATKList'    
    }
    else{
      jsonPath = 'FNGKList.FNKList.CATKList'    
    }
    const expression = jsonata(jsonPath);
    var customresult = await expression.evaluate(output);
    const removeKeys = (obj: any, keys: string[]): any => {
      if (Array.isArray(obj)) return obj.map(item => removeKeys(item, keys));  
      if (typeof obj === 'object' && obj !== null) {
        return Object.keys(obj).reduce((previousValue: any, key: string) => {
          return keys.includes(key) ? previousValue : { ...previousValue, [key]: removeKeys(obj[key], keys) };
        }, {});
      }  

      return obj;
    }
    var finalResponse;
    if(key.stopsAt){
      if(key.stopsAt == "AFVK"){      
        finalResponse = await removeKeys(customresult, ["AFSKList"]);
      }
      else if(key.stopsAt == "AFK"){    
        finalResponse = await removeKeys(customresult, ["AFVKList"]);
      }
      else if(key.stopsAt == "AFGK"){
        finalResponse = await removeKeys(customresult, ["AFKList"]);
      }
      else if(key.stopsAt == "CATK"){
        finalResponse = await removeKeys(customresult, ["AFGKList"]);
      }else{
        return customresult
      }
      return finalResponse;

     }
    else{
      return customresult
    }
  }    
  }
      
    async updateKey(key): Promise<any>{
        var setvalue;
        var filed;
        var CK = key.CK
        var FNGK = key.FNGK
        var FNK = key.FNK
        var CATK = key.CATK
        var AFGK = key.AFGK
        var AFK = key.AFK
        var AFVK = key.AFVK
        var AFSK = key.AFSK
        var path = key.PATH
        var afskKey = Object.keys(AFSK)
        var afskValue = Object.values(AFSK)
        var value = Object.values(afskValue[0])   
       
        var objId = await this.model.db.collection(CK).find({'FNGK':FNGK,'FNK':FNK,'CATK':CATK,'AFGK':AFGK,'AFK':AFK,'AFVK':AFVK},{projection:{_id:1}}).toArray();
                             
        if(objId.length == 0){
          throw new BadRequestException('Key Not Found in MongoDB')
        }
        if(path == undefined){
              filed = `AFSK.${afskKey}`
              setvalue = {$set:{[filed]:afskValue[0]}}
        }else{
          
              filed = `AFSK.${afskKey}.${path}`
              setvalue = {$set:{[filed]:value[0]}}
        }
        
        var updJson = await this.model.db.collection(CK).updateOne(
        { _id: objId[0]['_id'] },
        setvalue
        );        
       
        if(updJson.modifiedCount != 0){
          return {"message":'Updated Successfully',"_id":objId}
        }else{
          return 'Not Updated'
        }    
    }

    // async deleteKey(key){
    //     try {
    //       var CK = key.CK
    //       var FNGK = key.FNGK
    //       var FNK = key.FNK
    //       var CATK = key.CATK
    //       var AFGK = key.AFGK
    //       var AFK = key.AFK
    //       var AFVK = key.AFVK
    //       var AFSK = key.AFSK

    //       var delkey = await this.model.db.collection(CK).updateOne({'FNGK':FNGK,'FNK':FNK,'CATK':CATK,'AFGK':AFGK,'AFK':AFK,'AFVK':AFVK,['AFSK.'+AFSK[0]]:{$exists:true}},{$unset: {['AFSK.'+AFSK[0]]: ''}})
    //       // var delkey = await this.model.db.collection(CK).updateOne({'FNGK':FNGK,'FNK':FNK,'CATK':CATK,'AFGK':AFGK,'AK':AK,'AFVK':AFVK,['AFSK.'+AFSK]:{$exists:true}},{$unset: {['AFSK.'+AFSK]: ''}})
          
    //       if(delkey.modifiedCount != 0){
    //         return 'Deleted Successfully'
    //       }else{
    //         return 'Invalid key'
    //       } 
    //     } catch (error) {
    //       throw error
    //     } 
    // }   

    async CloneDocument(key:any): Promise<any>{
      var CK = key.CK
      var FNGK = key.FNGK
      var FNK = key.FNK
      var CATK = key.CATK
      var AFGK = key.AFGK
      var AFK = key.AFK
      var AFVK = key.AFVK
      var objId = await this.model.db.collection(CK).find({'FNGK':FNGK,'FNK':FNK,'CATK':CATK,'AFGK':AFGK,'AFK':AFK,'AFVK':AFVK},{projection:{_id:0}}).toArray();
  
      if(!objId){
        throw new BadRequestException('Key Not Found in MongoDB')
      }
     return objId
  
    }
}