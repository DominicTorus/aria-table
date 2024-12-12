import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from '../../redisService';
import { error } from 'console';
import { ApiService } from 'src/apiService';
import { CommonTmServices } from '../commonTmServices';
import { map } from 'rxjs';
type subflowType = 'UO' | 'PO' | 'DO';
const _ = require('lodash');
@Injectable()
export class OrchestratorService {
  constructor(
    private readonly redisService: RedisService,
    private readonly commonTmServices: CommonTmServices,
    private readonly apiService: ApiService,
  ) {}

  async getJson(redisKey, subflow: subflowType): Promise<any> {
    try {
      const arrKey = JSON.parse(redisKey);
      const hasEmptyElement =
        this.commonTmServices.checkArrayHasEmptyElement(arrKey);
      if (hasEmptyElement) {
        throw new BadRequestException('Key is empty');
      } else {
        const finalKey = this.commonTmServices.convert8keysinto16keys(arrKey);

        let res = await this.handleGetSubflow(finalKey, subflow, arrKey);

        return { data: res, status: 200 };
      }
    } catch (error) {
      throw error;
    }
  }

  async handleGetSubflow(
    redisKey: any,
    subflow: subflowType,
    arrKey: string[],
  ): Promise<any> {
    try {
      switch (subflow) {
        case 'UO':
          return await this.handleGetUo(redisKey, arrKey, subflow);
        case 'PO':
          return await this.handleGetPo(redisKey, arrKey, subflow);

        case 'DO':
          return await this.handleGetDo(redisKey, arrKey, subflow);
      }
    } catch (error) {
      throw error;
    }
  }
  filterResByResp = (res: any, resp: any) => {
    const respNodeIds = new Set(
      resp.artifact.node.map((node: any) => node.nodeId),
    );

    const respElementIdsByNodeId = resp.artifact.node.reduce(
      (acc: any, node: any) => {
        acc[node.nodeId] = new Set(
          node.objElements.map((element: any) => element.elementId),
        );
        return acc;
      },
      {},
    );

    const filteredNodes = res.mappedData.artifact.node
      .filter((node: any) => respNodeIds.has(node.nodeId))
      .map((node: any) => ({
        ...node,
        objElements: node.objElements.filter((obj: any) =>
          respElementIdsByNodeId[node.nodeId]?.has(obj.elementId),
        ),
      }));

    return {
      ...res,
      mappedData: {
        ...res.mappedData,
        artifact: {
          ...res.mappedData.artifact,
          node: filteredNodes,
        },
      },
    };
  };

  async handleGetUo(
    redisKey: any,
    arrKey: string[],
    subflow: any,
  ): Promise<any> {
    try {
      let res = await this.apiService.readKeys({ ...redisKey, AFSK: subflow });

      res = res ? JSON.parse(res) : {};
      let resp: any = {};
      resp = await this.commonTmServices.getIniateEventsData(
        JSON.stringify(arrKey),
        arrKey[5],
      );
      const mappedData = this.commonTmServices.findDiffAndChangeDiffInObject(
        resp?.data?.logic,
        res?.mappedData,
        [
          'code',
          'testCode',
          'rule',
          'events',
          'mapper',
          'action',
          'ifo',
          'DataSet',
        ],

        [['name', 'nodeId', 'elementId']],
        true,
      );
      let securityData = [];
      if (
        res?.securityData &&
        res?.securityData?.accessProfile &&
        res?.securityData?.accessProfile.length > 0
      ) {
        securityData = res.securityData?.accessProfile.map((data) => {
          return {
            ...data,
            ...this.commonTmServices.findDiffAndChangeDiffInObject(
              resp?.data?.security,
              data,
              ['SIFlag'],
              ['resource'],
              true,
            ),
          };
        });
      }

      // res = {
      // ...res,
      // logicCenterData: resp?.data?.logic,
      // securityCenterData: resp?.data?.security,
      // sourceItems: [],

      // do: [],
      // };

      // if (res?.mappedData?.artifact && resp?.data?.logic) {
      // res = this.updateResWithResp(res, resp.data.logic);
      // }

      const afk = this.commonTmServices.convertArrayKeysIntoString(arrKey);

      res = {
        ...res,
        mappedData: {
          ...res?.mappedData,
          ...mappedData,
        },
        securityData: {
          ...res?.securityData,
          accessProfile: securityData,
          securityTemplate: resp?.data?.security,
          afk: afk,
        },
        targetItems: resp?.data?.controlJson,
      };

      return res;
    } catch (error) {
      throw error;
    }
  }
  async handleGetPo(
    redisKey: any,
    arrKey: string[],
    subflow: any,
  ): Promise<any> {
    try {
      let res = await this.apiService.readKeys({ ...redisKey, AFSK: subflow });
      let pfdsummary = await this.apiService.readKeys({
        ...redisKey,
        AFSK: 'PFS',
      });
      let senddata;

      pfdsummary = pfdsummary ? JSON.parse(pfdsummary) : {};
      res = res ? JSON.parse(res) : {};
      const poEdges = res?.edges;
      let samplenode = [];
      let node = await this.apiService
        .readKeys({ ...redisKey, AFSK: 'NDS' })
        .then((data) => {
          if (data) {
            return JSON.parse(data);
          }
        });

      if (node) {
        node.forEach((node) => {
          samplenode.push({
            nodeId: node.id,
            nodeName: node.data.label,
            nodeType: node.type,
          });
        });
      }

      if (_.isEmpty(pfdsummary)) {
        senddata = node;
      } else {
        senddata = pfdsummary;
      }
      let mappedData;
      let logicData =
        this.commonTmServices.logicCenterDataPO(senddata, arrKey[5], poEdges) ??
        {};

      let SecurityData =
        this.commonTmServices.securityCenterDataPO(
          senddata,
          arrKey[5],
          subflow,
        ) ?? {};

      mappedData = this.commonTmServices.findDiffAndChangeDiffInObject(
        logicData,
        res?.mappedData,
        [
          'code',
          'testCode',
          'rule',
          'events',
          'mapper',
          'action',
          'ifo',
          'DataSet',
        ],
        [['name', 'nodeId', 'elementId']],
        true,
      );

      let securityData = [];
      if (
        res?.securityData &&
        res?.securityData?.accessProfile &&
        res?.securityData?.accessProfile.length > 0
      ) {
        securityData = res.securityData?.accessProfile.map((data) => {
          return {
            ...data,
            ...this.commonTmServices.findDiffAndChangeDiffInObject(
              SecurityData,
              data,
              ['SIFlag'],
              ['resource'],
              true,
            ),
          };
        });
      }
      const afk = this.commonTmServices.convertArrayKeysIntoString(arrKey);
      res = {
        ...res,
        mappedData: {
          ...res?.mappedData,
          ...mappedData,
        },
        securityData: {
          ...res?.securityData,
          accessProfile: securityData,
          securityTemplate: SecurityData,
          afk: afk,
        },
        targetItems: samplenode,
      };

      return res;
    } catch (error) {
      throw error;
    }
  }

