import { HttpStatus, Injectable } from '@nestjs/common';
import { TG_CommonService } from 'src/TG/tg-common/tg-common.service';
import { sessionInfo } from '../Interfaces/sessionInfo.tgCommon.interface';
import { errorObj } from '../Interfaces/errorObj.interface';
import { CommonService } from 'src/commonService';
import * as path from 'path';
import { RedisService } from 'src/redisService';
import { ufGravityCompdetail } from '../Interfaces/ufGravityCompdetail.interface';

@Injectable()
export class TgUfGravityService {
  /**
   * The CgTorusComponentsService class is used to generate a Next application for UF components
   * with the updated security JSON.
   * Initializes a new instance of the class.
   *
   * @param {TG_CommonService} CommonService - The common service.
   * @param {RedisService} redisService - The Redis service.
   */
  constructor(
    private readonly TGCommonService: TG_CommonService,
    private readonly redisService: RedisService,
    private readonly commonService: CommonService,
  ) {}

  /**
   * Generates API files and folders based on the provided key.
   *
   * @param {string} key - The key used for API generation
   * @return {Promise<any>} A promise that resolves to 'OK' when API generation is complete
   */

  async generateStaticFiles(
    keys: any,
    screenNames: string[],
    token: string,
  ): Promise<any> {
    let ejsPath = './dist/TG/tg-AppTemplate/tg-uf-gravity';
    let aKey: string = keys.aKey;
    let sfKey: string = keys.sfKey;
    let ufKey: string = keys.ufKey;
    let keyParts: string[] = aKey.split(':');
    const tenantName: string = keyParts[7];
    const appGroupName: string = keyParts[9];
    const appName: string = keyParts[11];
    const version: string = keyParts[13];
    let sessionInfo: sessionInfo = {
      key: ufKey,
      token: token,
    };
    let eventKey: string = keys.eventKey;

    if (!ufKey && ufKey === '') {
      let errorObj: errorObj = {
        tname: 'TG',
        errGrp: 'Technical',
        fabric: 'UF',
        errType: 'Fatal',
        errCode: 'TG006',
      };
      const errorMessage = 'UF Key not found';
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let errObj = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        ufKey,
        errorMessage,
        statusCode,
      );
      throw errObj;
    }
    // else if (!eventKey || eventKey === '') {
    //   let errorObj: errorObj = {
    //     tname: 'TG',
    //     errGrp: 'Technical',
    //     fabric: 'UF',
    //     errType: 'Fatal',
    //     errCode: 'TG008',
    //   };
    //   const errorMessage = 'Event Key not found';
    //   const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    //   let errObj = await this.commonService.commonErrorLogs(
    //     errorObj,
    //     token,
    //     ufKey,
    //     errorMessage,
    //     statusCode,
    //   );
    //   throw errObj;
    // }
    //create a app inside the created path given below
    //this path is dynamically created based on the provided key

    let tenantPath: string = path.dirname(
      path.dirname(path.dirname(path.dirname(path.dirname(__dirname)))),
    );

    let tenantPathName: string = path.join(tenantPath, tenantName);
    let appGroupPathName: string = path.join(tenantPathName, appGroupName);
    let app_name: string = path.join(appGroupPathName, appName, 'UF', version);

    // await this.TGCommonService.checkAndDeleteFolder(app_name);

    await this.TGCommonService.createFolder(tenantPathName);
    await this.TGCommonService.createFolder(appGroupPathName);
    await this.TGCommonService.createFolder(app_name);
    await this.TGCommonService.createFolder(app_name + '/kubernetes');
    await this.TGCommonService.createFolder(app_name + '/app');
    await this.TGCommonService.createFolder(app_name + '/app' + '/components');
    await this.TGCommonService.createFolder(app_name + '/app' + '/keysets');
    await this.TGCommonService.createFolder(
      app_name + '/app' + '/torusComponents',
    );
    await this.TGCommonService.createFolder(app_name + '/app' + '/assets');
    await this.TGCommonService.createFolder(app_name + '/app' + '/utils');
    await this.TGCommonService.createFolder(app_name + '/app' + '/register');
    await this.TGCommonService.createFolder(app_name + '/app' + '/interfaces');
    await this.TGCommonService.createFolder(
      app_name + '/app' + '/resetPassword',
    );
    await this.TGCommonService.createFolder(
      app_name + '/app' + '/torusStaticHandlers',
    );
    // await this.TGCommonService.createFolder(
    //   app_name + '/app' + '/tenantProfile',
    // );

