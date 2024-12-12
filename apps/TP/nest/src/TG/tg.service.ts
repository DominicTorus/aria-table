import { HttpStatus, Injectable } from '@nestjs/common';
import { TgDfService } from './tg-df/tg-df.service';
import { TgUfService } from './tg-uf/tg-uf.service';
import { RedisService } from 'src/redisService';
import { CommonService } from 'src/commonService';
import { errorObj } from './Interfaces/errorObj.interface';
import { Keys } from './Interfaces/keys.tg.interface';
import { TgUfAriaService } from './tg-uf-aria/tg-uf-aria.service';
import { TG_CommonService } from './tg-common/tg-common.service';
import { TgUfGravityService } from './tg-uf-gravity/tg-uf-gravity.service';
import { sessionInfo } from './Interfaces/sessionInfo.tgCommon.interface';
import * as path from 'path';


@Injectable()
export class TgService {
  constructor(
    private readonly DFSevice: TgDfService,
    private readonly UFService: TgUfService,
    private readonly UFAriaService: TgUfAriaService,
    private readonly TgUfGravityService: TgUfGravityService,
    private readonly redisService: RedisService,
    private readonly commonService: CommonService,
    private readonly TGCommonService: TG_CommonService,
  ) {}
  async codeGeneration(key, token): Promise<any> {
    let assemblerKey: string = key;
    let keyParts: string[];
    let tenantName: string;
    let appGroupName: string;
    let appName: string;
    let assemblerData: any;
    let screenDetails: any = [];
    let navbarData: any;
    const source:string = 'redis';
    const target:string = 'redis';  
    let sessionInfo: sessionInfo = {
      key: assemblerKey,
      token: token,
    };  

    assemblerKey = key;
    keyParts = assemblerKey.split(':');    
    tenantName = keyParts[7];
    appGroupName = keyParts[9];
    appName = keyParts[11];
    const version: string = keyParts[13];

    let tenantPath: string = path.dirname(
      path.dirname(path.dirname(path.dirname(path.dirname(__dirname)))),
    );

    let tenantPathName: string = path.join(tenantPath,'apps', tenantName);
    let appGroupPathName: string = path.join(tenantPathName, appGroupName);
    let app_name: string = path.join(appGroupPathName, appName, 'UF', version);


    if (!assemblerKey || assemblerKey === '') {
      let errorObj: errorObj = {
        tname: 'TG',
        errGrp: 'Technical',
        fabric: 'AK',
        errType: 'Fatal',
        errCode: 'TG001',
      };
      const errorMessage: string = 'Assembler Key not found';
      const statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
      let errObj: any = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        assemblerKey,
        errorMessage,
        statusCode,
      );
      throw errObj;
    }
    
  
    assemblerData = await this.TGCommonService.readAPI(assemblerKey,source,target);
    assemblerData = assemblerData.artifactList;
    
    if (!assemblerData || assemblerData === '') {
      let errorObj: errorObj = {
        tname: 'TG',
        errGrp: 'Technical',
        fabric: 'AK',
        errType: 'Fatal',
        errCode: 'TG002',
      };
      const errorMessage: string = 'Invalid Assembler Key';
      const statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
      let errObj: any = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        assemblerKey,
        errorMessage,
        statusCode,
      );
      throw errObj;
    }

  
   
    screenDetails = await this.TGCommonService.flattenHierarchy(assemblerData);
    navbarData = screenDetails.reduce(
      (acc, { menuGroup, screenName, SF, UF }) => {
        const formattedScreenName:any = {'name':screenName,
          'key':UF
        };

        const menuGroupObj: any = acc.find(
          (item) => item.menuGroup === menuGroup,
        );
        if (menuGroupObj) {
          menuGroupObj.screenDetails.push(formattedScreenName);
        } else {
          acc.push({ menuGroup, screenDetails: [formattedScreenName] });
        }

        return acc;
      },
      [],
    );
    // return navbarData
    // return screenDetails;
    let screensNames: string[] = [];
    if (screenDetails.length > 0) {
      for (let i = 0; i < screenDetails.length; i++) {
        screensNames.push(screenDetails[i].screenName.replace(/ /g, '_'));
      }
    }
    let appPath:string
    let totalStates:any =[]
    if (screenDetails.length > 0) {
      for (let i = 0; i < screenDetails.length; i++) {
        let keys: Keys = {
          aKey: assemblerKey,
          ufKey: screenDetails[i].UF,         
          navbarData: navbarData,
        };
        if (i === 0) {
         appPath = await this.TgUfGravityService.generateStaticFiles(
            keys,
            screensNames,
            token,
          );
        }
        let states:any = await this.TgUfGravityService.generateScreenSpecificFiles(
          keys,
          token,
        );
        totalStates.push(...states);
      }
        await this.TGCommonService.CreateSchemaFile(
          sessionInfo,
          './dist/TG/tg-AppTemplate/tg-uf-gravity/dynamic/globalContext.ejs',
          totalStates,
          '',
          app_name + '/app' + '/globalContext.tsx',
        );
    }
    await this.TGCommonService.createRepository(appPath,'UF',assemblerKey);
    return 'Code Generation Completed';
  }
}
