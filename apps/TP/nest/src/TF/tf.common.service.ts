import { HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CommonService } from "src/commonService";
import * as fs from 'fs'
import * as ejs from 'ejs'
import {errorObj} from './dto/errorObj.interface'
import {sessionInfo} from './dto/sessionInfo.tgCommon.interface'
import { readAPIDTO } from "src/TE/Dto/input";
import axios from "axios";

@Injectable()
export class TF_CommonService {
    constructor(private readonly commonService:CommonService ) {}


    async ReadFile(filePath: string, sessionInfo: sessionInfo) {
        // const token: string = sessionInfo.token;
        // const keys: string = sessionInfo.key;
        try {
          return await fs.readFileSync(filePath, 'utf8');
        } catch (error) {
          let errorObj: errorObj = {
            tname: 'TG',
            errGrp: 'Technical',
            fabric: 'ALL',
            errType: 'Fatal',
            errCode: 'TG012',
          };
          const errorMessage: string = 'File not found';
          const statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
          let errObj: any 
        //   = await this.commonService.commonErrorLogs(
        //     errorObj,
        //     token,
        //     keys,
        //     errorMessage,
        //     statusCode,
        //   );
          throw errObj;
        }
      }

      async CreateSchemaFile(
        sessionInfo: sessionInfo,
        sourcePath: string,
        data: any,
        relation: any,
        targetPath: string,
      ) {
        // const token = sessionInfo.token;
        // const keys = sessionInfo.key;
        try {
          let objtemplate: any = await this.ReadFile(sourcePath, sessionInfo);
          let fn: any = ejs.compile(objtemplate);
          let str: any = fn({
            data: data,
            relation: relation,
          });
          if (str != '') {
            fs.writeFileSync(targetPath, str);
          }
        } catch (error) {
          let errorObj: errorObj = {
            tname: 'TG',
            errGrp: 'Technical',
            fabric: 'ALL',
            errType: 'Fatal',
            errCode: 'TG013',
          };
          const errorMessage = 'Invalid ejs file';
          const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          let errObj =''
        // = await this.commonService.commonErrorLogs(
        //     errorObj,
        //     token,
        //     keys,
        //     errorMessage,
        //     statusCode,
        //   );
          throw errObj;
        }
      }

      async createFolder(folderName: string) {
        // let strroot_path: string = path.join('src', foldername)
        fs.mkdirSync(folderName, { recursive: true });
        return await 'success';
      }

      async CreateFileWithThreeParam(
        sessionInfo: sessionInfo,
        sourcePath: string,
        data: any,
        relation: any,
        data1: any,
        data2: any,
        targetPath: string,
      ) {
        // const token: string = sessionInfo.token;
        // const keys: string = sessionInfo.key;
    
        let objtemplate: any = await this.ReadFile(sourcePath, sessionInfo);
        try {
          let fn: any = ejs.compile(objtemplate);
          let str: any = fn({
            data: data,
            relation: relation,
            data1: data1,
            data2: data2,
          });
          function decodeHtmlEntities(str: string): string {
            return str
              .replace(/&#39;/g, "'")
              .replace(/&#34;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&gt;/g, '>');
          }
          if (str != '') {
            fs.writeFileSync(targetPath, decodeHtmlEntities(str), { encoding: 'utf8' });
          }
        } catch (error) {
          
          // let errorObj: errorObj = {
          //   tname: 'TG',
          //   errGrp: 'Technical',
          //   fabric: 'ALL',
          //   errType: 'Fatal',
          //   errCode: 'TG013',
          // };
          // const errorMessage = 'Invalid ejs file';
          // const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          // let errObj = await this.commonService.commonErrorLogs(
          //   errorObj,
          //   token,
          //   keys,
          //   errorMessage,
          //   statusCode,
          // );
          // throw errObj;
          console.log('Error File Creating' + error);
        }
      }
    
      async copyFile(
        sessionInfo: sessionInfo,
        sourcePath: string,
        targetPath: string,
      ) {
        // const token = sessionInfo.token;
        // const keys = sessionInfo.key;
        try {
          fs.copyFileSync(sourcePath, targetPath);
        } catch (error) {
          let errorObj: errorObj = {
            tname: 'TG',
            errGrp: 'Technical',
            fabric: 'ALL',
            errType: 'Fatal',
            errCode: 'TG012',
          };
          const errorMessage = 'File not found';
          const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          // let errObj = await this.commonService.commonErrorLogs(
          //   errorObj,
          //   'token',
          //   'keys',
          //   errorMessage,
          //   statusCode,
          // );
          console.log(errorMessage, sourcePath, targetPath);
          throw error;
        }
      }

      async readAPI( keys: string,source:string,target:string): Promise<any> {
        const keyParts = keys.split(':');    
        const catk:string[] = [];
        const afgk:string[] = []; 
        const ak:string[] = [];
        const afvk:string[] = [];
        const afsk:string =keyParts[14];
        const ck = keyParts[1];
        const fngk = keyParts[3];
        const fnk = keyParts[5];    
        catk.push(keyParts[7]);
        afgk.push(keyParts[9]);
        ak.push(keyParts[11]) ;
        afvk.push(keyParts[13]);
     
        let readAPIBody: readAPIDTO  = {
         SOURCE : source,
         TARGET : target,
         CK :ck,
         FNGK :fngk,
         FNK :fnk,
         CATK :catk,
         AFGK :afgk,
         AFK :ak,
         AFVK :afvk,
         AFSK :afsk,
        };
     
        const readKey = await axios.post(
         'http://localhost:3002/api/readkey',readAPIBody
       )
       
       return readKey.data;
       }

  eventFunction(eventProperty: any) {
    let eventsDetails: any = [];
    const eventDetailsArray: any[] = [];
    let eventDetailsObj: any = {};
    function addEventDetailsArray(data) {
      if (data.length > 0) {
        data.forEach((item) => {
          eventDetailsArray.push({
            id: item.id,
            name: item.name,
            type: item.type,
            value: item.value,
            eventContext: item?.eventContext,
            targetKey: item.targetKey,
            sequence: item.sequence,
            key: item.key,
            url: item?.hlr?.params?.url,
            status: item?.hlr?.params?.status,
            primaryKey: item?.hlr?.params?.primaryKey,
            tableName: item?.hlr?.params?.tableName,
            hlr: item?.hlr,
          });
          if (item.children?.length > 0) {
            addEventDetailsArray(item.children);
          }
        });
      }
    }
    function addeventDetailsObj(data) {
      if (data.length > 0) {
        data.forEach((item) => {
          eventDetailsObj = {
            ...eventDetailsObj,
            [`${item.id}`]: {
              id: item.id,
              name: item.name,
              type: item.type,
              sequence: item.sequence,
            },
          };
          if (item.children?.length > 0) {
            addeventDetailsObj(item.children);
          }
        });
      }
    }
    addEventDetailsArray([{ ...eventProperty }]);
    addeventDetailsObj([{ ...eventProperty }]);
    eventsDetails.push(eventDetailsArray);
    eventsDetails.push(eventDetailsObj);
    return eventsDetails;
  }
}