    let envDetails: any = await this.TGCommonService.getGitRepoUrl('', aKey);
    let gitRepo: string = envDetails.gitRepo;
    if (gitRepo.endsWith('.git')) {
      let url = gitRepo.split('/')[4];
      let appNameForDep: string = url.split('UF')[0];
      await this.TGCommonService.CreateSchemaFile(
        sessionInfo,
        ejsPath + '/deployment/deploymentservice.ejs',
        appNameForDep,
        gitRepo,
        app_name + '/kubernetes' + '/deploymentservice.yaml',
      );
      await this.TGCommonService.CreateSchemaFile(
        sessionInfo,
        ejsPath + '/deployment/Jenkinsfile.ejs',
        appNameForDep,
        gitRepo,
        app_name + '/Jenkinsfile',
      );
      await this.TGCommonService.CreateSchemaFile(
        sessionInfo,
        ejsPath + '/static/env.local.ejs',
        appNameForDep,
        gitRepo,
        app_name + '/.env',
      );
    } else {
      await this.TGCommonService.CreateSchemaFile(
        sessionInfo,
        ejsPath + '/static/env.local.ejs',
        '',
        '',
        app_name + '/.env',
      );
    }
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/deployment/Dockerfile.ejs',
      app_name + '/Dockerfile',
    );

    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/tsconfig.ejs',
      app_name + '/tsconfig.json',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/tailwind.config.ejs',
      app_name + '/tailwind.config.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/README.ejs',
      app_name + '/README.md',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/postcss.config.ejs',
      app_name + '/postcss.config.js',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/package.ejs',
      app_name + '/package.json',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/package-lock.ejs',
      app_name + '/package-lock.json',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/next.config.ejs',
      app_name + '/next.config.js',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/next-env.d.ejs',
      app_name + '/next-env.d.ts',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/prettierrc.ejs',
      app_name + '/.prettierrc',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/npmrc.ejs',
      app_name + '/.npmrc',
    );

    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/gitignore.ejs',
      app_name + '/.gitignore',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/eslintrc.json.ejs',
      app_name + '/.eslintrc.json',
    );
    // await this.TGCommonService.copyFile(
    //   sessionInfo,
    //   ejsPath+'/static/env.ejs',
    //   app_name + '/.env',
    // );

    // return;
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/global.css.ejs',
      app_name + '/app' + '/globals.css',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/registerPage.ejs',
      app_name + '/app' + '/register' + '/page.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/forgotPasswordPage.ejs',
      app_name + '/app' + '/resetPassword' + '/page.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/decodeToken.ejs',
      app_name + '/app' + '/components' + '/decodeToken.tsx',
    );

    // await this.TGCommonService.copyFile(
    //   sessionInfo,
    //   './dist/TG/tg-AppTemplate/tg-uf/static/IconsHead.ejs',
    //   app_name + '/app' + '/components' + '/IconsHead.tsx',
    // );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/logo.ejs',
      app_name + '/app' + '/components' + '/Logo.tsx',
    );
    // await this.TGCommonService.copyFile(
    //   sessionInfo,
    //   ejsPath+'/static/tenantProfile.ejs',
    //   app_name + '/app' + '/tenantProfile' + '/page.tsx',
    // );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/register.ejs',
      app_name + '/app' + '/components' + '/register.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/providers.ejs',
      app_name + '/app' + '/components' + '/providers.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/axiosService.ejs',
      app_name + '/app' + '/components' + '/axiosService.tsx',
    );
    // return;
    // await this.TGCommonService.copyFile(
    //   sessionInfo,
    //   ejsPath+'/static/appSelector.ejs',
    //   app_name + '/app' + '/components' + '/appSelector.tsx',
    // );
    // return;
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/cookieMgment.ejs',
      app_name + '/app' + '/components' + '/cookieMgment.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/serverFunctions.ejs',
      app_name + '/app' + '/torusComponents' + '/serverFunctions.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/themeSwitcher.ejs',
      app_name + '/app' + '/components' + '/ThemeSwitcher.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/themeS.ejs',
      app_name + '/app' + '/components' + '/ThemeS.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/languageContext.ejs',
      app_name + '/app' + '/components' + '/languageContext.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/i18n.ejs',
      app_name + '/app' + '/components' + '/i18n.tsx',
    );

    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/language/ar.json.ejs',
      app_name + '/app' + '/keysets' + '/ar.json',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/language/ta.json.ejs',
      app_name + '/app' + '/keysets' + '/ta.json',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/language/en.json.ejs',
      app_name + '/app' + '/keysets' + '/en.json',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/language/fr.json.ejs',
      app_name + '/app' + '/keysets' + '/fr.json',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/language/ru.json.ejs',
      app_name + '/app' + '/keysets' + '/ru.json',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/interfaces.ejs',
      app_name + '/app' + '/interfaces' + '/interfaces.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/layout.ejs',
      app_name + '/app' + '/layout.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/mainPage.ejs',
      app_name + '/app' + '/page.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/logout.ejs',
      app_name + '/app' + '/components' + '/logout.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/utils/Image.png',
      app_name + '/app' + '/utils' + '/Image.png',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/utils/svgApplications.jsx',
      app_name + '/app' + '/utils' + '/svgApplications.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/utils/nullDataFilter.ejs',
      app_name + '/app' + '/utils' + '/nullDataFilter.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/codeExecution.ejs',
      app_name + '/app' + '/utils' + '/codeExecution.tsx',
    );
    await this.TGCommonService.CreateSchemaFile(
      sessionInfo,
      ejsPath + '/dynamic/login.ejs',
      screenNames,
      '',
      app_name + '/app' + '/components' + '/login.tsx',
    );
    await this.TGCommonService.CreateFileWithThreeParam(
      sessionInfo,
      ejsPath + '/static/loginForm.ejs',
      '',
      screenNames,
      '',
      '',
      app_name + '/app' + '/components' + '/loginForm.tsx',
    );
    // await this.TGCommonService.CreateFileWithThreeParam(
    //   sessionInfo,
    //   ejsPath+'/dynamic/appList.ejs',
    //   '',
    //   screenNames,
    //   keys,
    //   '',
    //   app_name + '/app' + '/components' + '/appList.tsx',
    // );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/infoMsg.ejs',
      app_name + '/app' + '/torusStaticHandlers' + '/infoMsgHandler.tsx',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/assets/favicon.ico',
      app_name + '/app' + '/assets' + '/favicon.ico',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/assets/unfinished.webp',
      app_name + '/app' + '/assets' + '/unfinished.webp',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/assets/github.png',
      app_name + '/app' + '/assets' + '/github.png',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/assets/google.png',
      app_name + '/app' + '/assets' + '/google.png',
    );
    await this.TGCommonService.copyFile(
      sessionInfo,
      ejsPath + '/static/navBar.ejs',
      app_name + '/app' + '/components' + '/navBar.tsx',
    );

    return app_name;
  }

  async generateScreenSpecificFiles(
    keys,
    token,
    showProfileScreen = '',
    route = '',
  ) {
    let ejsPath = './src/TG/tg-AppTemplate/tg-uf-gravity';
    let aKey: string = keys.aKey;
    let ufKey: string = keys.ufKey;
    let screenName: string;
    let keyParts: string[] = aKey.split(':');
    const tenantName: string = keyParts[7];
    const appGroupName: string = keyParts[9];
    const appName: string = keyParts[11];
    const version: string = keyParts[13];
    const source: string = 'redis';
    const target: string = 'redis';
    let sessionInfo: sessionInfo = {
      key: keys.ufKey,
      token: token,
    };
    if (!ufKey && ufKey === '') {
      let errorObj: errorObj = {
        tname: 'TG',
        errGrp: 'Technical',
        fabric: 'UF',
        errType: 'Fatal',
        errCode: 'TG006',
      };
      const errorMessage = 'UF Key not found';
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let errObj = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        ufKey,
        errorMessage,
        statusCode,
      );
      throw errObj;
    }
    const nodes: any = await this.TGCommonService.readAPI(
      ufKey + ':UFS',
      source,
      target,
    );

    // nodes.sort((a, b) => parseFloat(a.grid.order) - parseFloat(b.grid.order));
    // console.log(nodes);

    const DO: any = await this.TGCommonService.readAPI(
      ufKey + ':UO',
      source,
      target,
    );

    let eventProperties: any = DO.mappedData?.artifact?.node;
    if (!eventProperties || eventProperties === '') {
      console.log(ufKey);

      console.log('-------------------------');

      let errorObj: errorObj = {
        tname: 'TG',
        errGrp: 'Technical',
        fabric: 'UF',
        errType: 'Fatal',
        errCode: 'TG007',
      };
      const errorMessage: string = 'Invalid UF key';
      const statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
      let errObj: any = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        ufKey,
        errorMessage,
        statusCode,
      );
      throw errObj;
    }

    if (!nodes || nodes === '') {
      let errorObj: errorObj = {
        tname: 'TG',
        errGrp: 'Technical',
        fabric: 'UF',
        errType: 'Fatal',
        errCode: 'TG015',
      };
      const errorMessage: string = 'Node json not found';
      const statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
      let errObj: any = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        ufKey,
        errorMessage,
        statusCode,
      );
      throw errObj;
    }
    const tenantPath: string = path.dirname(
      path.dirname(path.dirname(path.dirname(path.dirname(__dirname)))),
    );
    const tenantPathName: string = path.join(tenantPath, tenantName);

    const appGroupPathName: string = path.join(tenantPathName, appGroupName);
    const app_name: string = path.join(
      appGroupPathName,
      appName,
      'UF',
      version,
    );

    const componentsId: string[] = [];
    const groupComponentsNames: any[] = [];
    const groupComponentsId: string[] = [];
    const layoutGroupId: string[] = [];
    const pageGroupId: string[] = [];
    const compDetails: any[] = [];
    const navbarData: any = keys.navbarData;
    // console.log("🚀 ~ TgUfGravityService ~ generateScreenSpecificFiles ~ navbarData:", navbarData)

    // return navbarData
    if (
      showProfileScreen == '' ||
      showProfileScreen == null ||
      showProfileScreen == undefined
    ) {
      navbarData.forEach((item) => {
        item.screenDetails.forEach((screen) => {
          if (ufKey === screen.key) {
            screenName = screen.name.replace(/ /g, '_');
          }
        });
      });
    } else {
      screenName = showProfileScreen;
    }

    if (nodes.length > 0) {
      for (let i = 0; i < nodes.length; i++) {
        componentsId.push(nodes[i].id);
        if (
          nodes[i].id === nodes[i].T_parentId &&
          nodes[i].type.toLowerCase() === 'group'
        ) {
          if (
            nodes[i].id === nodes[i].T_parentId &&
            nodes[i].groupType.toLowerCase() === 'table'
          ) {
            groupComponentsNames.push({
              name: nodes[i].label + nodes[i].id.slice(-5),
              type: 'table',
            });
          } else {
            groupComponentsNames.push({
              name: nodes[i].label + nodes[i].id.slice(-5),
              type: 'group',
            });
          }
          groupComponentsId.push(nodes[i].id);
        }
      }
    }
    for (let i = 0; i < groupComponentsId.length; i++) {
      const compDetail: ufGravityCompdetail = {
        componentsId: '',
        label: '',
        controls: [],
        layoutFlag: '',
        grid: {
          columnStart: 0,
          columnEnd: 0,
          rowStart: 0,
          rowEnd: 0,
          gap: '',
        },
        height: 0,
        isTable: false,
      };
      if (nodes.length > 0) {
        for (let j = 0; j < nodes.length; j++) {
          if (nodes[j].T_parentId.includes(groupComponentsId[i])) {
            compDetail.componentsId = nodes[j].T_parentId;
            for (let k = 0; k < nodes.length; k++) {
              if (nodes[j].T_parentId === nodes[k].id) {
                compDetail.layoutFlag = nodes[k].layoutFlag;
                compDetail.grid.columnStart = nodes[k].grid.column.start;
                compDetail.grid.columnEnd = nodes[k].grid.column.end;
                compDetail.grid.rowStart = nodes[k].grid.row.start;
                compDetail.grid.rowEnd = nodes[k].grid.row.end;
                compDetail.grid.gap = nodes[k].grid.style.gap;
                compDetail.label = nodes[k].label;
                if (nodes[k].groupType === 'table') {
                  compDetail.isTable = true;
                } else {
                  compDetail.isTable = false;
                }
              }
            }
            if (nodes[j].T_parentId !== nodes[j].id) {
              compDetail.controls.push(nodes[j].id);
            }
          }
        }
      }
      compDetails.push(compDetail);
    }
    // console.log("🚀 ~ TgUfGravityService ~ generateScreenSpecificFiles ~ compDetails:", compDetails)

    for (let i = 0; i < compDetails.length; i++) {
      if (compDetails[i].layoutFlag === 'no') {
        pageGroupId.push(compDetails[i].componentsId);
      } else {
        layoutGroupId.push(compDetails[i].componentsId);
      }
    }

    await this.TGCommonService.createFolder(
      app_name + '/app' + '/' + screenName,
    );
    await this.TGCommonService.createFolder(
      app_name + '/app' + '/' + screenName + '/' + 'GroupNav', //nodeProperties[compDetails[i].componentsId].nodeName,
    );
    await this.TGCommonService.CreateFileWithThreeParam(
      sessionInfo,
      ejsPath + '/dynamic/groupNav.ejs',
      navbarData, //navbarData,
      '',
      '', //nodeProperties[compDetails[i].componentsId].nodeName,
      '',
      app_name +
        '/app' +
        '/' +
        screenName +
        '/' +
        'GroupNav' +
        '/' +
        'GroupNav' + // nodeProperties[compDetails[i].componentsId].nodeName +
        '.tsx',
    );

    if (
      showProfileScreen == '' ||
      showProfileScreen == null ||
      showProfileScreen == undefined
    ) {
      console.log('normal');
      console.log(app_name + '/app' + '/' + screenName + '/page.tsx');
      console.log(keys);

      await this.TGCommonService.CreateFileWithThreeParam(
        sessionInfo,
        ejsPath + '/dynamic/compPage.ejs',
        pageGroupId,
        nodes,
        screenName,
        keys,
        app_name + '/app' + '/' + screenName + '/page.tsx',
      );
    } else if (route == 'route') {
      console.log('route');
      await this.TGCommonService.CreateFileWithThreeParam(
        sessionInfo,
        ejsPath + '/dynamic/compPage.ejs',
        pageGroupId,
        nodes,
        screenName,
        keys,
        app_name + '/app' + '/' + screenName + `/page.tsx`,
      );
    } else {
      console.log('modal');
      console.log(
        app_name + '/app' + '/' + screenName + `/${screenName}page.tsx`,
      );
      console.log(keys);
      await this.TGCommonService.CreateFileWithThreeParam(
        sessionInfo,
        ejsPath + '/dynamic/compPage.ejs',
        pageGroupId,
        nodes,
        screenName,
        keys,
        app_name + '/app' + '/' + screenName + `/${screenName}page.tsx`,
      );
    }
    if (
      showProfileScreen == '' ||
      showProfileScreen == null ||
      showProfileScreen == undefined
    ) {
      await this.TGCommonService.CreateFileWithThreeParam(
        sessionInfo,
        ejsPath + '/dynamic/compLayout.ejs',
        layoutGroupId,
        nodes,
        '',
        '',
        app_name + '/app' + '/' + screenName + '/layout.tsx',
      );
    }

    let stateAndSetStatePre: any = [];

    for (let i = 0; i < compDetails.length; i++) {
      stateAndSetStatePre = [
        ...stateAndSetStatePre,
        {
          [compDetails[i].label + 'Data']:
            'set' + compDetails[i].label + 'Data',
        },
      ];
    }
    // console.log(stateAndSetStatePre);

    for (let i = 0; i < compDetails.length; i++) {
      await this.TGCommonService.createFolder(
        app_name +
          '/app' +
          '/' +
          screenName +
          '/' +
          'Group' +
          compDetails[i].label, //nodeProperties[compDetails[i].componentsId].nodeName,
      );

      if (
        !eventProperties[i].events.eventSummary ||
        eventProperties[i].events.eventSummary === ''
      ) {
        await this.TGCommonService.CreateFileWithThreeParam(
          sessionInfo,
          ejsPath + '/dynamic/groupComponent.ejs',
          compDetails[i],
          nodes,
          [keys, '', '', stateAndSetStatePre],
          compDetails[i].label, //nodeProperties[compDetails[i].componentsId].nodeName,
          app_name +
            '/app' +
            '/' +
            screenName +
            '/' +
            'Group' +
            compDetails[i].label + // nodeProperties[compDetails[i].componentsId].nodeName +
            '/' +
            'Group' +
            compDetails[i].label + // nodeProperties[compDetails[i].componentsId].nodeName +
            '.tsx',
        );
        if (compDetails[i].isTable) {
          for (let j = 0; j < nodes.length; j++) {
            if (compDetails[i].componentsId === nodes[j].id) {
              let columnsArray: any[] = [];
              for (let k = 0; k < nodes.length; k++) {
                if (
                  nodes[j].id === nodes[k].T_parentId &&
                  nodes[k].type === 'column'
                ) {
                  let columnDetails: any = {};
                  columnDetails.id = nodes[k].elementInfo.id;
                  // columnDetails.header = nodes[k].elementInfo.header;
                  columnDetails.name = nodes[k].elementInfo.header;
                  columnDetails.type = nodes[k].elementInfo.type;
                  columnDetails.meta = { sort: true };
                  columnsArray.push(columnDetails);
                }
              }
              let isPivotTable = 'false';
              for (let i = 0; i < nodes[j].elementInfo.props.length; i++) {
                if (nodes[j].elementInfo.props[i].name === 'isPivotTable')
                  isPivotTable =
                    nodes[j]?.elementInfo?.props[i]?.enum?.selectedValue[0];
              }
              if (isPivotTable === 'true') {
                // console.log('+++++++++++++++++++++++eventDetailsArray');
                await this.TGCommonService.CreateFileWithThreeParam(
                  sessionInfo,
                  ejsPath + '/dynamic/customTable.ejs',
                  nodes[j],
                  columnsArray,
                  [keys, '', '', stateAndSetStatePre, nodes],
                  compDetails[i].label,
                  app_name +
                    '/app' +
                    '/' +
                    screenName +
                    '/' +
                    'Group' +
                    compDetails[i].label +
                    '/Table' +
                    nodes[j].label +
                    '.tsx',
                );
              } else {
                await this.TGCommonService.CreateFileWithThreeParam(
                  sessionInfo,
                  ejsPath + '/dynamic/table.ejs',
                  nodes[j],
                  columnsArray,
                  [keys, '', '', stateAndSetStatePre, nodes],
                  compDetails[i],
                  app_name +
                    '/app' +
                    '/' +
                    screenName +
                    '/' +
                    'Group' +
                    compDetails[i].label +
                    '/Table' +
                    nodes[j].label +
                    '.tsx',
                );
              }

              await this.TGCommonService.copyFile(
                sessionInfo,
                ejsPath + '/dynamic/TableTopContent.ejs',
                app_name + '/app' + '/components' + '/TableTopContent.tsx',
              );
              await this.TGCommonService.copyFile(
                sessionInfo,
                ejsPath + '/dynamic/DeleteData.ejs',
                app_name + '/app' + '/components' + '/DeleteData.tsx',
              );
              await this.TGCommonService.CreateFileWithThreeParam(
                sessionInfo,
                ejsPath + '/dynamic/EditTableData.ejs',
                nodes[j].elementInfo,
                keys,
                '',
                '',
                app_name + '/app' + '/components' + '/EditTableData.tsx',
              );
            }
          }
        }
      } else if (
        eventProperties[i].nodeName == compDetails[i].label &&
        eventProperties[i].events.eventSummary
      ) {
        let eventDetails: any = await this.TGCommonService.eventFunction(
          eventProperties[i].events.eventSummary,
        );
        let eventDetailsArray = eventDetails[0];
        let eventDetailsObj = eventDetails[1];
        await this.TGCommonService.CreateFileWithThreeParam(
          sessionInfo,
          ejsPath + '/dynamic/groupComponent.ejs',
          compDetails[i],
          nodes,
          [keys, eventDetailsArray, eventDetailsObj, stateAndSetStatePre],
          compDetails[i].label, //nodeProperties[compDetails[i].componentsId].nodeName,
          app_name +
            '/app' +
            '/' +
            screenName +
            '/' +
            'Group' +
            compDetails[i].label + // nodeProperties[compDetails[i].componentsId].nodeName +
            '/' +
            'Group' +
            compDetails[i].label + // nodeProperties[compDetails[i].componentsId].nodeName +
            '.tsx',
        );
        if (compDetails[i].isTable) {
          for (let j = 0; j < nodes.length; j++) {
            if (compDetails[i].componentsId === nodes[j].id) {
              let columnsArray: any[] = [];
              for (let k = 0; k < nodes.length; k++) {
                if (
                  nodes[j].id === nodes[k].T_parentId &&
                  nodes[k].type === 'column'
                ) {
                  let columnDetails: any = {};
                  columnDetails.id = nodes[k].elementInfo.id;
                  // columnDetails.header = nodes[k].elementInfo.header;
                  columnDetails.name = nodes[k].elementInfo.header;
                  columnDetails.type = nodes[k].elementInfo.type;
                  columnDetails.meta = { sort: true };
                  columnsArray.push(columnDetails);
                }
              }
              // console.log("🚀 ~ TgUfGravityService ~ generateScreenSpecificFiles ~ columnsArray:", columnsArray)
              let isPivotTable = 'false';
              for (let i = 0; i < nodes[j].elementInfo.props.length; i++) {
                if (nodes[j].elementInfo.props[i].name === 'isPivotTable')
                  isPivotTable =
                    nodes[j]?.elementInfo?.props[i]?.enum?.selectedValue[0];
              }
              if (isPivotTable === 'true') {
                await this.TGCommonService.CreateFileWithThreeParam(
                  sessionInfo,
                  ejsPath + '/dynamic/customTable.ejs',
                  nodes[j],
                  columnsArray,
                  [
                    keys,
                    eventDetailsArray,
                    eventDetailsObj,
                    stateAndSetStatePre,
                    nodes,
                  ],
                  compDetails[i].label,
                  app_name +
                    '/app' +
                    '/' +
                    screenName +
                    '/' +
                    'Group' +
                    compDetails[i].label +
                    '/Table' +
                    nodes[j].label +
                    '.tsx',
                );
              } else {
                await this.TGCommonService.CreateFileWithThreeParam(
                  sessionInfo,
                  ejsPath + '/dynamic/table.ejs',
                  nodes[j],
                  columnsArray,
                  [
                    keys,
                    eventDetailsArray,
                    eventDetailsObj,
                    stateAndSetStatePre,
                    nodes,
                  ],
                  compDetails[i],
                  app_name +
                    '/app' +
                    '/' +
                    screenName +
                    '/' +
                    'Group' +
                    compDetails[i].label +
                    '/Table' +
                    nodes[j].label +
                    '.tsx',
                );
              }

              await this.TGCommonService.copyFile(
                sessionInfo,
                ejsPath + '/dynamic/TableTopContent.ejs',
                app_name + '/app' + '/components' + '/TableTopContent.tsx',
              );
              // await this.TGCommonService.copyFile(
              //   sessionInfo,
              //   ejsPath+'/dynamic/CustomePagination.ejs',
              //   app_name + '/app' + '/components' + '/CustomePagination.tsx',
              // );
              await this.TGCommonService.copyFile(
                sessionInfo,
                ejsPath + '/dynamic/DeleteData.ejs',
                app_name + '/app' + '/components' + '/DeleteData.tsx',
              );
              await this.TGCommonService.CreateFileWithThreeParam(
                sessionInfo,
                ejsPath + '/dynamic/EditTableData.ejs',
                nodes[j].elementInfo,
                keys,
                '',
                '',
                app_name + '/app' + '/components' + '/EditTableData.tsx',
              );
            }
          }
        }
      }
      // console.log(compDetails[i].label);

      if (nodes.length > 0) {
        for (let j = 0; j < nodes.length; j++) {
          if (nodes[j].T_parentId === compDetails[i].componentsId) {
            if (nodes[j].elementInfo.component === 'Avatar') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].elementInfo.label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/avatar.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Avatar' +
                                nodes[j].elementInfo.label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/avatar.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Avatar' +
                                nodes[j].elementInfo.label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            if (nodes[j].elementInfo.component === 'Button') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];
                            let showProfileAsModalSCRkey = '';
                            let showProfileAsModalSCRName = '';
                            let showProfileSCRkey = '';
                            let showProfileSCRName = '';

                            for (let i = 0; i < eventDetailsArray.length; i++) {
                              if (
                                eventDetailsArray[i].type === 'handlerNode' &&
                                eventDetailsArray[i].name ===
                                  'showProfileAsModal'
                              ) {
                                if (eventDetailsArray[i + 1]?.name) {
                                  showProfileAsModalSCRName =
                                    eventDetailsArray[i + 1].name.split('.')[0];
                                  showProfileAsModalSCRkey =
                                    eventDetailsArray[i + 1].key;
                                }
                              } else if (
                                eventDetailsArray[i].type === 'handlerNode' &&
                                eventDetailsArray[i].name === 'showProfile'
                              ) {
                                if (eventDetailsArray[i + 1]?.name) {
                                  showProfileSCRName =
                                    eventDetailsArray[i + 1].name.split('.')[0];
                                  showProfileSCRkey =
                                    eventDetailsArray[i + 1].key;
                                }
                              }
                            }
                            if (
                              showProfileAsModalSCRkey != '' &&
                              showProfileAsModalSCRName != ''
                            ) {
                              const isPresent = await this.isPresentInAssembler(
                                aKey,
                                showProfileAsModalSCRkey,
                              );
                              if (isPresent == false) {
                                let tempKey = structuredClone(keys);
                                tempKey.ufKey = showProfileAsModalSCRkey;
                                let statesName: any =
                                  await this.generateScreenSpecificFiles(
                                    tempKey,
                                    token,
                                    showProfileAsModalSCRName,
                                  );
                                groupComponentsNames.push(...statesName);
                              }
                            }
                            if (
                              showProfileSCRkey != '' &&
                              showProfileSCRName != ''
                            ) {
                              const isPresent = await this.isPresentInAssembler(
                                aKey,
                                showProfileSCRkey,
                              );
                              if (isPresent == false) {
                                let tempKey = structuredClone(keys);
                                tempKey.ufKey = showProfileSCRkey;
                                let statesName: any =
                                  await this.generateScreenSpecificFiles(
                                    tempKey,
                                    token,
                                    showProfileSCRName,
                                    'route',
                                  );

                                groupComponentsNames.push(...statesName);
                              }
                            }
                            console.log(compDetails[i].label, 'withEvent');

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/button.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Button' +
                                nodes[j].label +
                                '.tsx',
                            );
                            break;
                          } else {
                            console.log(compDetails[i].label, 'withOutEvent');
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/button.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Button' +
                                nodes[j].label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            if (nodes[j].elementInfo.component === 'Card') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/card.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Card' +
                                nodes[j].label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/card.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Card' +
                                nodes[j].label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'Checkbox') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/checkbox.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Checkbox' +
                                nodes[j].label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/checkbox.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Checkbox' +
                                nodes[j].label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'DatePicker') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/datePicker.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/DatePicker' +
                                nodes[j].label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/datePicker.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/DatePicker' +
                                nodes[j].label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'Dropdown') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/dropdown.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Dropdown' +
                                nodes[j].label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/dropdown.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Dropdown' +
                                nodes[j].label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'Icon') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].elementInfo.label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/icon.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Icon' +
                                nodes[j].elementInfo.label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/icon.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Icon' +
                                nodes[j].elementInfo.label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'Label') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/label.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Label' +
                                nodes[j].label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/label.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Label' +
                                nodes[j].label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'List') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].elementInfo.label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/list.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/List' +
                                nodes[j].elementInfo.label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/list.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/List' +
                                nodes[j].elementInfo.label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'Pagination') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].elementInfo.label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/pagination.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Pagination' +
                                nodes[j].elementInfo.label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/pagination.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Pagination' +
                                nodes[j].elementInfo.label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'PinInput') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/pinInput.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/PinInput' +
                                nodes[j].label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/pinInput.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/PinInput' +
                                nodes[j].label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'Progress') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].elementInfo.label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/progress.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Progress' +
                                nodes[j].elementInfo.label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/progress.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Progress' +
                                nodes[j].elementInfo.label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'RadioButton') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;
                          // console.log("?? ~ TgUfGravityService ~ generateScreenSpecificFiles ~ eventProperty:", eventProperty)

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/radioButton.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/RadioButton' +
                                nodes[j].label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/radioButton.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/RadioButton' +
                                nodes[j].label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'RadioGroup') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/radioGroup.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/RadioGroup' +
                                nodes[j].label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/radioGroup.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i].label,
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/RadioGroup' +
                                nodes[j].label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'Switch') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/switch.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Switch' +
                                nodes[j].label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/switch.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/Switch' +
                                nodes[j].label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            // if (nodes[j].elementInfo.component === 'Table') {
            //   for (let k = 0; k < nodes.length; k++) {
            //     if (nodes[j].T_parentId === nodes[k].id) {
            //       for (let l = 0; l < eventProperties.length; l++) {
            //         console.log("////////////////////////");

            //         console.log( eventProperties[l].nodeName , compDetails[i].label);

            //         if (eventProperties[l].nodeName === compDetails[i].label) {
            //           for (
            //             let m = 0;
            //             m < eventProperties[l].objElements.length;
            //             m++
            //           ) {
            //             if (
            //               eventProperties[l].objElements[
            //                 m
            //               ].elementName.toLowerCase() ===
            //               nodes[j].elementInfo.label.toLowerCase()
            //             ) {
            //               let eventProperty: any =
            //                 eventProperties[l].objElements[m].events
            //                   .eventSummary;

            //               if (
            //                 eventProperty !== null &&
            //                 eventProperty !== undefined
            //               ) {
            //                 let eventDetails: any =
            //                   await this.TGCommonService.eventFunction(
            //                     eventProperty,
            //                   );
            //                 let eventDetailsArray = eventDetails[0];
            //                 let eventDetailsObj = eventDetails[1];

            //                 console.log(JSON.stringify(eventDetailsArray));

            //                 await this.TGCommonService.CreateFileWithThreeParam(
            //                   sessionInfo,
            //                   ejsPath+'/dynamic/table.ejs',
            //                   nodes[j],
            //                   '',
            //                   [
            //                     keys,
            //                     eventDetailsArray,
            //                     eventDetailsObj,
            //                     stateAndSetStatePre,
            //                   ],
            //                   compDetails[i].label,
            //                   app_name +
            //                     '/app' +
            //                     '/' +
            //                     screenName +
            //                     '/' +
            //                     'Group' +
            //                     compDetails[i].label +
            //                     '/Table' +
            //                     nodes[j].elementInfo.label +
            //                     '.tsx',
            //                 );
            //                 await this.TGCommonService.copyFile(
            //                   sessionInfo,
            //                   ejsPath+'/dynamic/TableTopContent.ejs',
            //                   app_name +
            //                     '/app' +
            //                     '/components' +
            //                     '/TableTopContent.tsx',
            //                 );
            //                 await this.TGCommonService.copyFile(
            //                   sessionInfo,
            //                   ejsPath+'/dynamic/CustomePagination.ejs',
            //                   app_name +
            //                     '/app' +
            //                     '/components' +
            //                     '/CustomePagination.tsx',
            //                 );
            //                 await this.TGCommonService.copyFile(
            //                   sessionInfo,
            //                   ejsPath+'/dynamic/DeleteData.ejs',
            //                   app_name +
            //                     '/app' +
            //                     '/components' +
            //                     '/DeleteData.tsx',
            //                 );
            //                 await this.TGCommonService.CreateFileWithThreeParam(
            //                   sessionInfo,
            //                   ejsPath+'/dynamic/EditTableData.ejs',
            //                   nodes[j].elementInfo,
            //                   keys,
            //                   '',
            //                   '',
            //                   app_name +
            //                     '/app' +
            //                     '/components' +
            //                     '/EditTableData.tsx',
            //                 );
            //                 break;
            //               } else {
            //                 await this.TGCommonService.CreateFileWithThreeParam(
            //                   sessionInfo,
            //                   ejsPath+'/dynamic/table.ejs',
            //                   nodes[j],
            //                   '',
            //                   [keys, '', '', stateAndSetStatePre],
            //                   compDetails[i].label,
            //                   app_name +
            //                     '/app' +
            //                     '/' +
            //                     screenName +
            //                     '/' +
            //                     'Group' +
            //                     compDetails[i].label +
            //                     '/Table' +
            //                     nodes[j].elementInfo.label +
            //                     '.tsx',
            //                 );
            //                 await this.TGCommonService.copyFile(
            //                   sessionInfo,
            //                   ejsPath+'/dynamic/TableTopContent.ejs',
            //                   app_name +
            //                     '/app' +
            //                     '/components' +
            //                     '/TableTopContent.tsx',
            //                 );
            //                 await this.TGCommonService.copyFile(
            //                   sessionInfo,
            //                   ejsPath+'/dynamic/CustomePagination.ejs',
            //                   app_name +
            //                     '/app' +
            //                     '/components' +
            //                     '/CustomePagination.tsx',
            //                 );
            //                 await this.TGCommonService.copyFile(
            //                   sessionInfo,
            //                   ejsPath+'/dynamic/DeleteData.ejs',
            //                   app_name +
            //                     '/app' +
            //                     '/components' +
            //                     '/DeleteData.tsx',
            //                 );
            //                 await this.TGCommonService.CreateFileWithThreeParam(
            //                   sessionInfo,
            //                   ejsPath+'/dynamic/EditTableData.ejs',
            //                   nodes[j].elementInfo,
            //                   keys,
            //                   '',
            //                   '',
            //                   app_name +
            //                     '/app' +
            //                     '/components' +
            //                     '/EditTableData.tsx',
            //                 );
            //               }
            //             }
            //           }
            //         }
            //       }
            //     }
            //   }
            // }
            if (nodes[j].elementInfo.component === 'TextArea') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[m].elementName ===
                          nodes[j].label
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];

                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/textarea.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/TextArea' +
                                nodes[j].label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/textarea.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/TextArea' +
                                nodes[j].label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (nodes[j].elementInfo.component === 'TextInput') {
              for (let k = 0; k < nodes.length; k++) {
                if (nodes[j].T_parentId === nodes[k].id) {
                  for (let l = 0; l < eventProperties.length; l++) {
                    if (eventProperties[l].nodeName === compDetails[i].label) {
                      for (
                        let m = 0;
                        m < eventProperties[l].objElements.length;
                        m++
                      ) {
                        if (
                          eventProperties[l].objElements[
                            m
                          ].elementName.toLowerCase() ===
                          nodes[j].label.toLowerCase()
                        ) {
                          let eventProperty: any =
                            eventProperties[l].objElements[m].events
                              .eventSummary;

                          if (
                            eventProperty !== null &&
                            eventProperty !== undefined
                          ) {
                            let eventDetails: any =
                              await this.TGCommonService.eventFunction(
                                eventProperty,
                              );
                            let eventDetailsArray = eventDetails[0];
                            let eventDetailsObj = eventDetails[1];
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/textInput.ejs',
                              nodes[j],
                              nodes,
                              [
                                keys,
                                eventDetailsArray,
                                eventDetailsObj,
                                stateAndSetStatePre,
                              ],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/TextInput' +
                                nodes[j].label +
                                '.tsx',
                            );
                            break;
                          } else {
                            await this.TGCommonService.CreateFileWithThreeParam(
                              sessionInfo,
                              ejsPath + '/dynamic/textInput.ejs',
                              nodes[j],
                              nodes,
                              [keys, '', '', stateAndSetStatePre],
                              compDetails[i],
                              app_name +
                                '/app' +
                                '/' +
                                screenName +
                                '/' +
                                'Group' +
                                compDetails[i].label +
                                '/TextInput' +
                                nodes[j].label +
                                '.tsx',
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            // if (nodes[j].elementInfo.component === 'TimeInput') {
            //   for (let k = 0; k < nodes.length; k++) {
            //     if (nodes[j].T_parentId === nodes[k].id) {
            //       await this.TGCommonService.CreateFileWithThreeParam(
            //         sessionInfo,
            //         './dist/TG/tg-AppTemplate/tg-uf/dynamic/timeInput.ejs',
            //         nodes[j].elementInfo,
            //         nodes[j],
            //         '',
            //         nodes[k],
            //         app_name +
            //           '/app' +
            //           '/' +
            //           screenName +
            //           '/' +
            //           'Group' +
            //           compDetails[i].label +
            //           '/TimeInput' +
            //           nodes[j].elementInfo.label +
            //           '.tsx',
            //       );
            //     }
            //   }
            // }
          }
        }
      }
    }
    keys;

    return groupComponentsNames;
  }

  async isPresentInAssembler(key: string, showProfile: any) {
    const assemblerJson: any = await this.TGCommonService.readAPI(
      key,
      'redis',
      'redis',
    );

    if (assemblerJson && showProfile != '') {
      if (assemblerJson.artifactList.length > 0) {
        for (let p = 0; p < assemblerJson.artifactList.length; p++) {
          let artifacts = assemblerJson.artifactList[p];
          for (let o = 0; o < artifacts.items.length; o++) {
            if (artifacts?.items[o]?.keys?.uf == showProfile) return true;
          }
        }
      }
    }
    return false;
  }
}