  async handleGetDo(
    redisKey: any,
    arrKey: string[],
    subflow: any,
  ): Promise<any> {
    try {
      const fabric = arrKey[2];
      const artifact = arrKey[5];
      const afk = this.commonTmServices.convertArrayKeysIntoString(arrKey);
      if (fabric === 'DF-DFD') {
        let resDST = await this.apiService.readKeys({
          ...redisKey,
          AFSK: subflow,
        });

        resDST = resDST ? JSON.parse(resDST) : {};
        let doNodes = resDST?.['nodes'];
        let oldMappedData = resDST?.mappedData;
        let oldSecurityData = resDST?.securityData;
        let samplenode = [];
        let node = await this.apiService
          .readKeys({ ...redisKey, FNK: 'DF-DFD', AFSK: 'NDS' })
          .then((data) => {
            if (data) {
              return JSON.parse(data);
            }
          });

        if (node) {
          node.forEach((node) => {
            if (node.type !== 'startnode' && node?.type !== 'endnode') {
              let schema = [];
              let nodePropertyData = node?.data?.nodeProperty?.data;
              if (nodePropertyData) {
                let getData = nodePropertyData?.get?.api?.queryParams;
                if (getData && typeof getData === 'object') {
                  schema = Object.keys(getData);
                }
              }
              samplenode.push({
                nodeId: node.id,
                nodeName: node.data.label,
                nodeType: node.type,
                schema: schema,
              });
            }
          });
        }

        let dfd = await this.apiService
          .readKeys({ ...redisKey, FNK: 'DF-DFD', AFSK: 'DFO' })
          .then((data) => {
            if (data) {
              return JSON.parse(data);
            }
          });

        let dfdschema = dfd;

        if (dfdschema) {
          let logicData =
            this.commonTmServices.logicCenterDataDO(
              dfdschema,
              artifact,
              subflow,
              afk,
            ) ?? {};

          let SecurityData =
            this.commonTmServices.securityCenterDataDO(
              dfdschema,
              artifact,
              subflow,
              afk,
            ) ?? {};

          logicData = this.commonTmServices.findDiffAndChangeDiffInObject(
            logicData,
            oldMappedData,
            [
              'code',
              'testCode',
              'rule',
              'events',
              'mapper',
              'action',
              'ifo',
              'DataSet',
            ],
            [['name', 'nodeId', 'elementId']],
            true,
          );
          let newsecurity = [];
          if (
            oldSecurityData &&
            oldSecurityData?.accessProfile &&
            oldSecurityData?.accessProfile.length > 0
          ) {
            newsecurity = oldSecurityData?.accessProfile.map((data) => {
              return {
                ...data,
                ...this.commonTmServices.findDiffAndChangeDiffInObject(
                  SecurityData,
                  data,
                  ['SIFlag'],
                  ['resource'],
                  true,
                ),
              };
            });
          }

          resDST = {
            ...resDST,
            mappedData: {
              ...resDST?.mappedData,
              ...logicData,
            },
            securityData: {
              ...resDST?.securityData,
              accessProfile: newsecurity,
              securityTemplate: SecurityData,
              afk: afk,
            },
          };
        }

        if (dfdschema && Array.isArray(dfdschema) && dfdschema.length > 0) {
          if (doNodes && Array.isArray(doNodes) && doNodes.length > 0) {
            if (doNodes.find((node) => node?.type === 'customSourceItems'))
              doNodes = doNodes.map((node) => {
                if (node?.type === 'customSourceItems') {
                  let oldSchema = structuredClone(node?.data?.schema);
                  let newSchema =
                    this.commonTmServices.findDiffAndChangeDiffInObject(
                      dfdschema,
                      oldSchema,
                      ['ifo'],
                      ['nodeId'],
                    );

                  return {
                    ...node,
                    data: {
                      ...node.data,
                      schema: newSchema,
                    },
                  };
                }
                return node;
              });
            else
              doNodes = [
                {
                  id: afk,
                  type: 'customSourceItems',
                  data: {
                    schema: dfdschema,
                  },
                  position: {
                    x: 250,
                    y: 15.18957345971564,
                  },
                  width: 273,
                  height: 963,
                },
                ...doNodes,
              ];
          } else {
            doNodes = [
              {
                id: afk,
                type: 'customSourceItems',
                data: {
                  schema: dfdschema,
                },
                position: {
                  x: 250,
                  y: 15.18957345971564,
                },
                width: 273,
                height: 963,
              },
            ];
          }
        } else {
          if (doNodes && Array.isArray(doNodes) && doNodes.length > 0) {
            if (doNodes.find((node) => node?.type === 'customSourceItems'))
              doNodes = doNodes.map((node) => {
                if (node?.type === 'customSourceItems') {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      schema: samplenode,
                    },
                  };
                }
                return node;
              });
            else
              doNodes = [
                {
                  id: afk,
                  type: 'customSourceItems',
                  data: {
                    schema: samplenode,
                  },
                  position: {
                    x: 250,
                    y: 15.18957345971564,
                  },
                  width: 273,
                  height: 963,
                },
                ...doNodes,
              ];
          } else {
            doNodes = [
              {
                id: afk,
                type: 'customSourceItems',
                data: {
                  schema: samplenode,
                },
                position: {
                  x: 250,
                  y: 15.18957345971564,
                },
                width: 273,
                height: 963,
              },
            ];
          }
        }
        let logicschema =
          this.commonTmServices.logicSchemaDO(
            dfdschema,
            arrKey[5],
            subflow,
            afk,
          ) ?? {};

        resDST = {
          ...resDST,
          selectedSource: {
            tKey: arrKey[1],
            fabric: 'DF-DFD',
            catalog: arrKey[3],
            artifactGroup: arrKey[4],
            artifact: arrKey[5],
            version: arrKey[6],
            path: afk,
          },
          sourceItems: logicschema,
          nodes: doNodes,
        };

        return resDST;
      } else {
        let DO = await this.apiService.readKeys({
          ...redisKey,
          AFSK: subflow,
        });
        DO = JSON.parse(DO);
        let nodes = DO?.targetItems;
        let oldMappedData = DO?.mappedData;
        let oldSecurityData = DO?.securityData;
        let mappedData;
        let securityData;
        if (nodes && Array.isArray(nodes) && nodes.length > 0) {
          mappedData = this.commonTmServices.logicCenterDataDstDO(
            nodes,
            artifact,
          );
          securityData = this.commonTmServices.securityCenterDataDstDO(
            nodes,
            artifact,
          );
        }
        mappedData = this.commonTmServices.findDiffAndChangeDiffInObject(
          mappedData,
          oldMappedData,
          [
            'code',
            'testCode',
            'rule',
            'events',
            'mapper',
            'action',
            'ifo',
            'DataSet',
          ],
          [['name', 'nodeId', 'elementId']],
          true,
        );
        let newsecurity = [];
        if (
          oldSecurityData &&
          oldSecurityData?.accessProfile &&
          oldSecurityData?.accessProfile.length > 0
        ) {
          newsecurity = oldSecurityData?.accessProfile.map((data) => {
            return {
              ...data,
              ...this.commonTmServices.findDiffAndChangeDiffInObject(
                securityData,
                data,
                ['SIFlag'],
                ['resource'],
                true,
              ),
            };
          });
        }
        DO = {
          ...DO,
          mappedData: {
            ...DO?.mappedData,
            ...mappedData,
          },
          securityData: {
            ...DO?.securityData,
            accessProfile: newsecurity,
            securityTemplate: securityData,
            afk: afk,
          },
        };
        return DO;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getVersion(artifact, redisKey): Promise<any> {
    try {
      let arrKey = JSON.parse(redisKey);
      let key = '';
      arrKey.push(artifact);
      const hasEmptyElement =
        this.commonTmServices.checkArrayHasEmptyElement(arrKey);
      if (hasEmptyElement) {
        throw new BadRequestException('Key is empty');
      } else {
        if (arrKey.length > 0) {
          key = arrKey.join(':');
        }
        const finalKey = this.commonTmServices.convert8keysinto16keys(arrKey);
        const version = await this.apiService
          .readKeys({
            ...finalKey,
            stopsAt: 'AFVK',
          })
          .then((data) => {
            if (data && data.length > 0) {
              let result = [];
              data.forEach((item) => {
                if (item?.AFK == arrKey[arrKey.length - 1]) {
                  if (
                    Array.isArray(item?.AFVKList) &&
                    item?.AFVKList.length > 0
                  ) {
                    item?.AFVKList.forEach((ak) => {
                      result.push(ak?.AFVK);
                    });
                  }
                }
              });
              return result;
            }

            return [];
          });

        return {
          data: version.sort(),
          status: 200,
        };
      }
    } catch (error) {
      throw error;
    }
  }
  async getdfo(redisKey: string, subflow: any): Promise<any> {
    try {
      let arrKey = JSON.parse(redisKey);
      let key = '';
      if (arrKey.length > 0) {
        key = arrKey.join(':');
      }

      let finalKey = this.commonTmServices.convert8keysinto16keys(arrKey);
      if (subflow == 'UO') {
        let result = await this.apiService
          .readKeys({ ...finalKey, AFSK: ['DO'] })
          .then((res) => {
            if (res) {
              return JSON.parse(res);
            } else {
              return {};
            }
          })
          .catch((error) => {
            throw error;
          });
        return {
          data: result?.targetItems ?? [],
          status: 200,
        };
      }
      if (subflow == 'PO' || subflow == 'DO') {
        let result = await this.apiService
          .readKeys({ ...finalKey, AFSK: ['DS_Schema'] })
          .then((res) => {
            if (res) {
              return JSON.parse(res);
            } else {
              return {};
            }
          })
          .catch((error) => {
            throw error;
          });
        return {
          data: result,
          status: 200,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }
  async getIniateEventsData(redisKey) {
    try {
      let res = await this.commonTmServices.getIniateEventsData(redisKey);
      return res;
    } catch (error) {
      console.error(error);
    }
  }
  async saveaWorkFlow(req: any): Promise<any> {
    try {
      let redisKey = JSON.stringify(req?.redisKey);
      let arrKey = JSON.parse(redisKey);
      let source = 'redis';
      const SchemaValidation: any = {
        UO: [
          'CK:TRL:FNGK:AFRS:FNK:UF-UFD:CATK:Validator:AFGK:Json:AFK:Schema:AFVK:v1:UO',
        ],
        PO: [
          'CK:TRL:FNGK:AFRS:FNK:PF-PFD:CATK:pfcatalog:AFGK:pf:AFK:NDP:AFVK:v1:PO',
        ],

        DO: [
          'CK:TRL:FNGK:AFRS:FNK:DF-DFD:CATK:Validator:AFGK:Json:AFK:Schema:AFVK:v1:DO',
        ],
      };
      const hasEmptyElement =
        this.commonTmServices.checkArrayHasEmptyElement(arrKey);
      if (hasEmptyElement) {
        throw new BadRequestException('Key is empty');
      } else {
        let keys = '';
        if (arrKey.length > 0) {
          keys = arrKey.join(':');
        }
        const subflow: subflowType = req?.subflow;
        // if (subflow === 'UO') {
        // let schema = await this.apiService.validateJson(
        // source,
        // SchemaValidation['UO'],
        // [req.data],
        // );

        // if (schema === 'Validation successfully') {
        // let result = await this.handleSubFlowSave(subflow, redisKey, req);

        // let finalKey = this.commonTmServices.convert8keysinto16keys(arrKey);

        // await this.apiService.writeMDK({
        // SOURCE: 'redis',
        // TARGET: 'redis',
        // ...finalKey,
        // AFSK: { ...result },
        // });
        // }
        // }
        // if (subflow === 'PO') {
        // let schema = await this.apiService.validateJson(
        // source,
        // SchemaValidation['PO'],
        // [req.data],
        // );

        // if (schema === 'Validation successfully') {
        // let result = await this.handleSubFlowSave(subflow, redisKey, req);

        // let finalKey = this.commonTmServices.convert8keysinto16keys(arrKey);

        // await this.apiService.writeMDK({
        // SOURCE: 'redis',
        // TARGET: 'redis',
        // ...finalKey,
        // AFSK: { ...result },
        // });
        // }
        // }
        // if (subflow === 'DO') {
        // let schema = await this.apiService.validateJson(
        // source,
        // SchemaValidation['DO'],
        // [req.data],
        // );

        // if (schema === 'Validation successfully') {
        // let result = await this.handleSubFlowSave(subflow, redisKey, req);

        // let finalKey = this.commonTmServices.convert8keysinto16keys(arrKey);

        // await this.apiService.writeMDK({
        // SOURCE: 'redis',
        // TARGET: 'redis',
        // ...finalKey,
        // AFSK: { ...result },
        // });
        // }
        // }

        let result = await this.handleSubFlowSave(subflow, redisKey, req);
        if (!_.isEmpty(result?.[subflow]) && subflow !== 'DO') {
          result[subflow] = this.handleUOIFO(subflow, result[subflow]);
        }
        if (!_.isEmpty(result?.[subflow]) && subflow === 'DO') {
          result[subflow] = this.handleDOIFO(subflow, result[subflow]);
        }
        if (!_.isEmpty(result?.[subflow]) && subflow === 'PO') {
          result[subflow] = this.handlePOIFO(subflow, result[subflow]);
        }
        const finalKey = this.commonTmServices.convert8keysinto16keys(arrKey);

        const response = await this.apiService.writeMDK({
          SOURCE: 'redis',
          TARGET: 'redis',
          ...finalKey,
          AFSK: { ...result },
        });
        if (response === 'OK')
          return {
            data: 'success',
            status: 200,
          };
        else throw new BadRequestException('Failed to save data in redis');
      }
    } catch (error) {
      console.error(error);
      throw error.message;
    }
  }

  handleUOIFO(subflow: subflowType, orchestratorObj) {
    try {
      if (
        !Array.isArray(orchestratorObj?.nodes) &&
        !Array.isArray(orchestratorObj?.edges)
      ) {
        return orchestratorObj;
      }
      if (
        Array.isArray(orchestratorObj?.nodes) &&
        Array.isArray(orchestratorObj?.edges)
      ) {
        const dupObj = _.cloneDeep(orchestratorObj);
        let mappedData = _.cloneDeep(dupObj?.mappedData);
        let nodes = _.cloneDeep(dupObj?.nodes);
        let edges = _.cloneDeep(dupObj?.edges);

        const data = (() => {
          try {
            if (nodes.length > 1 && edges && subflow !== null) {
              if (subflow == 'DO') {
                let items;
                nodes.forEach((item, index) => {
                  if (item.type == 'customTargetItems') {
                    items = item.data;
                  }
                });

                if (items.length > 0) {
                  mappedData = {
                    ...mappedData,
                    artifact: {
                      ...mappedData?.artifact,
                      node: mappedData?.artifact?.node.map((item) => {
                        const matchingDataSet = items.filter(
                          (itemx) => itemx?.path.split('|')[1] === item?.nodeId,
                        );
                        if (matchingDataSet.length > 0) {
                          return {
                            ...item,
                            DataSet: matchingDataSet,
                          };
                        }
                        return item;
                      }),
                    },
                  };
                }
              }

              return edges.reduce((acc, items, index) => {
                if (items !== ' ') {
                  acc.push({
                    source_key: items['sourceHandle'],
                    target_key: items['targetHandle'],
                    sourcePath: items['source'],
                    targetPath: items['target'],
                  });
                }
                return acc;
              }, []);
            }
            if (nodes && edges.length === 0 && subflow !== null) {
              return [];
            }
          } catch (error) {
            console.error(error);
          }
        })();

        if (subflow === 'UO') {
          if (data) {
            const targetKeys = {};
            data.forEach((item) => {
              if (!targetKeys[item.target_key]) {
                targetKeys[item.target_key] = [];
              }
              targetKeys[item.target_key].push(item.source_key);
            });

            const mapper = Object.keys(targetKeys).map((targetKey) => ({
              sourceKey: targetKeys[targetKey],
              targetKey,
            }));
            if (mapper) {
              let mapperdata = mapper.map((item) => {
                const artifact = item?.targetKey.split(':')[11];
                const node = item?.targetKey.split('|')[1];
                const object = item?.targetKey.split('|')?.[2] || '';
                const sourceKey = item.sourceKey;
                return { artifact, node, object, sourceKey };
              });

              let checknode = mapperdata.map((item) => {
                return item.node;
              });
              let checktarget = mapperdata.map((item) => {
                return item.object;
              });

              if (mapperdata && mapperdata.length > 0) {
                mapperdata.forEach((item) => {
                  const artifactName = item.artifact;
                  const nodeId = item.node;
                  const objectId = item.object;
                  const checkExistingartifact =
                    mappedData?.artifact?.name === artifactName;

                  if (checkExistingartifact) {
                    const checkExistingNode = mappedData?.artifact?.node.find(
                      (item) => item.nodeId === nodeId,
                    );

                    if (checkExistingNode) {
                      const mapobjectlen = mapper.filter(
                        (item) => item.targetKey.split('|').length === 2,
                      );
                      if (mapobjectlen) {
                        const mapobject = mapobjectlen.filter(
                          (item) => item.targetKey.split('|')[1] === nodeId,
                        );
                        checkExistingNode.mapper = mapobject.filter((item) => {
                          const existingMapperItem =
                            checkExistingNode?.mapper?.find((existingItem) => {
                              return existingItem?.sourceKey.some(
                                (sourceKeyItem) => {
                                  return item.sourceKey.includes(sourceKeyItem);
                                },
                              );
                            });
                          const existingtargetItem =
                            checkExistingNode?.mapper?.find((existingItem) => {
                              return existingItem.targetKey === item.targetKey;
                            });

                          if (existingMapperItem && existingtargetItem) {
                            return true;
                          } else {
                            checkExistingNode?.mapper?.push(item);
                            try{

                              let dfoObject = nodes
                                .filter(
                                  (node) => node.type === 'customSourceItems',
                                )
                                .map((node) => node?.data?.dfo)
                                .filter((dfo) => dfo !== undefined);
  
                              let ifoObject = dfoObject
                                .map((dfo) => {
                                  return Object.keys(dfo).map((key) => {
                                    return dfo[key];
                                  });
                                })
                                .flat()
                                .flat();
  
                              let dfoNode =
                                ifoObject &&
                                ifoObject.length > 0 &&
                                ifoObject.filter((item) => {
                                  return checkExistingNode.mapper.some(
                                    (mapperItem) => {
                                      return mapperItem.sourceKey.some(
                                        (sourceKey) => {
                                          const mapperSourceKey =
                                            sourceKey.split('|')[1];
                                          return item.nodeId === mapperSourceKey;
                                        },
                                      );
                                    },
                                  );
                                });
  
                              let updateNode = checkExistingNode.mapper
                                .map((item) => {
                                  return item.sourceKey;
                                })
                                .flat();
  
                              let pushobj = dfoNode.flatMap(
                                (dfo) =>
                                  dfo.ifo &&
                                  dfo.ifo.length > 0 &&
                                  dfo.ifo.filter(
                                    (ifoPath) =>
                                      updateNode &&
                                      updateNode.length > 0 &&
                                      updateNode.includes(ifoPath.path),
                                  ),
                              );
  
                              checkExistingNode.ifo = checkExistingNode.ifo || [];
                              pushobj &&
                                pushobj.length > 0 &&
                                pushobj.forEach((obj) => {
                                  const existingIfoIndex =
                                    checkExistingNode.ifo &&
                                    checkExistingNode.ifo.length > 0 &&
                                    checkExistingNode.ifo.findIndex(
                                      (ifo) => ifo.path === obj.path,
                                    );
                                  if (existingIfoIndex === -1) {
                                    checkExistingNode.ifo.push(obj);
                                  }
                                });
                            }
                            catch(e){
                              console.error(e)
                            }

                          

                            return true;
                          }
                        });
                      }

                      const existingObjectElement =
                        checkExistingNode.objElements.find(
                          (element) => element.elementId === objectId,
                        );

                      if (existingObjectElement) {
                        const mapobject = mapper.filter(
                          (item) =>
                            item.targetKey.split('|')[2] === objectId &&
                            item.targetKey.split('|')[1] === nodeId,
                        );

                        existingObjectElement.mapper = mapobject.filter(
                          (item) => {
                            const existingMapperItem =
                              existingObjectElement?.mapper?.find(
                                (existingItem) => {
                                  return existingItem?.sourceKey.some(
                                    (sourceKeyItem) => {
                                      return item.sourceKey.includes(
                                        sourceKeyItem,
                                      );
                                    },
                                  );
                                },
                              );

                            const existingtargetItem =
                              existingObjectElement?.mapper?.find(
                                (existingItem) => {
                                  return (
                                    existingItem.targetKey === item.targetKey
                                  );
                                },
                              );

                            if (existingMapperItem && existingtargetItem) {
                              return true;
                            } else {
                              existingObjectElement?.mapper?.push(item);

                                try{

                                  let dfoObject = nodes
                                    .filter(
                                      (node) => node.type === 'customSourceItems',
                                    )
                                    .map((node) => node?.data?.dfo)
                                    .filter((dfo) => dfo !== undefined);
    
                                  let ifoObject = dfoObject
                                    .map((dfo) => {
                                      return Object.keys(dfo).map((key) => {
                                        return dfo[key];
                                      });
                                    })
                                    .flat()
                                    .flat();
    
                                  let dfoNode =
                                    ifoObject &&
                                    ifoObject.length > 0 &&
                                    ifoObject.filter((item) => {
                                      return existingObjectElement.mapper.some(
                                        (mapperItem) => {
                                          return mapperItem.sourceKey.some(
                                            (sourceKey) => {
                                              const mapperSourceKey =
                                                sourceKey.split('|')[1];
                                              return (
                                                item.nodeId === mapperSourceKey
                                              );
                                            },
                                          );
                                        },
                                      );
                                    });
    
                                  let updateNode = existingObjectElement.mapper
                                    .map((item) => {
                                      return item.sourceKey;
                                    })
                                    .flat();
    
                                  let pushobj = dfoNode.flatMap(
                                    (dfo) =>
                                      data.ifo &&
                                      data.ifo.length > 0 &&
                                      dfo.ifo.filter(
                                        (ifoPath) =>
                                          updateNode &&
                                          updateNode.length > 0 &&
                                          updateNode.includes(ifoPath.path),
                                      ),
                                  );
    
                                  existingObjectElement.ifo =
                                    existingObjectElement.ifo || [];
    
                                  pushobj &&
                                    pushobj.length > 0 &&
                                    pushobj.forEach((obj) => {
                                      const existingIfoIndex =
                                        existingObjectElement.ifo &&
                                        existingObjectElement.ifo.length > 0 &&
                                        existingObjectElement.ifo.findIndex(
                                          (ifo) => ifo.path === obj.path,
                                        );
                                      if (existingIfoIndex === -1) {
                                        existingObjectElement.ifo.push(obj);
                                      }
                                    });
    
                                  console.log(
                                    'ifo',
                                    ifoObject,
                                    'dfo',
                                    dfoNode,
                                    'node',
                                    existingObjectElement,
                                    'ch',
                                    existingObjectElement.mapper,
                                    'map',
                                    existingObjectElement.elementId,
                                    'up',
                                    updateNode,
                                    'pushobj',
                                    pushobj,
                                  );
                                }
                                catch(error){
                                  console.error(error)
                                }

                              return true;
                            }
                          },
                        );
                      } else {
                        checkExistingNode?.objElements.map((item) => {
                          return {
                            ...item,
                            mapper: [],
                            ifo: [],
                          };
                        });
                      }
                    } else {
                      checkExistingNode?.objElements.map((item) => {
                        return {
                          ...item,
                          mapper: [],
                          ifo: [],
                        };
                      });
                    }
                  }
                });
                if (
                  mappedData &&
                  mappedData.artifact &&
                  mappedData?.artifact?.node &&
                  mapperdata.filter(
                    (item) => item.artifact === mappedData?.artifact?.name,
                  )
                ) {
                  const returndata = mappedData?.artifact?.node.map((item) => {
                    if (checknode.includes(item.nodeId)) {
                      return {
                        ...item,

                        objElements: item?.objElements?.map((obj) => {
                          if (!checktarget.includes(obj.elementId)) {
                            return {
                              ...obj,
                              mapper: [],
                              ifo: [],
                            };
                          }
                          return obj;
                        }),
                      };
                    } else {
                      return {
                        ...item,
                        mapper: [],
                        objElements: item?.objElements?.map((obj) => {
                          return {
                            ...obj,
                            mapper: [],
                            ifo: [],
                          };
                        }),
                      };
                    }
                  });
                  mappedData = {
                    ...mappedData,
                    artifact: {
                      ...mappedData?.artifact,
                      node: returndata,
                    },
                  };
                }
              }
            }
          }
          if (data && data.length === 0 && edges.length === 0 && mappedData) {
            if (mappedData.artifact && mappedData.artifact.node) {
              mappedData = {
                ...mappedData,
                artifact: {
                  ...mappedData?.artifact,
                  node: mappedData?.artifact?.node?.map((item) => {
                    return {
                      ...item,
                      mapper: [],
                      ifo: [],
                      objElements: item?.objElements?.map((obj) => {
                        return {
                          ...obj,
                          mapper: [],
                          ifo: [],
                        };
                      }),
                    };
                  }),
                },
              };
            }
          }
        }

        orchestratorObj = {
          ...orchestratorObj,
          nodes: nodes,
          edges: edges,
          mappedData: mappedData,
        };

        return orchestratorObj;
      }
      return orchestratorObj;
    } catch (error) {
      console.error(error);
    }
  }

  handlePOIFO(subflow: subflowType, orchestratorObj) {
    try {
      if (
        !Array.isArray(orchestratorObj?.nodes) &&
        !Array.isArray(orchestratorObj?.edges)
      ) {
        return orchestratorObj;
      }
      if (
        Array.isArray(orchestratorObj?.nodes) &&
        Array.isArray(orchestratorObj?.edges)
      ) {
        const dupObj = _.cloneDeep(orchestratorObj);
        let mappedData = _.cloneDeep(dupObj?.mappedData);
        let nodes = _.cloneDeep(dupObj?.nodes);
        let edges = _.cloneDeep(dupObj?.edges);

        const handleifo = (ed) => {
          const edges = structuredClone(ed);
          if (subflow === 'PO') {
            let result = {};
            let datas = {};
            nodes.forEach((item, index) => {
              if (item.type === 'customSourceItems') {
                datas = item?.data?.dfo;
              }
            });
            if (!_.isEmpty(datas)) {
              edges.forEach((item, index) => {
                let resultifo;
                let { sourceHandle, targetHandle } = item;
                const source = sourceHandle.split('|')[0];
                const ifoId =
                  sourceHandle.split('|')[sourceHandle.split('|').length - 1];
                const mappedDataNodeId =
                  targetHandle.split('|')[targetHandle.split('|').length - 1];
                if (datas[source]) {
                  datas[source].forEach((item) => {
                    if (item?.nodeId === ifoId) {
                      resultifo = item?.ifo;
                    }
                  });
                }

                if (
                  result?.[mappedDataNodeId] &&
                  result?.[mappedDataNodeId]?.ifo
                ) {
                  result[mappedDataNodeId].ifo = [
                    ...result[mappedDataNodeId].ifo.filter((item) =>
                      resultifo.every((inner) => inner?.path !== item?.path),
                    ),
                    ...resultifo,
                  ];
                } else {
                  result[mappedDataNodeId] = {
                    ...result[mappedDataNodeId],
                    ifo: resultifo,
                  };
                }
              });
            }

            return result;
          }
        };
        const finalifo = handleifo(edges);
        console.dir(finalifo, { depth: null });
        const data = (() => {
          try {
            if (nodes.length > 1 && edges && subflow !== null) {
              if (subflow == 'DO') {
                let items;
                nodes.forEach((item, index) => {
                  if (item.type == 'customTargetItems') {
                    items = item.data;
                  }
                });

                if (items.length > 0) {
                  mappedData = {
                    ...mappedData,
                    artifact: {
                      ...mappedData?.artifact,
                      node: mappedData?.artifact?.node.map((item) => {
                        const matchingDataSet = items.filter(
                          (itemx) => itemx?.path.split('|')[1] === item?.nodeId,
                        );
                        if (matchingDataSet.length > 0) {
                          return {
                            ...item,
                            DataSet: matchingDataSet,
                          };
                        }
                        return item;
                      }),
                    },
                  };
                }
              }

              return edges.reduce((acc, items, index) => {
                if (items !== ' ') {
                  acc.push({
                    source_key: items['sourceHandle'],
                    target_key: items['targetHandle'],
                    sourcePath: items['source'],
                    targetPath: items['target'],
                  });
                }
                return acc;
              }, []);
            }
            if (nodes && edges.length === 0 && subflow !== null) {
              return [];
            }
          } catch (error) {
            console.error(error);
          }
        })();

        if (subflow === 'PO') {
          if (data) {
            const targetKeys = {};
            data.forEach((item) => {
              if (!targetKeys[item.target_key]) {
                targetKeys[item.target_key] = [];
              }
              targetKeys[item.target_key].push(item.source_key);
            });
            const mapper = Object.keys(targetKeys).map((targetKey) => ({
              sourceKey: targetKeys[targetKey],
              targetKey,
            }));
            if (mapper) {
              let mapperdata = mapper.map((item) => {
                const artifact = item?.targetKey.split(':')[11];
                const node = item?.targetKey.split('|')[1];
                const sourceKey = item.sourceKey;
                return { artifact, node, sourceKey };
              });

              let checknode = mapperdata.map((item) => {
                return item.node;
              });

              if (mapperdata && mapperdata.length > 0) {
                mapperdata.forEach((item) => {
                  const artifactName = item.artifact;
                  const nodeId = item.node;

                  const checkExistingartifact =
                    mappedData?.artifact?.name === artifactName;

                  if (checkExistingartifact) {
                    const checkExistingNode = mappedData?.artifact?.node.find(
                      (item) => item.nodeId === nodeId,
                    );

                    if (checkExistingNode) {
                      const mapobject = mapper.filter(
                        (item) => item.targetKey.split('|')[1] === nodeId,
                      );
                      checkExistingNode.mapper = mapobject.filter((item) => {
                        const existingMapperItem =
                          checkExistingNode?.mapper?.find((existingItem) => {
                            return existingItem?.sourceKey.some(
                              (sourceKeyItem) => {
                                return item.sourceKey.includes(sourceKeyItem);
                              },
                            );
                          });
                        const existingtargetItem =
                          checkExistingNode?.mapper?.find((existingItem) => {
                            return existingItem.targetKey === item.targetKey;
                          });

                        if (existingMapperItem && existingtargetItem) {
                          return true;
                        } else {
                          checkExistingNode?.mapper?.push(item);

                          return true;
                        }
                      });
                    } else {
                      checkExistingNode?.map((item) => {
                        return {
                          ...item,
                          mapper: [],
                          ifo: [],
                        };
                      });
                    }
                  }
                });

                if (
                  mappedData &&
                  mappedData?.artifact &&
                  mappedData?.artifact?.node &&
                  mapperdata.filter(
                    (item) => item.artifact === mappedData?.artifact?.name,
                  )
                ) {
                  const returndata = mappedData?.artifact?.node.map((item) => {
                    if (checknode.includes(item.nodeId)) {
                      return item;
                    }
                    if (mapper.length == 0) {
                      return {
                        ...item,
                        mapper: [],
                        ifo: [],
                      };
                    } else {
                      return {
                        ...item,
                        mapper: [],
                        ifo: [],
                      };
                    }
                  });
                  mappedData = {
                    ...mappedData,
                    artifact: {
                      ...mappedData?.artifact,
                      node: returndata,
                    },
                  };
                }
              }

              if (
                data &&
                data.length === 0 &&
                edges.length === 0 &&
                mappedData &&
                mappedData?.artifact &&
                mappedData?.artifact?.node
              ) {
                mappedData = {
                  ...mappedData,
                  artifact: {
                    ...mappedData?.artifact,
                    node: mappedData?.artifact?.node.map((item) => {
                      return {
                        ...item,
                        mapper: [],
                        ifo: [],
                      };
                    }),
                  },
                };
              }
            }
          }
        }
        mappedData = {
          ...mappedData,
          artifact: {
            ...mappedData?.artifact,
            node: mappedData?.artifact?.node.map((item) => {
              return {
                ...item,
                ifo: finalifo[item.nodeId]?.ifo || [],
              };
            }),
          },
        };
        orchestratorObj = {
          ...orchestratorObj,
          nodes: nodes,
          edges: edges,
          mappedData: mappedData,
        };

        return orchestratorObj;
      }
      return orchestratorObj;
    } catch (error) {
      console.error(error);
    }
  }

  handleDOIFO(subflow: subflowType, orchestratorObj) {
    try {
      if (
        !Array.isArray(orchestratorObj?.nodes) &&
        !Array.isArray(orchestratorObj?.edges)
      ) {
        return orchestratorObj;
      }
      if (
        Array.isArray(orchestratorObj?.nodes) &&
        Array.isArray(orchestratorObj?.edges)
      ) {
        const dupObj = _.cloneDeep(orchestratorObj);
        let mappedData = _.cloneDeep(dupObj?.mappedData);
        let nodes = _.cloneDeep(dupObj?.nodes);
        let edges = _.cloneDeep(dupObj?.edges);

        const data = (() => {
          try {
            if (nodes.length > 1 && edges && subflow !== null) {
              if (subflow == 'DO') {
                let items;
                nodes.forEach((item, index) => {
                  if (item.type == 'customTargetItems') {
                    items = item.data;
                  }
                });

                if (items.length > 0) {
                  mappedData = {
                    ...mappedData,
                    artifact: {
                      ...mappedData?.artifact,
                      node: mappedData?.artifact?.node.map((item) => {
                        const matchingDataSet = items.filter(
                          (itemx) => itemx?.path.split('|')[1] === item?.nodeId,
                        );
                        if (matchingDataSet.length > 0) {
                          return {
                            ...item,
                            DataSet: matchingDataSet,
                          };
                        }
                        return item;
                      }),
                    },
                  };
                }
              }

              return edges.reduce((acc, items, index) => {
                if (items !== ' ') {
                  acc.push({
                    source_key: items['sourceHandle'],
                    target_key: items['targetHandle'],
                    sourcePath: items['source'],
                    targetPath: items['target'],
                  });
                }
                return acc;
              }, []);
            }
            if (nodes && edges.length === 0 && subflow !== null) {
              return [];
            }
          } catch (error) {
            console.error(error);
          }
        })();

        let datas = [];
        let result = [];
        const handleifo = (id: string): any[] => {
          nodes.forEach((item) => {
            if (item.type == 'customSourceItems') {
              datas = item?.data?.schema;
            }
          });
          datas.map((item) => {
            if (item.nodeId == id) {
              return (result = item.ifo);
            }
          });

          return result;
        };

        mappedData = {
          ...mappedData,
          artifact: {
            ...mappedData?.artifact,
            node: mappedData?.artifact?.node.map((item) => {
              return {
                ...item,
                ifo: handleifo(item.nodeId) || [],
              };
            }),
          },
        };

        orchestratorObj = {
          ...orchestratorObj,
          nodes: nodes,
          edges: edges,
          mappedData: mappedData,
        };

        return orchestratorObj;
      }
      return orchestratorObj;
    } catch (error) {
      console.error(error);
    }
  }

  async handleSubFlowSave(
    subflow: subflowType,
    redisKey: string,
    resquestBody: any,
  ): Promise<any> {
    switch (subflow) {
      case 'UO':
        const uoRes = await this.handleUoSave(redisKey, resquestBody);
        return uoRes;
      case 'PO':
        const poRes = await this.handlePoSave(redisKey, resquestBody);
        return poRes;
      case 'DO':
        const doRes = await this.handleDoSave(redisKey, resquestBody);
        return doRes;
    }
  }

  async handleUoSave(redisKey: string, resquestBody: any) {
    try {
      let result = {
        UO: resquestBody?.data,
      };
      let prevData = await this.getJson(redisKey, 'UO')
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });

      if (prevData && Object.keys(prevData).length > 0) {
        let temp = {};
        Object.keys(prevData).forEach((key) => {
          if (key !== 'logicCenterData' && key !== 'securityCenterData') {
            temp[key] = prevData[key];
          }
        });

        result = {
          ...result,
          UO: {
            ...temp,
            ...result?.UO,
          },
        };
      }

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async handlePoSave(redisKey: string, resquestBody: any) {
    try {
      let result = {
        PO: resquestBody?.data,
      };
      let prevData = await this.getJson(redisKey, 'PO')
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.error(error);
        });

      if (prevData && Object.keys(prevData).length > 0) {
        let temp = {};
        Object.keys(prevData).forEach((key) => {
          if (key !== 'logicCenterData' && key !== 'securityCenterData') {
            temp[key] = prevData[key];
          }
        });

        result = {
          ...result,
          PO: {
            ...temp,
            ...result?.PO,
          },
        };
      }
      if (Array.isArray(result?.PO?.edges)) {
        const finalKey = this.commonTmServices.convert8keysinto16keys(
          JSON.parse(redisKey),
          false,
        );

        let finalised = '';
        const objkeys = Object.keys(finalKey);
        objkeys.pop();
        for (let i = 0; i < objkeys.length; i++) {
          if (finalised) {
            finalised =
              finalised + ':' + objkeys[i] + ':' + finalKey[objkeys[i]];
          } else {
            finalised = objkeys[i] + ':' + finalKey[objkeys[i]];
          }
        }
        if (!_.isEmpty(result?.PO?.selectedSource)) {
          const source = result?.PO?.selectedSource.map(
            (sources: any) => sources?.path,
          );
          await this.removeTargetKeyOnEvents(source, finalised);
        }
        if (!_.isEmpty(result?.PO?.edges)) {
          await this.updateTargetKeyOnEvents(result?.PO?.edges, finalised);
        }
      }

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async handleDoSave(redisKey: string, resquestBody: any) {
    try {
      let prevData = await this.getJson(redisKey, 'DO')
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.error(error);
        });
      const fabric = JSON.parse(redisKey)[2];
      if (fabric === 'DF-DFD') {
        let result = {
          DO: resquestBody?.data,
        };

        let targetItems = null;
        if (result?.DO?.nodes) {
          result?.DO?.nodes.forEach((node) => {
            if (node?.type === 'customTargetItems') {
              if (node?.data) targetItems = node?.data;
              else targetItems = [];
            }
          });
        }

        let temp = {};
        if (prevData && Object.keys(prevData).length > 0) {
          Object.keys(prevData).forEach((key) => {
            if (key !== 'logicCenterData' && key !== 'securityCenterData') {
              temp[key] = prevData[key];
            }
          });
        }
        result = {
          ...result,
          DO: {
            ...temp,
            ...result?.DO,
          },
        };
        if (Array.isArray(targetItems)) {
          result = {
            ...result,
            DO: {
              ...result?.DO,
              targetItems: targetItems,
            },
          };
          const dstKey = redisKey.replace('DF-DFD', 'DF-DST');
          await this.saveaWorkFlow({
            redisKey: JSON.parse(dstKey),
            subflow: 'DO',
            data: {
              targetItems: targetItems,
            },
          });
        }

        return result;
      } else {
        let result = {
          DO: { ...prevData, ...resquestBody?.data },
        };
        return result;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getEventSummaryAndNodeProperty(nodes, oldSummary) {
    try {
      let eventSummary = this.convertToNewFormat(nodes) || {};
      if (oldSummary) {
        eventSummary = this.commonTmServices.findDiffAndChangeDiffInObject(
          eventSummary,
          oldSummary,
          ['targetKey', 'ifo'],
          ['id'],
        );
      }
      let NDP =
        nodes &&
        nodes.reduce((acc, node) => {
          if (
            node?.data?.nodeProperty &&
            Object.keys(node?.data?.nodeProperty).length > 0
          ) {
            acc[node.id] = node?.data?.nodeProperty;
          }
          return acc;
        }, {});
      return {
        eventSummary: eventSummary,
        NDP: NDP,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  convertToNewFormat(nodes) {
    try {
      const cycleNodes = (children = '') => {
        let data = {};
        let uniqueId = [];
        nodes.map((node) => {
          if (
            !children &&
            node.data.sequence == 1 &&
            !uniqueId.includes(node.id)
          ) {
            uniqueId.push(node.id);
            let children = [];

            node.data.children.forEach((child) => {
              let data = cycleNodes(child);
              if (data) children.push({ ...data });
            });
            data = {
              ...data,
              id: node.id,
              eventContext: node.eventContext,
              value: node.data.value,
              type:
                node.type == 'controlNode' || node.type == 'groupNode'
                  ? node.data.nodeType
                  : node.type,
              key: node.type == 'screen' ? node?.key : '',
              name: node.data.label || node.data.nodeName,
              sequence: node.data.sequence,

              children: [...children],
            };
            if (node?.data?.nodeProperty?.hlr) {
              data = {
                ...data,
                hlr: node?.data?.nodeProperty?.hlr,
              };
            }
            if (node?.data?.value) {
              data = {
                ...data,
                value: node.data.value,
              };
            }
            if (node.data.hasOwnProperty('targetId')) {
              data['targetID'] = node.data.targetId;
            }
          }

          if (
            children == node.id &&
            node.data.children.length > 0 &&
            !uniqueId.includes(node.id)
          ) {
            uniqueId.push(node.id);
            let children = [];
            node.data.children.forEach((child) => {
              let data = cycleNodes(child);
              if (data) children.push({ ...data });
            });
            data = {
              ...data,
              id: node.id,
              eventContext: node.eventContext,
              value: node.data.value,
              type:
                node.type == 'controlNode' || node.type == 'groupNode'
                  ? node.data.nodeType
                  : node.type,
              name: node.data.label || node.data.nodeName,
              key: node.type == 'screen' ? node.key : '',
              sequence: node.data.sequence,
              children: [...children],
            };
            if (node?.data?.nodeProperty?.hlr) {
              data = {
                ...data,
                hlr: node?.data?.nodeProperty?.hlr,
              };
            }
            if (node?.data?.value) {
              data = {
                ...data,
                value: node?.data?.value,
              };
            }
            if (node.data.hasOwnProperty('targetId')) {
              data['targetID'] = node.data.targetId;
            }
          }
          if (
            children == node.id &&
            node.data.children.length == 0 &&
            !uniqueId.includes(node.id)
          ) {
            uniqueId.push(node.id);
            data = {
              ...data,
              id: node.id,

              eventContext: node.eventContext,
              value: node.data.value,
              type:
                node.type == 'controlNode' || node.type == 'groupNode'
                  ? node.data.nodeType
                  : node.type,
              name: node.data.label || node.data.nodeName,
              key: node.type == 'screen' ? node.key : '',
              sequence: node.data.sequence,
              children: [],
            };
            if (node?.data?.nodeProperty?.hlr) {
              data = {
                ...data,
                hlr: node?.data?.nodeProperty?.hlr,
              };
            }
            if (node?.data?.value) {
              data = {
                ...data,
                value: node.data.value,
              };
            }
            if (node.data.hasOwnProperty('targetId')) {
              data['targetID'] = node.data.targetId;
            }
          }
        });
        if (Object.keys(data).length > 0) return data;
        else return null;
      };

      return cycleNodes();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async convertedForEvents(keys) {
    try {
      let result = await this.apiService
        .readKeys(keys)
        .then((res) => JSON.parse(res));
      // console.dir(result?.mappedData, { depth: null });
      if (result?.mappedData) {
        return this.commonTmServices.convertMappedDataEventsToEvents(
          result?.mappedData?.artifact,
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateTargetKeyOnEvents(poEdges: Array<any>, targetArtiafct: string) {
    try {
      let finalData = {};
      let isInitial = new Set([]);

      for (let i = 0; i < poEdges.length; i++) {
        let artifactKey: string = poEdges[i].sourceHandle.split('|')[0];
        let currentTarget: string = poEdges[i].target;
        let component, control, event;
        let sourceHandle: string[] = poEdges[i].sourceHandle.split('|');
        let dropdownHandle: string[] = sourceHandle[1].split('/');
        let handleName: string[];
        let handleValue: string[];

        const artifactName: string = artifactKey.split(':')?.[11];
        const handlers: string[] = sourceHandle[2]
          .split('/')
          .join(',')
          .split(',');

        if (dropdownHandle.length === 1) {
          [event] = dropdownHandle;

          handleName = ['name', 'name', 'id'];
          handleValue = [artifactName, artifactName, event, ...handlers];
        }
        if (dropdownHandle.length === 2) {
          [component, event] = dropdownHandle;

          handleName = ['name', 'nodeId', 'id', 'id'];
          handleValue = [
            artifactName,
            component,
            component,
            event,
            ...handlers,
          ];
        }
        if (dropdownHandle.length === 3) {
          [component, control, event] = dropdownHandle;

          handleName = ['name', 'nodeId', 'elementId', 'id', 'id'];
          handleValue = [
            artifactName,
            component,
            control,
            control,
            event,
            ...handlers,
          ];
        }

        let redisKey =
          this.commonTmServices.convert16keysinto8keys(artifactKey);
        let res: any;
        if (finalData?.[artifactKey]) {
          res = finalData?.[artifactKey];
        } else {
          res = await this.apiService.readKeys({ ...redisKey, AFSK: 'UO' });
          res = !_.isEmpty(res) ? JSON.parse(res) : {};
        }

        handlers.forEach(() => {
          handleName.push('id');
        });
        if (
          Array.isArray(handleName) &&
          Array.isArray(handleValue) &&
          handleName.length === handleValue.length
        ) {
          let prevTargetKeys: Array<string> | any =
            this.commonTmServices.handlNestedObj(
              'get',
              '',
              'targetKey',
              handleName,
              handleValue,
              res?.mappedData,
            );

          if (
            !isInitial.has(currentTarget + ':' + artifactKey) &&
            Array.isArray(prevTargetKeys) &&
            prevTargetKeys.length > 0
          ) {
            prevTargetKeys = prevTargetKeys.filter(
              (targetKey) => !targetKey.startsWith(currentTarget),
            );
          }
          isInitial.add(currentTarget + ':' + artifactKey);
          if (Array.isArray(prevTargetKeys)) {
            prevTargetKeys.push(poEdges[i].targetHandle);
          } else prevTargetKeys = [poEdges[i].targetHandle];

          res = {
            ...res,
            mappedData: this.commonTmServices.handlNestedObj(
              'set',
              prevTargetKeys,
              'targetKey',
              handleName,
              handleValue,
              res?.mappedData,
              true,
            ),
          };

          finalData = {
            ...finalData,
            [artifactKey]: res,
          };
        }
      }

      let keys = Object.keys(finalData);
      let result = new Set([]);
      for (let i = 0; i < keys.length; i++) {
        const resposne = await this.redisService.setJsonData(
          keys[i] + ':UO',
          JSON.stringify(finalData[keys[i]]),
        );
        result.add(resposne);
      }
      if (result.size === 1) {
        return {
          data: 'success',
          status: 200,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async removeTargetKeyOnEvents(source: Array<string>, targetArtiafct: string) {
    try {
      if (_.isEmpty(source) && _.isEmpty(targetArtiafct))
        throw error('source or artifactkey is empty');

      const filterTargetKeys = (targetKeyObject: any) => {
        if (_.isEmpty(targetKeyObject) && Array.isArray(targetKeyObject))
          return targetKeyObject;
        const { targetKey } = targetKeyObject;
        if (Array.isArray(targetKey) && targetKey.length > 0) {
          const newTargetKeys = targetKey.filter(
            (id: string) => !id.startsWith(targetArtiafct),
          );
          if (_.isEmpty(newTargetKeys)) {
            delete targetKeyObject['targetKey'];
          } else {
            targetKeyObject = {
              ...targetKeyObject,
              targetKey: newTargetKeys,
            };
          }
        } else {
          delete targetKeyObject['targetKey'];
        }
        return targetKeyObject;
      };

      for (let i = 0; i < source.length; i++) {
        let redisKey = this.commonTmServices.convert16keysinto8keys(source[i]);
        let res = await this.apiService.readKeys({ ...redisKey, AFSK: 'UO' });
        res = JSON.parse(res);
        const mappedData = this.commonTmServices.findAndExceute(
          res?.mappedData,
          'targetKey',
          filterTargetKeys,
          false,
          ['mapper', 'action', 'ifo', 'code', 'rule'],
        );
        res = {
          ...res,
          mappedData: mappedData,
        };
        await this.redisService.setJsonData(
          source[i] + ':UO',
          JSON.stringify(res),
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  async updateTargetIfoOnEvents(allNodes: any, targetArtiafct: any) {
    try {
      let finalData = {};
      const allNodesArr = Object.keys(allNodes);
      for (let i = 0; i < allNodesArr.length; i++) {
        let [artifactKey, dropdownHandle] = allNodesArr[i].split('.');
        let dropdownHandleArr = dropdownHandle.split('/');
        let component, control, event, updaterType;
        if (dropdownHandleArr.length === 1) {
          [event] = dropdownHandleArr;
          updaterType = 'artifact';
        } else if (dropdownHandleArr.length === 2) {
          [component, event] = dropdownHandleArr;
          updaterType = 'node';
        } else if (dropdownHandleArr.length === 3) {
          [component, control, event] = dropdownHandleArr;
          updaterType = 'objElem';
        }
        const arr = allNodes[allNodesArr[i]].data.dfo;
        for (let i = 0; i < arr.length; i++) {
          const handlers = arr[i].nodeName.split('/');
          let handleName =
            updaterType === 'node'
              ? ['nodeName', 'name']
              : updaterType === 'objElem'
                ? ['nodeName', 'elementName', 'name']
                : ['name'];
          let handleValue =
            updaterType === 'node'
              ? [component, event, ...handlers]
              : updaterType === 'objElem'
                ? [component, control, event, ...handlers]
                : [event, ...handlers];

          let redisKey =
            this.commonTmServices.convert16keysinto8keys(artifactKey);
          let res =
            JSON.stringify(finalData?.[artifactKey]) ??
            (await this.apiService.readKeys({ ...redisKey, AFSK: 'UO' }));
          handlers.forEach(() => {
            handleName.push('name');
          });
          res = res ? JSON.parse(res) : {};
          if (
            handleName &&
            handleValue &&
            Array.isArray(handleName) &&
            Array.isArray(handleValue) &&
            handleName.length === handleValue.length
          ) {
            if (updaterType === 'artifact') {
              res = {
                ...res,
                mappedData: {
                  ...res.mappedData,
                  artifact: {
                    ...res.mappedData.artifact,
                    events: {
                      ...res.mappedData.artifact.events,
                      eventSummary: {
                        ...res.mappedData.artifact.events.eventSummary,
                        children:
                          this.commonTmServices.handlNestedObj(
                            'set',
                            arr[i].ifo ? [...arr[i].ifo] : [],
                            'targetIfo',
                            handleName,
                            handleValue,
                            res?.mappedData?.artifact.events.eventSummary
                              .children,
                            true,
                          ) ??
                          res?.mappedData?.artifact.events.eventSummary
                            .children,
                      },
                    },
                  },
                },
              };
            } else {
              res = {
                ...res,
                mappedData: {
                  ...res.mappedData,
                  artifact: {
                    ...res.mappedData.artifact,
                    node:
                      this.commonTmServices.handlNestedObj(
                        'set',
                        arr[i].ifo ? [...arr[i].ifo] : [],
                        'targetIfo',
                        handleName,
                        handleValue,
                        res?.mappedData?.artifact?.node,
                        true,
                      ) ?? res?.mappedData?.artifact?.node,
                  },
                },
              };
            }
            finalData = {
              ...finalData,
              [artifactKey]: res,
            };
          }
        }
      }
      let keys = Object.keys(finalData);
      let result;
      for (let i = 0; i < keys.length; i++) {
        result = await this.redisService.setJsonData(
          keys[i] + ':UO',
          JSON.stringify(finalData[keys[i]]),
        );
      }
      if (result === 'Value Stored') {
        return {
          data: 'success',
          status: 200,
        };
      }
    } catch (error) {}
  }
}
