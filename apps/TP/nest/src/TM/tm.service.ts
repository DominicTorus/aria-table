import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { ZenEngine } from '@gorules/zen-engine';
import { CommonService } from 'src/commonService';
import { RedisService } from 'src/redisService';
import { CommonTmServices } from './commonTmServices';

import { ApiService } from 'src/apiService';

import { RuleService } from 'src/ruleService';
import { ModellerService } from './modeller/modeller.service';
interface changeArtifactLockData {
  redisKey: string[];
  value: boolean;
}
type fabric = 'pf' | 'uf' | 'sf' | 'df';

type artifactType = 'AF' | 'AFR' | 'tpfrk';
@Injectable()
export class TmService {
  constructor(
    private readonly apiService: ApiService,
    private readonly redisService: RedisService,
    private readonly commonService: CommonService,
    private readonly commonTmServices: CommonTmServices,
    private readonly modellerService: ModellerService,
  ) {}

  async handleErroLog(
    errObj,
    token,
    key,
    errorMessage,
    statusCode,
  ): Promise<any> {
    try {
      return await this.commonService.commonErrorLogs(
        errObj,
        token,
        key,
        errorMessage,
        statusCode,
      );
    } catch (error) {
      throw error;
    }
  }

  async customCodeExcute(code): Promise<any> {
    try {
      const body = {
        language: 'javascript',
        version: '18.15.0',
        files: [
          {
            content: code,
          },
        ],
      };
      const data = await fetch('http://192.168.2.165:2000/api/v2/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
      })
        .then((res) => {
          return res.json();
        })
        .catch((error) => console.error(error));

      let result = data;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteAFK(redisKey): Promise<any> {
    try {
      let arkey = ['CK', 'FNGK', 'FNK', 'CATK', 'AFGK', 'AFK', 'AFVK', 'AFSK'];
      console.log(redisKey, '<<<------Deletes----->>>');
      let arrKey = JSON.parse(redisKey);
      let finalKey = arrKey.map((key, index) => [arkey?.[index], key]).flat();
      let key = '';
      if (finalKey.length > 0) {
        key = finalKey.join(':');
      }
      await this.delete(key);
      arrKey.pop();
      const artifactList = await this.modellerService.getAFKwithAFVK(
        JSON.stringify(arrKey),
      );

      if (artifactList && artifactList.data) {
        return {
          status: 200,
          data: artifactList.data,
          message: 'Artifact Deleted Successfully',
        };
      } else {
        return {
          status: 200,
          data: [],
          message: 'Artifact Deleted Successfully',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteCATK(redisKey, ctk): Promise<any> {
    try {
      let arkey = ['CK', 'FNGK', 'FNK', 'CATK'];
      let fabrics = JSON.parse(redisKey)[2];
      console.log(redisKey, ctk, fabrics, '<<<------Deletes----->>>');

      let clientCode = JSON.parse(redisKey)[0];
      let arrKey = JSON.parse(redisKey);
      let finalKey = arrKey.map((key, index) => [arkey?.[index], key]).flat();
      let key = '';
      if (finalKey.length > 0) {
        key = finalKey.join(':');
      }
      try {
        await this.delete(key);
      } catch (error) {
        console.error(`Error deleting key: ${error.message}`);
        throw error;
      }
      arrKey.pop();
      const catelogueArtifactList = await this.getCATKwithAFGK(fabrics, ctk);

      if (catelogueArtifactList && catelogueArtifactList.data) {
        return {
          status: 200,
          data: catelogueArtifactList.data,
          message: 'Catalog Deleted Successfully',
        };
      } else {
        return {
          status: 200,
          data: [],
          message: 'Catalog Deleted Successfully',
          description: 'data return empty',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteAGK(redisKey, ctk): Promise<any> {
    try {
      let arkey = ['CK', 'FNGK', 'FNK', 'CATK', 'AFGK'];
      let fabrics = JSON.parse(redisKey)[2];
      console.log(redisKey, ctk, fabrics, '<<<------Deletes----->>>');

      let clientCode = JSON.parse(redisKey)[0];
      let arrKey = JSON.parse(redisKey);
      let finalKey = arrKey.map((key, index) => [arkey?.[index], key]).flat();
      let key = '';
      if (finalKey.length > 0) {
        key = finalKey.join(':');
      }
      try {
        await this.delete(key);
      } catch (error) {
        console.error(`Error deleting key: ${error.message}`);
        throw error;
      }
      arrKey.pop();
      const catelogueArtifactList = await this.getCATKwithAFGK(fabrics, ctk);

      if (catelogueArtifactList && catelogueArtifactList.data) {
        return {
          status: 200,
          data: catelogueArtifactList.data,
          message: 'Catalog Deleted Successfully',
        };
      } else {
        return {
          status: 200,
          data: [],
          message: 'Catalog Deleted Successfully',
          description: 'data return empty',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async rename(oldKey, newKey) {
    try {
      console.log(oldKey, newKey, '<<<------Renames----->>>');
      let arkey = ['CK', 'FNGK', 'FNK', 'CATK', 'AFGK', 'AFK', 'AFVK', 'AFSK'];
      let olKeys = oldKey;
      let arrOlKey = olKeys?.map((key, index) => [arkey?.[index], key]).flat();
      // let arrOlKey = olKeys;
      let neKeys = newKey;
      let arrNewKey = neKeys?.map((key, index) => [arkey?.[index], key]).flat();
      // let arrNewKey = neKeys;
      if (
        arrOlKey &&
        arrNewKey &&
        arrOlKey.length &&
        arrNewKey.length &&
        arrOlKey.length === arrNewKey.length
      ) {
        let olKey = arrOlKey.join(':');
        let neKey = arrNewKey.join(':');
        const allKeys = await this.redisService.getKeys(olKey);
        if (allKeys.length > 0) {
          allKeys.forEach(async (key) => {
            const response = await this.redisService.renameKey(
              key,
              `${neKey}${key.replace(olKey, '')}`,
            );
            return response;
          });
          olKeys.pop();
          console.log(olKeys, '<<<------olKeys----->>>');
          return await this.modellerService.getAFK(JSON.stringify(olKeys));
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async delete(key): Promise<any> {
    try {
      let allKeys = await this.redisService.getKeys(key);

      for (let i = 0; i < allKeys.length; i++) {
        await this.redisService.deleteKey(allKeys[i]);
      }
    } catch (error) {
      throw error;
    }
  }

  async getPF(input) {
    try {
      var key = input.key;
      var nName = input.nodeName;
      var ncode = input.savedCode;
      const json = await this.redisService.getJsonData(key + 'processFlow');
      var pfjson: any = JSON.parse(json);
      var result = await this.getRedisPH(key, pfjson, nName, ncode);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getRedisPH(json, key, nName, ncode) {
    var arr = [];
    var nodeid;

    for (var k = 0; k < key.length; k++) {
      // Start Node

      if (key[k].nodeName == 'Start') {
        var obj = {};
        obj['nodeid'] = key[k].nodeId;
        obj['nodename'] = key[k].nodeName;
        obj['nodetype'] = key[k].nodeType;
        arr.push(obj);
        nodeid = key[k].routeArray[0].nodeId;
      }

      if (
        nodeid == key[k].nodeId &&
        key[k].nodeType == 'humantasknode' &&
        (key[k].nodeName != 'Start' || key[k].nodeName != 'End')
      ) {
        if (nName == key[k].nodeName) {
          var response = await this.getJson(json, arr, nName);
          return response;
        } else {
          var obj = {};
          obj['nodeid'] = key[k].nodeId;
          obj['nodename'] = key[k].nodeName;
          obj['nodetype'] = key[k].nodeType;
          arr.push(obj);
          //Get manualinput by client rwquest from redis

          nodeid = key[k].routeArray[0].nodeId;
          //To set these params to next node request
        }
      }

      // Decision Node

      if (
        nodeid == key[k].nodeId &&
        key[k].nodeType == 'decisionnode' &&
        (key[k].nodeName != 'Start' || key[k].nodeName != 'End')
      ) {
        if (nName == key[k].nodeName) {
          var response = await this.getJson(json, arr, nName);
          return response;
        } else {
          var obj = {};
          obj['nodeid'] = key[k].nodeId;
          obj['nodename'] = key[k].nodeName;
          obj['nodetype'] = key[k].nodeType;
          arr.push(obj);

          var wfarr = JSON.parse(
            await this.redisService.getJsonDataWithPath(
              json + 'nodeProperty',
              '.' + key[k].nodeId + '.rule',
            ),
          );
          var gparamreq = {};
          var greq = JSON.parse(
            await this.redisService.getJsonDataWithPath(
              json + 'nodeProperty',
              '.' + key[k].nodeId + '.rule..inputs',
            ),
          );
          for (var g = 0; g < greq.length; g++) {
            var decreq = JSON.parse(
              await this.redisService.getJsonDataWithPath(
                json + 'nodeProperty',
                '.' +
                  key[k].nodeId +
                  '.data.pro.request' +
                  '..' +
                  greq[g].field,
              ),
            );
            gparamreq[greq[g].field] = decreq;
          }

          /*Retrieves the rule, form the input data to check
            & sends to the rule engine to evaluate
        */

          var goruleres = await this.goRule(wfarr, gparamreq);
          var wfres = goruleres.result.output;
          for (var w = 0; w < key[k].routeArray.length; w++) {
            // check the rule engine result with process flow result of identification of next node
            if (key[k].routeArray[w].conditionResult == wfres) {
              nodeid = key[k].routeArray[w].nodeId;
              break;
            }
          }
        }
      }

      // Api Node
      if (
        nodeid == key[k].nodeId &&
        key[k].nodeType == 'apinode' &&
        key[k].nodeName != 'Start' &&
        key[k].nodeName != 'End'
      ) {
        if (nName == key[k].nodeName) {
          var response = await this.getJson(json, arr, nName);
          return response;
        } else {
          var obj = {};
          obj['nodeid'] = key[k].nodeId;
          obj['nodename'] = key[k].nodeName;
          obj['nodetype'] = key[k].nodeType;
          arr.push(obj);
          nodeid = key[k].routeArray[0].nodeId;
        }
      }

      // End Node

      if (key[k].nodeName == 'End') {
        var obj = {};
        obj['nodeid'] = key[k].nodeId;
        obj['nodename'] = key[k].nodeName;
        obj['nodetype'] = key[k].nodeType;
        arr.push(obj);
        break;
      }
    }
  }

  async getJson(input, arr, nname) {
    var obj = {};
    for (var s = 0; s < arr.length; s++) {
      if (arr[s].nodename != 'Start' && arr[s].nodename != 'End') {
        const apikey = await this.redisService.getJsonDataWithPath(
          input + 'nodeProperty',
          '.' + arr[s].nodeid,
        );
        const nodekey = JSON.parse(apikey).nodeName;
        const configdata = JSON.parse(apikey).data;
        obj[nodekey] = configdata;
      }
    }
    return JSON.stringify(obj);
  }
  async goRule(content: any, data: any) {
    const engine = new ZenEngine();
    const decision = engine.createDecision(content);
    const result = await decision.evaluate(data);
    engine.dispose();
    return result;
  }

  async getNodeList(fabrics, redisKey): Promise<any> {
    try {
      let res;
      const nodes: Promise<any> = new Promise((resolve, reject) => {
        let arrKey = JSON.parse(redisKey);
        let key = '';
        if (arrKey.length > 0) {
          key = arrKey.join(':') + ':' + 'nodes';
        }
        try {
          const node = this.redisService.getJsonData(key);
          resolve(node);
        } catch (error) {
          reject(error);
        }
      });

      const result = await Promise.all([nodes])
        .then((values) => {
          return values;
        })
        .catch((error) => {
          throw new BadRequestException(error);
        });

      let resultNodes = JSON.parse(result[0]) || [];
      if (fabrics == 'PF-PFD' || fabrics == 'DF-ERD') {
        res =
          resultNodes.length > 0 &&
          resultNodes.map((item: any) => {
            return {
              nodeId: item.id,
              nodeName: item.data.label,
              nodeType: item.type,
              data: item,
            };
          });
      }
      if (
        fabrics === 'UF-UFW' ||
        fabrics === 'UF-UFM' ||
        fabrics === 'UF-UFD'
      ) {
        res =
          resultNodes &&
          resultNodes
            .filter((node) => node.type == 'group')
            .map((item: any) => {
              return {
                nodeId: item.id,
                nodeName: item.data.label,
                nodeType: item.type,
                control: resultNodes
                  .filter((node) => node?.T_parentId == item.id)
                  .map((item: any) => {
                    return {
                      nodeId: item.id,
                      nodeName: item.data.label,
                      nodeType: item.type,
                      data: item,
                    };
                  }),
              };
            });

        res = [
          ...res,
          {
            nodeId: 'canvas',
            nodeName: 'canvas',
            nodeType: 'group',
            control: resultNodes
              .filter(
                (node) =>
                  (!node.T_parentId || !node.hasOwnProperty('T_parentId')) &&
                  node.type !== 'group',
              )
              .map((item: any) => {
                return {
                  nodeId: item.id,
                  nodeName: item.data.label,
                  nodeType: item.type,
                  data: item,
                };
              }),
          },
        ];
      }

      return {
        data: res,
        status: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async createArtifactInfo(client, type, redisKey: Array<[string]>) {
    try {
      let redisKeys = redisKey.join(':');
      const result = await this.commonTmServices.manageArtifactInfo(
        client,
        type,
        redisKeys,
      );

      if (result && result === 'OK') {
        return {
          status: 201,
          message: 'successfully ' + type + 'ed the artifact info ' + redisKeys,
        };
      } else {
        throw new BadRequestException('fail' + type + 'ing the artifact info');
      }
    } catch (error) {
      throw error;
    }
  }

  async changeArtifactLock(data: changeArtifactLockData): Promise<any> {
    try {
      let redisKey = data?.redisKey;
      let arrKey = redisKey;
      let key = arrKey.join(':');
      let res: any;

      if (data.hasOwnProperty('value'))
        res = await this.commonTmServices.setArtifactLockin(
          key + ':AFI',
          data?.value,
        );

      if (res == 'success') {
        return {
          status: 200,
        };
      } else {
        throw new BadRequestException('fail');
      }
    } catch (error) {
      throw error;
    }
  }

  async getRecentArtifactDetailList(
    loginId: string,
    artifactType: artifactType,
    client?: string,
    fabric?: fabric | fabric[],
    catalog?: string | string[],
    artifactGrp?: string | string[],
  ) {
    try {
      if (loginId && artifactType) {
        const fabrics =
          fabric && Array.isArray(fabric)
            ? fabric
            : fabric && typeof fabric === 'string'
              ? [fabric]
              : ['pf', 'uf', 'sf', 'df'];

        const overAllCatalogArray = await this.getAllCatalogs();
        const overAllArtifactGrpArray = await this.getArtifactGrp();

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
        for (const fab of fabrics) {
          for (const cat of catalogs) {
            for (const artGrp of artifactGrps) {
              const keyPrefix = `TLC:${artifactType.toUpperCase()}:${fab.toUpperCase()}:${cat}:${artGrp}`;
              const data: string[] = await this.redisService.getKeys(keyPrefix);
              if (data && Array.isArray(data)) {
                data.forEach((key) => {
                  key.endsWith('artifactInfo') && keys.push({ key, fab });
                });
              }
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
            const artifactName = artifactKeyDetail.key.split(':')[5];
            const version = artifactKeyDetail.key.split(':')[6];
            const catalogDetail = artifactKeyDetail.key.split(':')[3];
            const artifactGrpDetail = artifactKeyDetail.key.split(':')[4];

            const recentlyWorking =
              versionObj.updatedOn || versionObj.createdOn;

            if (
              versionObj.updatedBy === loginId ||
              versionObj.createdBy === loginId
            ) {
              recentArtifacts.push({
                artifactName,
                version,
                recentlyWorking,
                fabric: artifactKeyDetail.fab,
                catalog: catalogDetail,
                artifactGrp: artifactGrpDetail,
                isLocked: versionObj.isLocked,
              });
            }
          }
        }

        return recentArtifacts;
      } else {
        throw new BadRequestException('Invalid input parameters');
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllCatalogs(artifactType?: artifactType | artifactType[]) {
    try {
      const accessKeyArray = artifactType
        ? typeof artifactType === 'string'
          ? [artifactType]
          : artifactType
        : ['AFR', 'AF'];

      // Use map to create an array of promises
      const promises = accessKeyArray.map(async (accessKey) => {
        // Fetch keys for each accessKey
        const response = await this.redisService.getKeys(
          `TLC:${accessKey.toUpperCase()}`,
        );
        return Array.from(
          new Set(response.map((key: string) => key.split(':')[3])),
        );
      });

      // Wait for all promises to resolve
      const results = await Promise.all(promises);

      // Flatten the array of arrays into a single array
      const val = Array.from(new Set(results.flat()));

      return val;
    } catch (error) {
      throw error;
    }
  }

  async getArtifactGrp(
    artifactType?: artifactType | artifactType[],
    fabric?: fabric | fabric[],
    catalog?: string | string[],
  ) {
    try {
      const accessKeyArray = artifactType
        ? typeof artifactType === 'string'
          ? [artifactType]
          : artifactType
        : ['AFR', 'AF'];

      const contextKeyArray = fabric
        ? typeof fabric === 'string'
          ? [fabric]
          : fabric
        : ['df', 'uf', 'pf', 'sf'];

      const catalogArray = catalog
        ? typeof catalog === 'string'
          ? [catalog]
          : catalog
        : null;

      const promises = accessKeyArray.flatMap((accessKey) =>
        contextKeyArray.flatMap((fab) =>
          catalogArray
            ? catalogArray.map((catalogKey) =>
                this.redisService.getKeys(
                  `TLC:${accessKey.toUpperCase()}:${fab.toUpperCase()}:${catalogKey}`,
                ),
              )
            : [
                this.redisService.getKeys(
                  `TLC:${accessKey.toUpperCase()}:${fab.toUpperCase()}`,
                ),
              ],
        ),
      );

      // Wait for all promises to resolve
      const results = await Promise.all(promises);

      // Flatten the array of results (if necessary)
      const val = results.flat();

      return Array.from(new Set(val.map((key) => key.split(':')[4])));
    } catch (error) {
      throw error;
    }
  }

  async getAllArtifacts(redisKey: Array<string>, stopAt: string = 'none') {
    try {
      let key = JSON.stringify(redisKey);
      const finalKey = this.commonTmServices.convert8keysinto16keys(redisKey);

      let catalog = await this.apiService
        .readKeys({
          ...finalKey,
          stopsAt: 'CATK',
        })
        .then((res) => {
          if (Array.isArray(res) && res.length > 0) {
            let result = [];
            res.forEach((item) => {
              result.push(item?.CATK);
            });
            return result;
          }

          return [];
        })
        .catch((error) => {
          console.error(error);
        });
      const handleVersion = async (verion, redisKey) => {
        let response = [];
        for (let i = 0; i < verion.length; i++) {
          response.push({
            verion: verion[i],
            redisKey: [...redisKey, verion[i]].join(':'),
          });
        }
        return response;
      };

      const handleArtifact = async (artifact, redisKey) => {
        let response = [];
        for (let i = 0; i < artifact.length; i++) {
          let verion = await this.modellerService
            .getAFVK(artifact[i], JSON.stringify(redisKey))
            .then((res) => res?.data)
            .catch((error) => console.error(error));
          let versionList;
          if (stopAt == 'version') {
            versionList = verion;
          } else
            versionList = await handleVersion(verion, [
              ...redisKey,
              artifact[i],
            ]);
          response.push({
            artifact: artifact[i],
            versionList: versionList,
          });
        }

        return response;
      };

      const handleArtifactGroup = async (artifactGroup, redisKey) => {
        let response = [];
        for (let i = 0; i < artifactGroup.length; i++) {
          let artifact = await this.modellerService
            .getAFK(JSON.stringify([...redisKey, artifactGroup[i]]))
            .then((res) => res?.data)
            .catch((error) => console.error(error));
          let artifactList;
          if (stopAt == 'artifact') {
            artifactList = artifact;
          } else
            artifactList = await handleArtifact(artifact, [
              ...redisKey,
              artifactGroup[i],
            ]);
          response.push({
            artifactGroup: artifactGroup[i],
            artifactList: artifactList,
          });
        }

        return response;
      };

      const handleCatalog = async (catalog, redisKey) => {
        let response = [];
        if (!catalog) return response;
        for (let i = 0; i < catalog.length; i++) {
          let newArray = [...redisKey, catalog[i]];

          const finalKey =
            this.commonTmServices.convert8keysinto16keys(newArray);

          let artifactGrp = await this.apiService
            .readKeys({
              ...finalKey,
              stopsAt: 'AFGK',
            })
            .then((res) => {
              if (Array.isArray(res) && res.length > 0) {
                let result = [];
                res.forEach((item) => {
                  if (item?.CATK == catalog[i]) {
                    if (
                      Array.isArray(item?.AFGKList) &&
                      item?.AFGKList.length > 0
                    ) {
                      item?.AFGKList?.forEach((ak) => {
                        result.push(ak?.AFGK);
                      });
                    }
                  }
                });
                return result;
              } else {
                return [];
              }
            })
            .catch((error) => {
              console.error(error);
            });
          let artifactGrps;
          if (stopAt == 'artifactGroup') {
            artifactGrps = artifactGrp;
          } else {
            artifactGrps = await handleArtifactGroup(artifactGrp, [
              ...redisKey,
              catalog[i],
            ]);
          }
          response.push({
            catalog: catalog[i],
            artifactGroupList: artifactGrps,
          });
        }

        return response;
      };

      let response = [];

      response = await handleCatalog(catalog, redisKey);
      return {
        status: 200,
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCATKwithAFGK(fabric: string, clientCode = 'TLC') {
    try {
      let Tkeys = ['AF', 'AFR', 'AFP', 'AFC'];
      let data = {};
      for (let i = 0; i < Tkeys.length; i++) {
        data = {
          ...data,
          [Tkeys[i]]: await this.getAllArtifacts(
            [clientCode, Tkeys[i], fabric],
            'artifactGroup',
          )
            .then((res) => res.data)
            .catch((error) => {
              throw error;
            }),
        };
      }
      return {
        status: 200,
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCrkNodeData(key: string) {
    try {
      let res = {};
      const getKyes = [
        { getKey: 'NDS', sendKey: 'nodes' },
        { getKey: 'NDE', sendKey: 'nodeEdges' },
        { getKey: 'NDP', sendKey: 'nodeProperty' },
      ];
      let arrKey = key.split(':');
      let finalKey = this.commonTmServices.convert8keysinto16keys(arrKey);
      for (let i = 0; i < getKyes.length; i++) {
        const getKey = getKyes[i].getKey;
        const sendKey = getKyes[i].sendKey;
        res[sendKey] = await this.apiService
          .readMDK({
            ...finalKey,
            AFSK: getKey,
          })
          .then((res) => {
            if (res) {
              return JSON.parse(res);
            } else {
              return [];
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }

      if (res && Object.keys(res).length > 0) {
        return {
          status: 200,
          data: res,
        };
      } else {
        throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }

  //customcode

  async getProcess(key, nodeName, code) {
    try {
      var result = await this.pfProcessor(key, nodeName, code);
      return { status: 201, data: result };
    } catch (error) {
      return { status: 400, err: error };
    }
  }

  async pfProcessor(key, nodeName, code) {
    var arr = [];
    var nodeid;
    const json = await this.redisService.getJsonData(key + 'processFlow');

    var pfjson: any = JSON.parse(json);

    // var input = await this.redisService.getJsonDataWithPath('PEdata','.url');

    for (var i = 0; i < pfjson.length; i++) {
      // Start Node

      if (pfjson[i].nodeName == 'Start') {
        var obj = {};
        obj['nodeid'] = pfjson[i].nodeId;
        obj['nodename'] = pfjson[i].nodeName;
        obj['nodetype'] = pfjson[i].nodeType;
        arr.push(obj);
        var deci = {};
        deci['nodeName'] = pfjson[i].nodeName;

        nodeid = pfjson[i].routeArray[0].nodeId;
      }
      // Humantask node

      if (
        nodeid == pfjson[i].nodeId &&
        pfjson[i].nodeType == 'humantasknode' &&
        (pfjson[i].nodeName != 'Start' || pfjson[i].nodeName != 'End')
      ) {
        var obj = {};
        obj['nodeid'] = pfjson[i].nodeId;
        obj['nodename'] = pfjson[i].nodeName;
        obj['nodetype'] = pfjson[i].nodeType;
        arr.push(obj);
        if (pfjson[i].nodeName == nodeName) {
          var res = await this.customCodeProcess(key, nodeName, code, arr);
          return res;
        }
        nodeid = pfjson[i].routeArray[0].nodeId;
      }

      // Decision Node

      if (
        nodeid == pfjson[i].nodeId &&
        pfjson[i].nodeType == 'decisionnode' &&
        (pfjson[i].nodeName != 'Start' || pfjson[i].nodeName != 'End')
      ) {
        var obj = {};
        obj['nodeid'] = pfjson[i].nodeId;
        obj['nodename'] = pfjson[i].nodeName;
        obj['nodetype'] = pfjson[i].nodeType;
        arr.push(obj);
        var currNode = await this.redisService.getJsonDataWithPath(
          key + 'nodeProperty',
          '.' + pfjson[i].nodeId,
        );
        var ruleChk = JSON.parse(currNode).rule;
        if (ruleChk) {
          var zenresult = await this.zenrule(key, ruleChk, pfjson[i].nodeId);
        }
        if (pfjson[i].nodeName == nodeName) {
          var res = await this.customCodeProcess(key, nodeName, code, arr);
          return res;
        }
        for (var k = 0; k < pfjson[i].routeArray.length; k++) {
          if (pfjson[i].routeArray[k].conditionResult == zenresult) {
            nodeid = pfjson[i].routeArray[k].nodeId;
            break;
          }
        }
      }

      // Api Node
      if (
        nodeid == pfjson[i].nodeId &&
        pfjson[i].nodeType == 'apinode' &&
        pfjson[i].nodeName != 'Start' &&
        pfjson[i].nodeName != 'End'
      ) {
        var obj = {};
        obj['nodeid'] = pfjson[i].nodeId;
        obj['nodename'] = pfjson[i].nodeName;
        obj['nodetype'] = pfjson[i].nodeType;
        arr.push(obj);
        if (pfjson[i].nodeName == nodeName) {
          var res = await this.customCodeProcess(key, nodeName, code, arr);
          return res;
        }

        nodeid = pfjson[i].routeArray[0].nodeId;
      }

      // End Node

      if (pfjson[i].nodeName == 'End') {
        var obj = {};
        obj['nodeid'] = pfjson[i].nodeId;
        obj['nodename'] = pfjson[i].nodeName;
        obj['nodetype'] = pfjson[i].nodeType;
        arr.push(obj);
        break;
      }
    }
  }

  async zenrule(key: any, wfarr: any, nodeId: any) {
    var goruleEngine: RuleService = new RuleService();

    var greq = JSON.parse(
      await this.redisService.getJsonDataWithPath(
        key + 'nodeProperty',
        '.' + nodeId + '.rule..inputs',
      ),
    );
    var gparamreq = {};
    for (var g = 0; g < greq.length; g++) {
      var decreq = JSON.parse(
        await this.redisService.getJsonDataWithPath(
          key + 'nodeProperty',
          '.' + nodeId + '.data.pro.request' + '..' + greq[g].field,
        ),
      );
      gparamreq[greq[g].field] = decreq;
    }

    var goruleres = await goruleEngine.goRule(wfarr, gparamreq);
    return goruleres.result.output;
  }

  async customCodeProcess(key: any, nodeName: any, code: any, arr: any) {
    var data = code;

    if (data != undefined) {
      for (var k = 1; k < arr.length; k++) {
        if (arr[k].nodeName != 'Start' && arr[k].nodeName != 'End') {
          var curnName = arr[k].nodename.toLowerCase();

          var str = data.indexOf(curnName);

          if (str != -1) {
            var value = await this.redisService.getJsonDataWithPath(
              key + 'nodeProperty',
              '.' + arr[k].nodeid + '.data.pro.request',
            );

            var chkdata = JSON.parse(value);
            // get the key and value of decision node request data
            var chkkey = Object.keys(chkdata);
            var chkval = Object.values(chkdata);
            // form the data for replace the value in the customcode
            for (var s = 0; s < chkkey.length; s++) {
              var val = curnName + '.pro.request.' + chkkey[s];
              if (data.indexOf(val)) {
                data = data.replace(new RegExp(val, 'g'), chkval[s]);
              } else {
                throw 'Bad Request';
              }
            }
          }
        }
      }

      var t1 = await this.customCodeExcute(data);
      return t1;
    } else {
      return true;
    }
  }
}
