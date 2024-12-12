import { BadRequestException, HttpException, Injectable } from '@nestjs/common';

import { ApiService } from 'src/apiService';
import { CommonTmServices } from '../commonTmServices';
const _ = require('lodash');
@Injectable()
export class ModellerService {
  constructor(
    private readonly commonTmServices: CommonTmServices,
    private readonly apiService: ApiService,
  ) {}
  async getJson(redisKey: string): Promise<any> {
    try {
      let arrKey = JSON.parse(redisKey);
      let key = '';
      const hasEmptyElement =
        this.commonTmServices.checkArrayHasEmptyElement(arrKey);
      if (hasEmptyElement) {
        throw new BadRequestException('Key is empty');
      } else {
        if (arrKey.length > 0) {
          key = arrKey.join(':');
        }

        let res = {};
        let getKyes = [
          { getKey: 'NDS', sendKey: 'nodes' },
          { getKey: 'NDE', sendKey: 'nodeEdges' },
          { getKey: 'NDP', sendKey: 'nodeProperty' },
          { getKey: 'AFI', sendKey: 'AFI' },
        ];
        if (
          (arrKey[2] === 'UF-UFM' || arrKey[2] === 'UF-UFW' || arrKey[2] === 'UF-UFD') &&
          arrKey[1] === 'AF'
        ) {
          getKyes.shift();
          getKyes.push({ getKey: 'NDU', sendKey: 'nodes' });
        }
        if (arrKey[2] === 'AIF-AIFD') {
          getKyes = [{ getKey: 'n8nWorkflowId', sendKey: 'n8nWorkflowId' }];
        }

        let finalKey = this.commonTmServices.convert8keysinto16keys(arrKey);
        for (let i = 0; i < getKyes.length; i++) {
          const getKey = getKyes[i].getKey;
          const sendKey = getKyes[i].sendKey;
          res[sendKey] = await this.apiService
            .readKeys({
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
              throw new BadRequestException(err);
            });
        }

        if (arrKey[2] !== 'AIF-AIFD') {
          let node =
            res?.['nodes'] && res?.['nodes'].length > 0
              ? res?.['nodes']?.map((node) => {
                  if (
                    res.hasOwnProperty('nodeProperty') &&
                    res['nodeProperty'].hasOwnProperty(node.id)
                  ) {
                    return {
                      ...node,
                      data: {
                        ...node.data,

                        nodeProperty: res['nodeProperty'][node.id],
                      },
                    };
                  } else {
                    return {
                      ...node,
                      data: {
                        ...node.data,
                        nodeProperty: {},
                      },
                    };
                  }
                })
              : [];
          res = {
            ...res,
            nodes: node,
            isLocked: true,
          };
        }
        let AFI = res?.['AFI'];
        if (AFI) {
          let date = AFI?.updatedOn || AFI?.createdOn;
          let updatedon =
            this.commonTmServices.calculateRecentlyWorkingDetails(date);

          res = {
            ...res,
            currentUpdation: updatedon,
          };
        }

        this.commonTmServices.setArtifactLockin(key + ':AFI', true);
        return {
          data: res,
          status: 200,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async getAFK(redisKey): Promise<any> {
    try {
      let arrKey = JSON.parse(redisKey);
      let key = '';
      const hasEmptyElement =
        this.commonTmServices.checkArrayHasEmptyElement(arrKey);
      if (hasEmptyElement) {
        throw new BadRequestException('Key is empty');
      } else {
        if (arrKey.length > 0) {
          key = arrKey.join(':');
        }

        const finalKey =
          await this.commonTmServices.convert8keysinto16keys(arrKey);
        const aritfact = await this.apiService
          .readKeys({
            ...finalKey,
            stopsAt: 'AFK',
          })
          .then((data) => {
            if (data && data.length > 0) {
              let result = [];
              data.forEach((item) => {
                if (item?.AFGK == arrKey[arrKey.length - 1]) {
                  if (
                    Array.isArray(item?.AFKList) &&
                    item?.AFKList.length > 0
                  ) {
                    item?.AFKList.forEach((ak) => {
                      result.push(ak?.AFK);
                    });
                  }
                }
              });

              const filterEmpty = result.filter((item) => {
                return item !== '' && item !== undefined && item !== null;
              });

              return filterEmpty;
            }

            return [];
          })
          .catch((err) => {
            throw new BadRequestException(err);
          });

        // const sortedAartifact = aritfact.sort((a, b) => {
        // const numA = parseInt(a.replace(/\D+/g, '')) || 0;
        // const numB = parseInt(b.replace(/\D+/g, '')) || 0;

        // if (isNaN(numA) && isNaN(numB)) {
        // return a.localeCompare(b);
        // }

        // if (isNaN(numA)) {
        // return 1;
        // }

        // if (isNaN(numB)) {
        // return -1;
        // }

        // return numA - numB;
        // });
        return {
          data: aritfact.sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) {
              return -1;
            }
            if (a.toLowerCase() > b.toLowerCase()) {
              return 1;
            }
            return 0;
          }),
          status: 200,
        };
      }
    } catch (error) {
      throw error;
    }
  }
  async getAFKwithAFVK(redisKey): Promise<any> {
    try {
      let arrKey = JSON.parse(redisKey);
      let key = '';
      const hasEmptyElement =
        this.commonTmServices.checkArrayHasEmptyElement(arrKey);
      if (hasEmptyElement) {
        throw new BadRequestException('Key is empty');
      } else {
        if (arrKey.length > 0) {
          key = arrKey.join(':');
        }
        const finalKey = this.commonTmServices.convert8keysinto16keys(arrKey);

        const aritfacts = await this.apiService
          .readKeys({
            ...finalKey,
            stopsAt: 'AFK',
          })
          .then((data) => {
            if (data && data.length > 0) {
              let result = [];
              data.forEach((item) => {
                if (item?.AFGK == arrKey[arrKey.length - 1]) {
                  if (
                    Array.isArray(item?.AFKList) &&
                    item?.AFKList.length > 0
                  ) {
                    item?.AFKList?.forEach((ak) => {
                      result.push(ak?.AFK);
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
            throw new BadRequestException(error);
          });

        let response = [];

        for (let artifact of aritfacts) {
          if (artifact)
            response.push({
              artifact: artifact,
              versionList: await this.getAFVK(artifact, redisKey).then(
                (res) => res.data,
              ),
            });
        }

        return {
          data: response,
          status: 200,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async getAFVK(artifact, redisKey): Promise<any> {
    try {
      let arrKey = JSON.parse(redisKey);
      let key = '';
      arrKey.push(artifact);
      const hasEmptyElement =
        this.commonTmServices.checkArrayHasEmptyElement(arrKey);
      if (hasEmptyElement) {
        throw new BadRequestException('Key is empty in getAFVK');
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
          })
          .catch((err) => {
            throw new BadRequestException(err);
          });
        let newV = [];
        version.forEach((element) => {
          newV.push(Number(element.split('v')[1]));
        });
        let newVs = newV.sort((a, b) => a - b);
        newVs = newVs.map((element) => 'v' + element);
        return {
          data: newVs,
          status: 200,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async saveaWorkFlow(
    req: any,
    type: string,
    version: any,
    fabrics: 'DF-ERD' | 'UF-UFM' | 'UF-UFW' | 'UF-UFD' | 'PF-PFD' | 'DF-DFD' | 'AIF-AIFD',
  ): Promise<any> {
    try {
      let source = 'redis';
      const SchemaValidation: any = {
        'UF-UFD': [
          'CK:TRL:FNGK:AFRS:FNK:UF-UFD:CATK:Validator:AFGK:Json:AFK:Schema:AFVK:v1:NDS',
          'CK:TRL:FNGK:AFRS:FNK:UF-UFD:CATK:Validator:AFGK:Json:AFK:Schema:AFVK:v1:UFS',
        ],
        'PF-PFD': [
          'CK:TRL:FNGK:AFRS:FNK:PF-PFD:CATK:pfcatalog:AFGK:pf:AFK:NDP:AFVK:v1:NDS',
          'CK:TRL:FNGK:AFRS:FNK:PF-PFD:CATK:pfcatalog:AFGK:pf:AFK:NDP:AFVK:v1:NDE',
          'CK:TRL:FNGK:AFRS:FNK:PF-PFD:CATK:pfcatalog:AFGK:pf:AFK:NDP:AFVK:v1:PFS',
        ],

        'DF-DFD': [
          'CK:TRL:FNGK:AFRS:FNK:DF-DFD:CATK:Validator:AFGK:Json:AFK:Schema:AFVK:v1:NDS',
          'CK:TRL:FNGK:AFRS:FNK:DF-DFD:CATK:Validator:AFGK:Json:AFK:Schema:AFVK:v1:NDE',
          'CK:TRL:FNGK:AFRS:FNK:DF-DFD:CATK:Validator:AFGK:Json:AFK:Schema:AFVK:v1:DFS',
        ],
        'DF-ERD': [
          'CK:TRL:FNGK:AFRS:FNK:DF-ERD:CATK:Validator:AFGK:Json:AFK:Schema:AFVK:v1:NDS',
        ],
      };

      let redisKey = JSON.stringify(req.redisKey);
      let arrKey = JSON.parse(redisKey);
      let keys = '';
      const hasEmptyElement =
        this.commonTmServices.checkArrayHasEmptyElement(arrKey);
      if (hasEmptyElement) {
        throw new BadRequestException('Key is empty');
      } else {
        let result = {};
        if (arrKey.length > 0) {
          keys = arrKey.join(':');
        }
        if (fabrics === 'AIF-AIFD') {
          result = {
            n8nWorkflowId: req.flow.n8nWorkflowId,
          };
          let newVersion = 'v1';
          if (type === 'create') {
            let versionList = await this.getAFVK(req.artifact, redisKey);
            if (
              versionList &&
              versionList.status === 200 &&
              versionList.data &&
              versionList.data.length > 0
            ) {
              let lastVersion = versionList.data?.[versionList.data.length - 1];
              newVersion = `v${Number(lastVersion.split('v')[1]) + 1}`;
            }
          } else {
            if (version !== 'new version') {
              newVersion = version;
            } else {
              throw new HttpException('Invalid version', 400, {
                cause: new Error(),
                description: 'version is not valid',
              });
            }
          }

          arrKey.push(req.artifact);
          arrKey.push(newVersion);
          const finalKey = this.commonTmServices.convert8keysinto16keys(
            arrKey,
            false,
          );

          const objKeys = Object.keys(result);
          const resp = new Set([]);
          for (let i = 0; i < objKeys.length; i++) {
            const response = await this.apiService.writeMDK({
              SOURCE: 'redis',
              TARGET: 'redis',
              ...finalKey,
              AFSK: {
                [objKeys[i]]: result[objKeys[i]],
              },
            });
            resp.add(response);
          }
          if (resp.size === 1) {
            await this.commonTmServices.manageArtifactInfo(
              req?.userId,
              type,
              keys + ':' + req.artifact + ':' + newVersion,
            );

            let AFI = await this.apiService
              .readKeys({
                ...finalKey,
                AFSK: 'AFI',
              })
              .then((data) => {
                if (data) return JSON.parse(data);
              })
              .catch((error) => {
                console.error(error);
              });

            let currentUpdation;
            if (AFI) {
              let date = AFI?.updatedOn || AFI?.createdOn;
              currentUpdation =
                this.commonTmServices.calculateRecentlyWorkingDetails(date);
            }
            if (type === 'create') {
              let versions = await this.getAFVK(req.artifact, redisKey);
              if (versions && versions.status === 200) {
                return {
                  status: 200,
                  data: versions.data,
                  currentUpdation,
                };
              } else {
                return {
                  status: 400,
                  data: [],
                };
              }
            } else {
              return {
                msg: `${version} Updated`,
                status: 201,
                currentUpdation,
              };
            }
          } else {
            throw new BadRequestException('something went wrong when saving');
          }
        } else {
          let nodes = structuredClone(req.flow.nodes);
          let edges = structuredClone(req.flow.nodeEdges);

          if (fabrics === 'UF-UFW' || fabrics === 'UF-UFM' || fabrics === 'UF-UFD') {
            result = {
              NDU: nodes,
            };
            nodes = nodes.filter((node) => node.id !== 'root');
          }
          let idsinNodes = new Set([]);
          nodes.forEach((node) => {
            idsinNodes.add(node.id);
          });
          edges = edges.filter((edge) => {
            return idsinNodes.has(edge.source) && idsinNodes.has(edge.target);
          });

          let nodeProperty = {};

          nodes.forEach((element) => {
            nodeProperty[element.id] = {
              nodeId: element.id,
              nodeName: element.data.label,
              nodeType: element.type,
              ...element.data.nodeProperty,
            };
          });
          if (!_.isEmpty(nodes))
            nodes = nodes.map((node) => ({
              ...node,
              data: {
                ...node?.data,
                nodeProperty: {
                  nodeId: node.id,
                  nodeName: node.data.label,
                  nodeType: node.type,
                  ...node?.data?.nodeProperty,
                },
              },
            }));
          result = {
            ...result,
            NDS: nodes,
            NDP: nodeProperty,
            NDE: edges,
          };
          if (fabrics === 'UF-UFW' || fabrics === 'UF-UFM' || fabrics === 'UF-UFD') {
            let ufs = this.commonTmServices.transformNode(nodes);
            result = {
              ...result,
              UFS: ufs,
            };
          }
          if (fabrics == 'DF-ERD') {
            nodeProperty = { ...this.erdSummary(edges, nodes, nodeProperty) };
            result = {
              ...result,
              NDP: nodeProperty,
            };
          }
          if (fabrics == 'PF-PFD') {
            if (nodes.length > 0 && edges.length > 0) {
              let condiforStart = false;
              let condiforEnd = false;
              let ids = new Set([]);
              nodes.forEach((node) => {
                if (node.type === 'startnode') {
                  condiforStart = true;
                }

                if (node.type === 'endnode') {
                  condiforEnd = true;
                }
              });
              if (nodes.length > 0) {
                nodes.forEach((node) => {
                  ids.add(node.id);
                });
              }
              nodes = nodes.map((node) => {
                if (node?.['T_parentId'] && node?.['T_parentId'].length > 0) {
                  return {
                    ...node,

                    T_parentId: node['T_parentId'].filter((v) => ids.has(v)),
                  };
                }
                return node;
              });

              if (condiforStart && condiforEnd) {
                let sd = this.processFabricSummary(edges, nodes);
                let processflowapi = this.sortProcessFabricSummary(sd);
                result = {
                  ...result,
                  PFS: processflowapi,
                };
              }
            }
          }

          if (fabrics == 'DF-DFD') {
            if (nodes.length > 0 && edges.length > 0) {
              let condiforStart = false;
              let condiforEnd = false;
              let ids = new Set([]);
              nodes.forEach((node) => {
                if (node.type === 'startnode') {
                  condiforStart = true;
                }

                if (node.type === 'endnode') {
                  condiforEnd = true;
                }
              });

              let NDP = {};
              if (nodes.length > 0) {
                nodes.forEach((node) => {
                  ids.add(node.id);
                  if (node?.type !== 'startnode' && node?.type !== 'endnode')
                    NDP[node.id] = {
                      ...node.data.nodeProperty,
                      nodeType: node?.property?.nodeType,
                      nodeName: node?.data?.label,
                    };
                });
              }
              nodes = nodes.map((node) => {
                if (node?.['T_parentId'] && node?.['T_parentId'].length > 0) {
                  return {
                    ...node,

                    T_parentId: node['T_parentId'].filter((v) => ids.has(v)),
                  };
                }
                return node;
              });

              if (condiforStart && condiforEnd) {
                // let processFabricSummary = this.findFlowForProcessFabric(
                // nodes,
                // edges,
                // );
                let sd = this.processFabricSummary(edges, nodes);
                let dataflowapi = this.sortProcessFabricSummary(sd);

                result = {
                  ...result,

                  DFS: dataflowapi,
                };
              }
              result = {
                ...result,
                NDP: NDP,
              };
            }
          }

          let newVersion = 'v1';
          if (type === 'create') {
            let versionList = await this.getAFVK(req.artifact, redisKey);
            if (
              versionList &&
              versionList.status === 200 &&
              versionList.data &&
              versionList.data.length > 0
            ) {
              let lastVersion = versionList.data?.[versionList.data.length - 1];
              newVersion = `v${Number(lastVersion.split('v')[1]) + 1}`;
            }
          } else {
            if (version !== 'new version') {
              newVersion = version;
            } else {
              throw new HttpException('Invalid version', 400, {
                cause: new Error(),
                description: 'version is not valid',
              });
            }
          }

          arrKey.push(req.artifact);
          arrKey.push(newVersion);
          const finalKey = this.commonTmServices.convert8keysinto16keys(
            arrKey,
            false,
          );

          // if (fabrics == 'UF-UFD') {
          // if (req.flow.nodes.length > 0) {
          // let schema = await this.apiService.validateJson(
          // source,
          // SchemaValidation['UF-UFD'],
          // [req.flow.nodes, result['UFS']],
          // );

          // if (schema === 'Validation successfully') {
          // const objKeys = Object.keys(result);
          // for (let i = 0; i < objKeys.length; i++) {
          // await this.apiService.writeMDK({
          // SOURCE: 'redis',
          // TARGET: 'redis',
          // ...finalKey,
          // AFSK: {
          // [objKeys[i]]: result[objKeys[i]],
          // },
          // });
          // }
          // }
          // }
          // }

          // if (fabrics == 'PF-PFD') {
          // if (req.flow.nodes.length > 0) {
          // let schema = await this.apiService.validateJson(
          // source,
          // SchemaValidation['PF-PFD'],
          // [req.flow.nodes, req.flow.nodeEdges, result['PFS']],
          // );

          // if (schema === 'Validation successfully') {
          // const objKeys = Object.keys(result);
          // for (let i = 0; i < objKeys.length; i++) {
          // await this.apiService.writeMDK({
          // SOURCE: 'redis',
          // TARGET: 'redis',
          // ...finalKey,
          // AFSK: {
          // [objKeys[i]]: result[objKeys[i]],
          // },
          // });
          // }
          // }
          // }
          // }
          // if (fabrics == 'DF-DFD') {
          // let schema = await this.apiService.validateJson(
          // source,
          // SchemaValidation['DF-DFD'],
          // [req.flow.nodes, req.flow.nodeEdges, result['DFS']],
          // );

          // if (schema === 'Validation successfully') {
          // const objKeys = Object.keys(result);
          // for (let i = 0; i < objKeys.length; i++) {
          // await this.apiService.writeMDK({
          // SOURCE: 'redis',
          // TARGET: 'redis',
          // ...finalKey,
          // AFSK: {
          // [objKeys[i]]: result[objKeys[i]],
          // },
          // });
          // }
          // }
          // }
          // if (fabrics == 'DF-ERD') {
          // let schema = await this.apiService.validateJson(
          // source,
          // SchemaValidation['DF-ERD'],
          // [req.flow.nodes],
          // );

          // if (schema === 'Validation successfully') {
          // const objKeys = Object.keys(result);
          // for (let i = 0; i < objKeys.length; i++) {
          // await this.apiService.writeMDK({
          // SOURCE: 'redis',
          // TARGET: 'redis',
          // ...finalKey,
          // AFSK: {
          // [objKeys[i]]: result[objKeys[i]],
          // },
          // });
          // }
          // }
          // }

          const objKeys = Object.keys(result);
          const resp = new Set([]);
          for (let i = 0; i < objKeys.length; i++) {
            const response = await this.apiService.writeMDK({
              SOURCE: 'redis',
              TARGET: 'redis',
              ...finalKey,
              AFSK: {
                [objKeys[i]]: result[objKeys[i]],
              },
            });
            resp.add(response);
          }
          if (resp.size === 1) {
            await this.commonTmServices.manageArtifactInfo(
              req?.userId,
              type,
              keys + ':' + req.artifact + ':' + newVersion,
            );

            let AFI = await this.apiService
              .readKeys({
                ...finalKey,
                AFSK: 'AFI',
              })
              .then((data) => {
                if (data) return JSON.parse(data);
              })
              .catch((error) => {
                console.error(error);
              });

            let id = `CK:${arrKey[0]}:FNGK:${arrKey[1]}:FNK:DF-DFD:CATK:${arrKey[3]}:AFGK:${arrKey[4]}:AFK:${arrKey[5]}:AFVK:${arrKey[6]}`;

            let currentUpdation;
            if (AFI) {
              let date = AFI?.updatedOn || AFI?.createdOn;
              currentUpdation =
                this.commonTmServices.calculateRecentlyWorkingDetails(date);
            }
            if (type === 'create') {
              let versions = await this.getAFVK(req.artifact, redisKey);
              if (versions && versions.status === 200) {
                return {
                  status: 200,
                  data: versions.data,
                  currentUpdation,
                };
              } else {
                return {
                  status: 400,
                  data: [],
                };
              }
            } else {
              return {
                msg: `${version} Updated`,
                status: 201,
                currentUpdation,
              };
            }
          } else {
            throw new BadRequestException('something went wrong when saving');
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  erdSummary(edges, nodes, nodeConfig) {
    try {
      const processFlow = () => {
        const resultObj = { ...nodeConfig };
        if (!edges || edges?.length == 0 || nodes.length > 0) {
          nodes.map((node) => {
            if (!resultObj[node.id])
              resultObj[node.id] = {
                nodeName: node.data.label,
                entities: {
                  Entity: node.data.label,
                  attributes: [],
                  methods: [],
                  relationships: [],
                },
              };
            else {
              resultObj[node.id] = {
                ...resultObj[node.id],
                nodeName: node.data.label,
                entities: {
                  ...resultObj[node.id].entities,
                  Entity: node.data.label,
                  relationships: [],
                },
              };
            }
          });
        }

        if (edges && edges.length > 0) {
          edges.forEach((edge) => {
            const { source, target, sourceHandle, targetHandle } = edge;
            const sourceNode = nodes.find((node) => node.id === source);
            const targetNode = nodes.find((node) => node.id === target);
            if (_.isEmpty(resultObj[source]?.entities?.relationships))
              resultObj[source] = {
                ...resultObj[source],
                entities: {
                  ...resultObj[source]?.entities,
                  relationships: [],
                },
              };
            let attributeSource = sourceHandle.split('-')[0];
            let attributeTarget = targetHandle.split('-')[0];
            const relationship = {
              Entities:
                sourceNode && targetNode
                  ? `${sourceNode.data.label},${targetNode.data.label}`
                  : 'N/A',
              Relationship: edge.data.startLabel + ',' + edge.data.endLabel,
              Coloumn:
                !isNaN(attributeSource) && !isNaN(attributeTarget)
                  ? `${resultObj[source].entities.attributes[attributeSource].cname},${resultObj[target].entities.attributes[attributeTarget].cname}`
                  : 'N/A',
            };

            resultObj[source].entities.relationships.push(relationship);
          });
        }

        return resultObj;
      };

      const processFlowResult = processFlow();

      return processFlowResult;
    } catch (error) {
      console.error(error);
    }
  }

  findFlowForProcessFabric(node, edges) {
    try {
      let nodes = structuredClone(node);
      let edge = structuredClone(edges);
      let adjacencyList = {};
      const updateLable = (routeArray) => {
        let childRoute = [...routeArray];
        routeArray.forEach((parent) => {
          if (parent?.source) {
            childRoute.map((child) => {
              if (parent.source == child.NodeId) {
                if (parent?.conditionResult) {
                  child.conditionResult = parent.conditionResult;
                  delete parent.conditionResult;
                }
              }
            });
          }
        });
        childRoute.forEach((e) => {
          delete e.source;
        });
        return childRoute;
      };
      function findAllRoutes(
        startNode,
        endNode,
        visited = new Set(),
        currentRoute = [],
        allRoutes = [],
      ) {
        visited.add(startNode);
        let getNode = nodes.find((node) => node.id == startNode);
        let nodeObj = {
          NodeId: startNode,
          NodeName: getNode.data.label,
          NodeType: getNode.type,
        };
        currentRoute.push(nodeObj);
        if (startNode === endNode) {
          let flowName = `flow${allRoutes.length + 1}`;
          allRoutes.push({ [flowName]: [...currentRoute] });
        } else if (adjacencyList[startNode]) {
          for (const neighbor of adjacencyList[startNode]) {
            if (!visited.has(neighbor)) {
              findAllRoutes(
                neighbor,
                endNode,
                visited,
                currentRoute,
                allRoutes,
              );
            }
          }
        }
        visited.delete(startNode);
        currentRoute.pop();
      }

      const findAllRoutesWithFormatAndDecisionResults = (nodes, edges) => {
        const graph = {};
        edges.forEach((edge) => {
          if (!graph[edge.source]) {
            graph[edge.source] = [];
          }
          graph[edge.source].push({
            target: edge.target,
            sourcenodeid: edge.source,
            label: edge.label,
          });
        });
        const allRoutes = [];
        const dfs = (node, currentRoute) => {
          const neighbors = graph[node] || [];
          neighbors.forEach((neighborInfo) => {
            const newRoute = [
              ...currentRoute,
              {
                nodeId: neighborInfo.target,
                sourcenodeid: neighborInfo.sourcenodeid,
                label: neighborInfo.label,
              },
            ];
            dfs(neighborInfo.target, newRoute);
          });
          if (neighbors.length === 0) {
            allRoutes.push(currentRoute);
          }
        };
        nodes.forEach((node) => {
          if (node.type === 'startnode') {
            const startNodeId = node.id;
            dfs(startNodeId, [{ nodeId: startNodeId, label: null }]);
          }
        });
        const formattedRoutes = allRoutes.map((route, index) => {
          let newArray = [];
          let currentConditionResult = null;
          let routeArray = route.map((routeItem) => {
            const sourceNodeId = routeItem.nodeId;
            const sourceNode = nodes.find((node) => node.id === sourceNodeId);
            if (sourceNode) {
              currentConditionResult = routeItem.label;
            }
            let routes = {
              nodeType:
                sourceNode.property.nodeType == 'defaultNode'
                  ? sourceNode.type
                  : sourceNode.property.nodeType,
              NodeId: sourceNode.id,
              Nodename: sourceNode.data.label,
              source: routeItem.sourcenodeid,
            };
            if (currentConditionResult) {
              routes['conditionResult'] = currentConditionResult;
            }
            return routes;
          });
          let routeOptionArray = updateLable(routeArray);
          let flowName = `flow${index + 1}`;
          return { [flowName]: routeOptionArray };
        });
        return formattedRoutes;
      };

      const summeryFlow = () => {
        const adjacencyList = {};
        edge.forEach((edge) => {
          if (!adjacencyList[edge.source]) {
            adjacencyList[edge.source] = [];
          }
          adjacencyList[edge.source].push(edge.target);
        });
        const routesWithFormatAndDecisionResults =
          findAllRoutesWithFormatAndDecisionResults(nodes, edge);
        return routesWithFormatAndDecisionResults;
      };
      let summeryRoutes = summeryFlow();
      return summeryRoutes;
    } catch (error) {
      console.error(error);
    }
  }
  processFabricSummary(edges, node) {
    try {
      let nodes = structuredClone(node);
      let edge = structuredClone(edges);

      const initElement = (item, element) => {
        item.role = element?.data?.role;

        item.nodeType =
          element?.property?.nodeType &&
          (element?.property?.nodeType == 'defaultNode'
            ? element?.type
            : element?.property?.nodeType);

        item.nodeId = element.id;
        if (typeof element?.T_parentId === 'object') {
          item.T_parentId = [...element?.T_parentId];
        } else {
          item.T_parentId = element?.T_parentId;
        }

        item.nodeName = element?.data?.label;

        item.nodeDesc = element?.property?.description;

        return item;
      };

      const addingElements = (item, array) => {
        if (array.filter((x) => x.id === item.id).length === 0) {
          let element = nodes.find((node) => node.id == item.source);

          array.push(initElement(item, element));
        }
      };

      const processFlow = () => {
        const resultObj = {};

        let array = [];

        let removeFields = [
          'source',

          'label',

          'sourceHandle',

          'selected',

          'targetHandle',

          'target',

          'type',

          'markerEnd',

          'id',
        ];

        edge.map((edges) => {
          addingElements(edges, array);
        });

        array.forEach((obj) => {
          let routeArray = [];

          const { source, target } = obj;

          let initRouteObj = {};

          if (!resultObj[source]) {
            resultObj[source] = obj;
          }

          if (obj.label) {
            initRouteObj['conditionResult'] = obj?.label;
          }

          initRouteObj['nodeName'] = nodes.find(
            (node) => node.id == target,
          )?.data?.label;

          initRouteObj['nodeId'] = target;

          routeArray.push(initRouteObj);

          if (resultObj[source]?.routeArray?.length > 0) {
            let check = resultObj[source].routeArray.findIndex(
              (index) => obj.nodeId == source,
            );

            if (check >= 0) {
              resultObj[source].routeArray.push(initRouteObj);
            }
          } else {
            resultObj[source].routeArray = routeArray;
          }

          Object.keys(resultObj[source]).map((key) => {
            let status = removeFields.includes(key);

            if (status) {
              delete resultObj[source][key];
            }
          });
        });

        const updatedArray = Object.values(resultObj);

        let endNodeElement = nodes.find((node) => node.type == 'endnode');

        let item = initElement({}, endNodeElement);

        updatedArray.push(item);

        return updatedArray;
      };

      let processFlowResult = processFlow();

      return processFlowResult;
    } catch (error) {
      console.error(error);
    }
  }

  sortProcessFabricSummary(processFlow) {
    try {
      if (processFlow && processFlow.length > 0) {
        let startNode = processFlow.find(
          (node) => node?.nodeType == 'startnode',
        );
        let uniId = [];
        processFlow.map((ele) => {
          if (!uniId.includes(ele.nodeId)) {
            uniId.push(ele.nodeId);
          }
        });
        let alterData = [];
        processFlow.map((ele) => {
          if (ele?.T_parentId.length == 0) {
            alterData.push(ele);
          }
          if (ele?.T_parentId.length > 0) {
            if (
              ele?.T_parentId.every((v) => {
                uniId.includes(v);
              })
            ) {
              alterData.push(ele);
            } else {
              alterData.push({
                ...ele,
                T_parentId: ele?.T_parentId.filter((v) => uniId.includes(v)),
              });
            }
          }
        });
        let proFlow = [];
        proFlow.push(startNode);

        let includedId = [startNode.nodeId];

        for (let j = 0; includedId.length + 1 != alterData.length; ) {
          if (proFlow[j]?.routeArray.length > 0) {
            let route = proFlow[j]?.routeArray;

            for (let rou of route) {
              let data = alterData.find((node) => node?.nodeId == rou?.nodeId);
              if (
                data &&
                data?.nodeType !== 'endnode' &&
                !includedId.includes(data?.nodeId) &&
                data?.T_parentId.every((v) => includedId.includes(v))
              ) {
                includedId.push(data?.nodeId);
                proFlow.push(data);
              }
            }
          }

          if (
            processFlow.length == j + 2 &&
            includedId.length + 1 !== processFlow.length
          ) {
            j = 0;
          } else {
            j = j + 1;
          }
        }

        proFlow.push(processFlow.find((node) => node.nodeType == 'endnode'));

        return proFlow;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
