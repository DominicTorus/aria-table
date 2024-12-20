import { HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import { TG_CommonService } from 'src/TG/tg-common/tg-common.service';
import { CommonService } from 'src/commonService';
import { RedisService } from 'src/redisService';
import { errorObj } from '../Interfaces/errorObj.interface';
import { sessionInfo } from '../Interfaces/sessionInfo.tgCommon.interface';
import { Keys } from '../Interfaces/keys.tg.interface';
import { erObj } from '../Interfaces/erObj.tgdf.interface';

@Injectable()
export class TgDfService {
  /**
   * The CgErApiSecurityService class is used to generate a Nest application for DF
   *  with the ER API and updated security JSON.
   * Constructor for the CgErApiSecurityService class.
   *
   * @param {RedisService} redisService - The RedisService instance.
   * @param {CG_CommonService} CommonService - The CG_CommonService instance.
   */
  constructor(
    private readonly redisService: RedisService,
    private readonly TGCommonService: TG_CommonService,
    private readonly commonService: CommonService
  ) {}

  async DFcreateCode(key: string, token: string, dataBase: string,gitRepo:string): Promise<any> {
    let dfCgDataArray: any = [];
    let keys: Keys = {
      dfKey: key,
    }
    let dfCgData: any = await this.prepareDataForDynamicFiles(
      keys,
      token,
      dataBase
    );
    // console.log(dfCgData);
    dfCgDataArray.push(dfCgData);
    let appPath:string =  await this.generateStaticFiles(keys.dfKey, '',dataBase,gitRepo);   
    let dfData: any = await this.mergeData(dfCgDataArray);
    await this.generateDynamicFiles(keys, dfData,token,dataBase);     
    await this.TGCommonService.createRepository(appPath,'DF',gitRepo);
    return `Code Generation Completed for ${key}`;
  }

  /**
   * Generates an API based on the given Assembler key. The key is split into different parts
   * and used to construct file paths and names. The function creates necessary folders,
   * retrieves JSON data from Redis, and processes the data to generate various files
   * related to Prisma, Torus_App, Casl, and the main file. The function also creates
   * test files for end-to-end testing. Finally, it returns the success message.
   *
   * @param {string} key - The key used to generate the API.
   * @return {Promise<any>} - A Promise that resolves to an array of user matrix data.
   */

  async generateStaticFiles(aKey: string, token: string,dataBase: string,gitRepo:string): Promise<any> {
    const sessionInfo: sessionInfo = {
      key: aKey,
      token: token,
    };
    let dataBaseName: string = dataBase;
    const keyParts: string[] = aKey.split(':');
    const tenantName: string = keyParts[7];
    const appGroupName: string = keyParts[9];
    const appName: string = keyParts[11];
    const version: string = keyParts[13];
    //create a app inside the created path given below
    //this path is dynamically created based on the provided key
    const tenantPath: string = path.dirname(
      path.dirname(path.dirname(path.dirname(path.dirname(__dirname)))),
    );
    const tenantPathName: string = path.join(tenantPath, tenantName);
    const appGroupPathName: string = path.join(tenantPathName, appGroupName);
    const appPathName: string = path.join(
      appGroupPathName,
      appName,
      'DF',
      version,
    );

    await this.TGCommonService.checkAndDeleteFolder(appPathName);
    // console.log(appPathName);
    const AppTemplateCaslPath: string = path.join(appPathName, 'src/ability');
    const srcPathName: string = path.join(appPathName, 'src');
    const testPathName: string = path.join(appPathName, 'test');
    const prismaPathName: string = path.join(appPathName, 'prisma');
    const ExceptionFolderPath: string = path.join(
      srcPathName,
      'exceptionFilter',
    );
    const interfacePath: string = path.join(srcPathName, 'interfaces');
    const kubernetesPath: string = path.join(appPathName, 'kubernetes');
    const codeDescriptionPath: string = path.join(srcPathName, 'codeDescription');
    const codeDescriptionEntityPath: string = path.join(codeDescriptionPath, 'entity');
    // console.log("🚀 ~ TgDfService ~ generateStaticFiles ~ kubernetesPath:", kubernetesPath)

    await this.TGCommonService.createFolder(tenantPathName);
    await this.TGCommonService.createFolder(appGroupPathName);
    await this.TGCommonService.createFolder(appPathName);
    await this.TGCommonService.createFolder(srcPathName);
    await this.TGCommonService.createFolder(testPathName);
    await this.TGCommonService.createFolder(appPathName);
    await this.TGCommonService.createFolder(AppTemplateCaslPath);
    await this.TGCommonService.createFolder(prismaPathName);
    await this.TGCommonService.createFolder(ExceptionFolderPath); 
    await this.TGCommonService.createFolder(interfacePath); 
    await this.TGCommonService.createFolder(kubernetesPath);
    await this.TGCommonService.createFolder(codeDescriptionPath); 
    await this.TGCommonService.createFolder(codeDescriptionEntityPath); 

    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/copy/controller.ejs',
      codeDescriptionPath + '/codeDescription.controller.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/copy/module.ejs',
      codeDescriptionPath + '/codeDescription.module.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/copy/service.ejs',
      codeDescriptionPath + '/codeDescription.service.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/copy/entity.ejs',
      codeDescriptionEntityPath + '/codeDescription.entity.ts',
    );

    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/errorObjInterface.ejs',
      interfacePath + '/errorObj.interface.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/readAPI.dto.ejs',
      interfacePath + '/readAPI.dto.ts',
    );

    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/eslintrc.ejs',
      appPathName + '/.eslintrc.js',
    );
    let url =gitRepo.split('/')[4]
    let appNameForDep:string =url.split('DF')[0]

    await this.TGCommonService.CreateSchemaFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/deployment/deploymentservice.ejs',
      appNameForDep,
      '',
      kubernetesPath + '/deploymentservice.yaml',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/deployment/Dockerfile.ejs',
      appPathName + '/Dockerfile',
    );
    await this.TGCommonService.CreateSchemaFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/deployment/Jenkinsfile.ejs',
      appNameForDep,
      gitRepo,
      appPathName + '/Jenkinsfile',
    );

    if (dataBaseName ==='postgres') {      
      await this.TGCommonService.CreateSchemaFile(
        sessionInfo,
        './dist/TG/tg-AppTemplate/tg-df/static/postgres/env.ejs',
        '',
        '',
        appPathName + '/.env',
      );
    }else if (dataBaseName ==='mongoDb') {
      await this.TGCommonService.CreateSchemaFile(
        sessionInfo,
        './dist/TG/tg-AppTemplate/tg-df/static/mongoDb/env.ejs',
        '',
        '',
        appPathName + '/.env',
      );
    } else if(dataBaseName ==='mysql') {
      await this.TGCommonService.CreateSchemaFile(
        sessionInfo,
        './dist/TG/tg-AppTemplate/tg-df/static/mysql/env.ejs',
        '',
        '',
        appPathName + '/.env',
      );
    }

    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/gitignore.ejs',
      appPathName + '/.gitignore',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/prettierrc.ejs',
      appPathName + '/.prettierrc',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/nest-cli.ejs',
      appPathName + '/nest-cli.json',
    );
    await this.TGCommonService.CreateSchemaFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/dynamic/package-lock.ejs',
      appName,
      '',
      appPathName + '/package-lock.json',
    );
    await this.TGCommonService.CreateSchemaFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/dynamic/package.ejs',
      appName,
      '',
      appPathName + '/package.json',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/README.ejs',
      appPathName + '/README.md',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/tsconfig.build.ejs',
      appPathName + '/tsconfig.build.json',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/tsconfig.ejs',
      appPathName + '/tsconfig.json',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/ability.module.ejs',
      AppTemplateCaslPath + '/ability.module.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/ability.decorator.ejs',
      AppTemplateCaslPath + '/ability.decorator.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/main.ejs',
      srcPathName + '/main.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/prisma.service.ejs',
      srcPathName + '/prisma.service.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/jwt.service.ejs',
      srcPathName + '/jwt.service.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/app.e2e-spec.ejs',
      testPathName + '/app.e2e-spec.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/jest-e2e.ejs',
      testPathName + '/jest-e2e.json',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/commonService.ejs',
      srcPathName + '/commonService.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/redisService.ejs',
      srcPathName + '/redisService.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/static/exception.ejs',
      ExceptionFolderPath + '/exception.filter.ts',
    );

    // console.log(aKey);
    return appPathName;
  }

  async prepareDataForDynamicFiles(keys: Keys, token: string,dataBase: string): Promise<any> {
    let dfKey: string = keys.dfKey;
    let source: string = 'redis';
    let target: string = 'redis';
    let tables: any
    if (!dfKey || dfKey === '') {
      let errorObj: errorObj = {
        tname: 'TG',
        errGrp: 'Technical',
        fabric: 'DF',
        errType: 'Fatal',
        errCode: 'TG003',
      };
      const errorMessage = 'DF Key not found';
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let errObj = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        dfKey,
        errorMessage,
        statusCode,
      );
      throw errObj;
    } 
    const nodes: any = await this.TGCommonService.readAPI(dfKey + ':NDS',source,target);
    const nodeProperties: any = await this.TGCommonService.readAPI(dfKey + ':NDP',source,target);

    const componentsId: string[] = [];
    if (
      (!nodes || nodes === '') &&
      (!nodeProperties || nodeProperties === '')
    ) {
      let errorObj: errorObj = {
        tname: 'TG',
        errGrp: 'Technical',
        fabric: 'DF',
        errType: 'Fatal',
        errCode: 'TG004',
      };
      const errorMessage: string = 'Invalid DF key';
      const statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
      let errObj: any = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        dfKey,
        errorMessage,
        statusCode,
      );
      throw errObj;
    } else if (!nodes || nodes === '') {
      let errorObj: errorObj = {
        tname: 'TG',
        errGrp: 'Technical',
        fabric: 'DF',
        errType: 'Fatal',
        errCode: 'TG015',
      };
      const errorMessage: string = 'Node json not found';
      const statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
      let errObj: any = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        dfKey,
        errorMessage,
        statusCode,
      );
      throw errObj;
    } else if (!nodeProperties || nodeProperties === '') {
      let errorObj: errorObj = {
        tname: 'TG',
        errGrp: 'Technical',
        fabric: 'DF',
        errType: 'Fatal',
        errCode: 'TG016',
      };
      const errorMessage: string = 'NodeProperty json not found';
      const statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
      let errObj: any = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        dfKey,
        errorMessage,
        statusCode,
      );
      throw errObj;
    }

    if (nodes.length > 0) {
      for (let i = 0; i < nodes.length; i++) {
        componentsId.push(nodes[i].id);
      }
    }

    let nodePropertiesKeys: string[] = Object.keys(nodeProperties);
    if (nodes.length != nodePropertiesKeys.length) {
      let errorObj: errorObj = {
        tname: 'TG',
        errGrp: 'Technical',
        fabric: 'DF',
        errType: 'Fatal',
        errCode: 'TG014',
      };
      const errorMessage: string =
        'Mismatch counts in Nodes and nodeproperties';
      const statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
      let errObj: any = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        dfKey,
        errorMessage,
        statusCode,
      );
      throw errObj;
    }

    const uniqueTables: any[] = [];
    const relData: any[] = [];
    if (componentsId.length > 0) {
      for (let j = 0; j < componentsId.length; j++) {
        tables = nodeProperties[componentsId[j]];
        if (!tables) {
          let errorObj: errorObj = {
            tname: 'TG',
            errGrp: 'Technical',
            fabric: 'DF',
            errType: 'Fatal',
            errCode: 'TG005',
          };
          const errorMessage = 'Invalid DF json data';
          const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          let errObj = await this.commonService.commonErrorLogs(
            errorObj,
            token,
            dfKey,
            errorMessage,
            statusCode,
          );
          throw errObj;
        }
        uniqueTables.push(tables);
        if (!tables.entities) {
          let errorObj: errorObj = {
            tname: 'TG',
            errGrp: 'Technical',
            fabric: 'DF',
            errType: 'Fatal',
            errCode: 'TG005',
          };
          const errorMessage = 'Invalid DF json data';
          const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          let errObj = await this.commonService.commonErrorLogs(
            errorObj,
            token,
            dfKey,
            errorMessage,
            statusCode,
          );
          throw errObj;
        } else if (
          !tables.entities.relationships ||
          !tables.entities.attributes ||
          !tables.entities.methods ||
          !tables.entities.Entity
        ) {
          let errorObj: errorObj = {
            tname: 'TG',
            errGrp: 'Technical',
            fabric: 'DF',
            errType: 'Fatal',
            errCode: 'TG005',
          };
          const errorMessage = 'Invalid DF json data';
          const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          let errObj = await this.commonService.commonErrorLogs(
            errorObj,
            token,
            dfKey,
            errorMessage,
            statusCode,
          );
          throw errObj;
        }
        // console.log(tables);
        if (tables.entities.relationships.length > 0) {
          relData.push(tables.entities.relationships);
        }
        // let relData: any = relation.flatMap((item) => console.log(item));
      }
    }

    let relArray: any[] = [];
    //collecting the tables names , relationships and columns in an array
    if (relData.length > 0) {
      for (let i = 0; i < relData.length; i++) {
        if (relData[i].length > 0) {
          for (let j = 0; j < relData[i].length; j++) {
            let relObj: erObj = {
              sourceEntity: '',
              targetEntity: '',
              sourceColumn: '',
              targetColumn: '',
              Relationship: '',
            };
            let Entities: any = relData[i][j].Entities.split(',');
            relObj.sourceEntity = Entities[0];
            relObj.targetEntity = Entities[1];
            let Column: any = relData[i][j].Coloumn.split(',');
            relObj.sourceColumn = Column[0];
            relObj.targetColumn = Column[1];
            relObj.Relationship = relData[i][j].Relationship;
            relArray.push(relObj);
          }
        }
      }
    }

    /*--------------------- Create Torus_App and Base files   ----------------------------------*/

    //first parameter is template path for ejs file
    //second parameter is data for ejs file
    //thrd parameter is path for created file

    /*--------------------- Create Casl related files   ----------------------------------*/

    // let userMatrixJson: any = JSON.parse(
    //   await this.redisService.getJsonData(sfKey + ':summary'),
    // );
    // arrange the wanted data from casl json in new variable

    // if (!userMatrixJson) {
    //   let errorObj: errorObj = {
    //     tname: 'TG',
    //     errGrp: 'Technical',
    //     fabric: 'SF',
    //     errType: 'Fatal',
    //     errCode: 'TG011',
    //   };
    //   const errorMessage = 'SF key is not valid';
    //   const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    //   let errObj = await this.commonService.commonErrorLogs(
    //     errorObj,
    //     token,
    //     dfKey,
    //     errorMessage,
    //     statusCode,
    //   );
    //   throw errObj;
    // }

    return {
      key: dfKey,
      uniqueTables: uniqueTables,
      relArray: relArray,
      tables: tables,
    };
  }

  async generateDynamicFiles(keys: Keys, data: any, token: string,dataBase: string): Promise<any> {    
    let dfKey: string = keys.dfKey;
    let keyParts: string[] = dfKey.split(':');
    let dataBaseName: string = dataBase;
    const tenantName: string = keyParts[7];
    const appGroupName: string = keyParts[9];
    const appName: string = keyParts[11];
    const version: string = keyParts[13];
    const sessionInfo: sessionInfo = {
      key: dfKey,
      token: token,
    };
    let uniqueTables = data.uniqueTables;
    // console.log(uniqueTables,'unique');

    let relArray = data.relArray;
    const tenantPath: string = path.dirname(
      path.dirname(path.dirname(path.dirname(path.dirname(__dirname)))),
    );
    const tenantPathName: string = path.join(tenantPath, tenantName);
    const appGroupPathName: string = path.join(tenantPathName, appGroupName);
    const appPathName: string = path.join(
      appGroupPathName,
      appName,
      'DF',
      version,
    );
    // console.log(appPathName);
    const AppTemplateCaslPath: string = path.join(appPathName, 'src/ability');
    const srcPathName: string = path.join(appPathName, 'src');
    const prismaPathName: string = path.join(appPathName, 'prisma');

    const uniqueDF = new Set();
    if (uniqueTables.length > 0) {
      uniqueTables.forEach((uniqueTables) => {
        uniqueDF.add(uniqueTables.key);
      });
    }

    if (dataBaseName === 'postgres') {
      await this.TGCommonService.CreateFileWithThreeParam(
        sessionInfo,
        './dist/TG/tg-AppTemplate/tg-df/dynamic/postgres/prisma.ejs',
        uniqueTables,
        relArray,
        '',
        '',
        prismaPathName + '/' + 'schema.prisma',
      );
    }else if (dataBaseName === 'mongoDb') {
      await this.TGCommonService.CreateFileWithThreeParam(
        sessionInfo,
        './dist/TG/tg-AppTemplate/tg-df/dynamic/mongoDb/prisma.ejs',
        uniqueTables,
        relArray,
        '',
        '',
        prismaPathName + '/' + 'schema.prisma',
      );
    }else if (dataBaseName === 'mysql') {
      await this.TGCommonService.CreateFileWithThreeParam(
        sessionInfo,
        './dist/TG/tg-AppTemplate/tg-df/dynamic/mysql/prisma.ejs',
        uniqueTables,
        relArray,
        '',
        '',
        prismaPathName + '/' + 'schema.prisma',
      );
    }


    await this.TGCommonService.CreateSchemaFile(
      sessionInfo,
      './dist/TG/tg-AppTemplate/tg-df/dynamic/ability.guard.ejs',
      keys,
      '',
      AppTemplateCaslPath + '/ability.guard.ts',
    );

    await this.CreateDir(sessionInfo, uniqueTables, srcPathName,dataBaseName);
    return data;
  }

  /**
   * Asynchronously creates entity files based on the provided JSON data.
   *
   * @param {JSON} strReadPath - JSON data containing information about tables
   * @param {String} path - Path where the entity files will be created
   * @param {any} userMatrix - User matrix data
   * @return {Promise<any>} The tables data after the entity files are created
   */
  async CreateDir(sessionInfo: sessionInfo, strReadPath: any, tabPath: any,dataBase: string) {
    let tables: any = strReadPath;
    let dataBaseName: string = dataBase;

    /*--------------------- Create Entity files   ----------------------------------*/

    if (tables.length > 0) {
      for (let i = 0; i < tables.length; i++) {
        let tabName: any = tables[i].entities.Entity;
        let column: any = tables[i];
        let columnForEntity: any = tables[i].entities.attributes;

        await this.TGCommonService.createFolder(tabPath + '/' + tabName);
        await this.TGCommonService.createFolder(
          tabPath + '/' + tabName + '/' + 'entity',
        );

        if (dataBaseName === 'postgres'|| dataBaseName ==='mysql') {          
          await this.TGCommonService.CreateSchemaFile(
            sessionInfo,
            './dist/TG/tg-AppTemplate/tg-df/dynamic/postgres/service.ejs',
            column,
            tabName,
            tabPath + '/' + tabName + '/' + tabName + '.service.ts',
          );
  
          await this.TGCommonService.CreateFileWithThreeParam(
            sessionInfo,
            './dist/TG/tg-AppTemplate/tg-df/dynamic/postgres/controller.ejs',
            column,
            tabName,
            '',
            '',
            tabPath + '/' + tabName + '/' + tabName + '.controller.ts',
          );
          await this.TGCommonService.CreateSchemaFile(
            sessionInfo,
            './dist/TG/tg-AppTemplate/tg-df/dynamic/postgres/enitity.ejs',
            columnForEntity,
            tabName,
            tabPath +
              '/' +
              tabName +
              '/' +
              'entity' +
              '/' +
              tabName +
              '.entity.ts',
          );
        }else if (dataBaseName === 'mongoDb') {
          await this.TGCommonService.CreateSchemaFile(
            sessionInfo,
            './dist/TG/tg-AppTemplate/tg-df/dynamic/mongoDb/service.ejs',
            column,
            tabName,
            tabPath + '/' + tabName + '/' + tabName + '.service.ts',
          );
  
          await this.TGCommonService.CreateFileWithThreeParam(
            sessionInfo,
            './dist/TG/tg-AppTemplate/tg-df/dynamic/mongoDb/controller.ejs',
            column,
            tabName,
            '',
            '',
            tabPath + '/' + tabName + '/' + tabName + '.controller.ts',
          );
          await this.TGCommonService.CreateSchemaFile(
            sessionInfo,
            './dist/TG/tg-AppTemplate/tg-df/dynamic/mongoDb/enitity.ejs',
            columnForEntity,
            tabName,
            tabPath +
              '/' +
              tabName +
              '/' +
              'entity' +
              '/' +
              tabName +
              '.entity.ts',
          );
        }       


        await this.TGCommonService.CreateSchemaFile(
          sessionInfo,
          './dist/TG/tg-AppTemplate/tg-df/dynamic/module.ejs',
          tabName,
          '',
          tabPath + '/' + tabName + '/' + tabName + '.module.ts',
        );
        await this.TGCommonService.CreateSchemaFile(
          sessionInfo,
          './dist/TG/tg-AppTemplate/tg-df/dynamic/app.module.ejs',
          tables,
          '',
          tabPath + '/' + 'app.module.ts',
        );
      }
    }

    // await this.TGCommonService.createFolder(tabPath + '/' + 'default');
    // await this.TGCommonService.createFolder(
    //   tabPath + '/' + 'default' + '/' + 'entity',
    // );
    // await this.TGCommonService.CreateSchemaFile(
    //   sessionInfo,
    //   './dist/TG/tg-AppTemplate/tg-df/static/defaultEntity.ejs',
    //   '',
    //   '',
    //   tabPath + '/' + 'default' + '/' + 'entity' + '/' + 'default.entity.ts',
    // );

    return await tables;
  }

  async mergeData(data) {
    let key: any[] = [];
    let all: object = {};
    let uniqueTables: any[] = [];
    let relArray: any[] = [];
    let tables: any[] = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        uniqueTables.push(...data[i].uniqueTables);
        relArray.push(...data[i].relArray);
        tables.push({ ...data[i].tables });
        key.push(data[i].key);
      }
    }
    all = { key, uniqueTables, relArray, tables };

    return all;
  }
}
