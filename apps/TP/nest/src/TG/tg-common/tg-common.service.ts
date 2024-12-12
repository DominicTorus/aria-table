import { HttpStatus, Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { CommonService } from 'src/commonService';
import { errorObj } from '../Interfaces/errorObj.interface';
import { sessionInfo } from '../Interfaces/sessionInfo.tgCommon.interface';
import { redis } from 'src/redisService';
import { readAPIDTO, setAPIDTO } from 'src/TE/Dto/input';
import axios from 'axios';
import * as path from 'path';
import * as git from 'isomorphic-git';
import * as http from 'isomorphic-git/http/node';

@Injectable()
export class TG_CommonService {
  constructor(private readonly commonService: CommonService) {}

  async eventFunction(eventProperty: any) {
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
  /**
   * Asynchronously creates a schema file based on the provided template, data, relation, and path.
   *
   * @param {any} template - The template used for schema creation.
   * @param {any} data - The data to be used in the schema.
   * @param {any} relation - The relation of the schema.
   * @param {string} path - The path where the schema file will be written.
   * @return {void} This function does not return a value.
   */
  async CreateSchemaFile(
    sessionInfo: sessionInfo,
    sourcePath: string,
    data: any,
    relation: any,
    targetPath: string,
  ) {
    const token = sessionInfo.token;
    const keys = sessionInfo.key;
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
      let errObj = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        keys,
        errorMessage,
        statusCode,
      );
      throw error;
    }
  }

  /**
   * Asynchronously reads the contents of a file at the specified path and returns it as a string.
   *
   * @param {any} strReadPath - The path of the file to be read.
   * @return {Promise<string>} A promise that resolves to the contents of the file as a string.
   * @throws {Error} If there is an error reading the file.
   */
  async ReadFile(filePath: string, sessionInfo: sessionInfo) {
    const token: string = sessionInfo.token;
    const keys: string = sessionInfo.key;
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
      let errObj: any = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        keys,
        errorMessage,
        statusCode,
      );
      throw error;
    }
  }

  /**
   * Asynchronously creates a folder with the given name.
   *
   * @param {string} foldername - The name of the folder to create.
   * @return {Promise<string>} A promise that resolves to 'success' when the folder is created.
   */
  async createFolder(folderName: string) {
    // let strroot_path: string = path.join('src', foldername)
    fs.mkdirSync(folderName, { recursive: true });
    return await 'success';
  }
  /**
   * Asynchronously creates a file based on the provided template, data, and path.
   *
   * @param {any} template - The template used for file creation.
   * @param {any} data - The data to be used in the file.
   * @param {string} path - The path where the file will be written.
   * @return {Promise<void>} A promise that resolves when the file is created.
   * @throws {Error} If there is an error reading the template or writing the file.
   */
  async createFile(template, data, path) {
    try {
      let objtemplate: any; //= await this.ReadFile(template,'');

      let fn = ejs.compile(objtemplate);
      let str = fn(data);
      if (str != '') {
        fs.writeFileSync(path, str);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Asynchronously creates a file based on the provided template, data, relation, data1, and data2, and writes it to the specified path.
   *
   * @param {any} template - The path of the template file.
   * @param {any} data - The data to be used in the file.
   * @param {any} relation - The relation of the data.
   * @param {any} data1 - Additional data.
   * @param {any} data2 - Additional data.
   * @param {string} path - The path where the file will be written.
   * @return {Promise<void>} A promise that resolves when the file is created.
   * @throws {Error} If there is an error reading the template or writing the file.
   */
  async CreateFileWithThreeParam(
    sessionInfo: sessionInfo,
    sourcePath: string,
    data: any,
    relation: any,
    data1: any,
    data2: any,
    targetPath: string,
  ) {
    const token: string = sessionInfo.token;
    const keys: string = sessionInfo.key;

    let objtemplate: any = await this.ReadFile(sourcePath, sessionInfo);
    try {
      let fn: any = ejs.compile(objtemplate);
      let str: any = fn({
        data: data,
        relation: relation,
        data1: data1,
        data2: data2,
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
      let errObj = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        keys,
        errorMessage,
        statusCode,
      );
      throw error;
    }
  }

  async copyFile(
    sessionInfo: sessionInfo,
    sourcePath: string,
    targetPath: string,
  ) {
    const token = sessionInfo.token;
    const keys = sessionInfo.key;
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
      let errObj = await this.commonService.commonErrorLogs(
        errorObj,
        token,
        keys,
        errorMessage,
        statusCode,
      );
      throw error;
    }
  }

  async flattenHierarchy(data) {
    const result = [];

    function traverse(items, menuGroup) {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          if (item.type === 'item') {
            const flattenedItem = {
              menuGroup,
              screenName: item.title.toLowerCase(),
              DF: item.keys?.df || '',
              UF: item.keys?.uf || '',
              PF: item.keys?.pf || '',
              SF: item.keys?.sf || '',
              event: '',
            };
            result.push(flattenedItem);
          }
          if (Array.isArray(item.items) && item.items.length > 0) {
            traverse(item.items, menuGroup);
          }
        });
      }
    }

    data.forEach((group) => {
      traverse(group.items, group.title.toLowerCase());
    });

    return result;
  }

  //get the particular keys from redis
  async getKeys(key: string, value: string) {
    try {
      let keys = await redis.keys(key + ':' + value + ':*');

      return keys;
    } catch (error) {
      throw error;
    }
  }

  async readAPI(keys: string, source: string, target: string): Promise<any> {
    const keyParts = keys.split(':');
    const catk: string[] = [];
    const afgk: string[] = [];
    const ak: string[] = [];
    const afvk: string[] = [];
    const afsk: string = keyParts[14];
    const ck = keyParts[1];
    const fngk = keyParts[3];
    const fnk = keyParts[5];
    catk.push(keyParts[7]);
    afgk.push(keyParts[9]);
    ak.push(keyParts[11]);
    afvk.push(keyParts[13]);

    let readAPIBody: readAPIDTO = {
      SOURCE: source,
      TARGET: target,
      CK: ck,
      FNGK: fngk,
      FNK: fnk,
      CATK: catk,
      AFGK: afgk,
      AFK: ak,
      AFVK: afvk,
      AFSK: afsk,
    };

    const readKey = await axios.post(
      'http://localhost:3002/api/readkey',
      readAPIBody,
    );

    return readKey.data;
  }

  async writeAPI(
    keys: string,
    path: string,
    source: string,
    target: string,
  ): Promise<any> {
    const keyParts = keys.split(':');
    const catk: string[] = [];
    const afgk: string[] = [];
    const ak: string[] = [];
    const afvk: string[] = [];
    const afsk: string = keyParts[14];
    const ck = keyParts[1];
    const fngk = keyParts[3];
    const fnk = keyParts[5];
    catk.push(keyParts[7]);
    afgk.push(keyParts[9]);
    ak.push(keyParts[11]);
    afvk.push(keyParts[13]);

    let readAPIBody: setAPIDTO = {
      SOURCE: source,
      TARGET: target,
      CK: ck,
      FNGK: fngk,
      FNK: fnk,
      CATK: catk,
      AFGK: afgk,
      AFK: ak,
      AFVK: afvk,
      AFSK: {},
    };

    const readKey = await axios.post(
      'http://localhost:3002/api/readkey',
      readAPIBody,
    );

    return readKey.data;
  }

  async getGitRepoUrl(fabric: string, key: string): Promise<any> {
    const source: string = 'redis';
    const target: string = 'redis';
    const appCode: string = key.split(':')[11];
    // console.log("🚀 ~ TG_CommonService ~ getGitRepoUrl ~ appCode:", appCode)
    const assemblerData: JSON = await this.readAPI(key, source, target);
    const setUpKey: string = assemblerData['setupKey'];
    const setUpData: any = await this.readAPI(setUpKey, source, target);
    const envDetails: JSON[] = setUpData.ENV[0].APPS;
    for (let i = 0; i < envDetails.length; i++) {
      if (appCode === envDetails[i]['code']) {
        return {
          gitRepo: envDetails[i]['appPath'],
          generatedAppurl: envDetails[i]['generatedUrl'],
        };
      }
    }
    // console.log("🚀 ~ TG_CommonService ~ getGitRepoUrl ~ envDetails:", envDetails)
  }

  async createRepository(key, fabric, aKey): Promise<void> {
    try {
      let remoteUrl: any;
      if (fabric === 'DF') {
        remoteUrl = aKey;
      }
      if (fabric === 'UF') {
        let envDetails = await this.getGitRepoUrl(fabric, aKey); //process.env.GITREPO_UF_URL;
        if (envDetails) {
          remoteUrl = envDetails['gitRepo'];
          // console.log("🚀 ~ TG_CommonService ~ createRepository ~ remoteUrl:", typeof remoteUrl)
          // console.log("🚀 ~ TG_CommonService ~ createRepository ~ envDetails:", envDetails)
        } else {
          console.log('No git repo url found');
        }
      }

      // remoteUrl= process.env.GITREPO_DF_URL;
      const token = process.env.GITREPO_TOKEN;
      const username = process.env.GITREPO_USRNAME;
      /*const tenantPath: string = path.dirname(
        path.dirname(path.dirname(path.dirname(path.dirname(__dirname)))),
      );
      let dfKey: string = key.dfKey;
      let keyParts: string[] = dfKey.split(':');
      const tenantName: string = keyParts[7];
      const appGroupName: string = keyParts[9];
      const appName: string = keyParts[11];
      const version: string = keyParts[13];
      const tenantPathName: string = path.join(tenantPath, tenantName);
      const appGroupPathName: string = path.join(tenantPathName, appGroupName);
      const repoDir: string = path.join(
        appGroupPathName,
        appName,
        'fabric',
        version,
      );*/ // Initialize the repository
      const repoDir = key;
      console.log(
        '🚀 ~ TG_CommonService ~ createRepository ~ repoDir:',
        repoDir,
      );
      await git.init({ fs, dir: repoDir });
      console.log('Repository initialized at:', repoDir);
      await git.add({ fs, dir: repoDir, filepath: '.' }); // Commit the changes
      await git.commit({
        fs,
        dir: repoDir,
        author: {
          name: process.env.GITREPO_AUTHNAME,
          email: process.env.GITREPO_AUTHEMAIL,
        },
        message: 'Initial commit',
      });
      console.log('Initial commit created');
      await git.addRemote({
        fs,
        dir: repoDir,
        remote: 'origin',
        url: remoteUrl,
      });
      console.log('Remote repository added'); // Step 7: Push to the remote repository
      await git.push({
        fs,
        dir: repoDir,
        http,
        remote: 'origin',
        ref: process.env.GITREPO_BRANCH, // or the branch name you want to push
        onAuth: () => ({ username, password: token }),
        force: true,
      });
      console.log('Changes pushed to GitHub');
    } catch (error) {
      console.log(error);
    }
  }

  async checkAndDeleteFolder(folderPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check if the folder exists
      fs.access(folderPath, fs.constants.F_OK, (err) => {
        if (err) {
          // Folder doesn't exist
          return resolve('Folder does not exist.');
        }

        // Folder exists, proceed to delete
        fs.rm(folderPath, { recursive: true, force: true }, (err) => {
          if (err) {
            return reject('Error deleting folder: ' + err.message);
          }
          return resolve('Folder and its contents have been deleted.');
        });
      });
    });
  }
}
