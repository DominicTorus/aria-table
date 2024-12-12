import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/apiService';

const _ = require('lodash');
interface artifactInfo {
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  isLocked: boolean;
  executionMode: string;
}
interface keys16 {
  CK: string;
  FNGK: string;
  FNK: string;
  CATK: string[] | string;
  AFGK: string[] | string;
  AFK: string[] | string;
  AFVK: string[] | string;
  AFSK: string[] | string;
}

@Injectable()
export class CommonTmServices {
  constructor(private readonly apiService: ApiService) {}
  async getArtifactLockin(key: string) {
    try {
      let arrkey = key.split(':');
      let finalkey = this.convert8keysinto16keys(arrkey, true);
      let data: artifactInfo | any = await this.apiService
        .readKeys({
          ...finalkey,
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            let result;
            data.forEach((item) => {
              if (item?.key == 'AFI') {
                result = item?.value;
              }
            });
            if (result) {
              return result;
            }
            return {};
          }
          return {};
        })
        .catch((error) => {
          throw error;
        });
      if (data && data.hasOwnProperty('isLocked')) {
        return data.isLocked;
      } else {
        return 'No ArtifactInfo Found';
      }
    } catch (error) {
      throw error;
    }
  }
  async setArtifactLockin(key: string, value: boolean) {
    try {
      let arrkey = key.split(':');
      let finalkeyPost = this.convert8keysinto16keys(arrkey, false);
      let finalkey = this.convert8keysinto16keys(arrkey);

      let data = await this.apiService
        .readKeys({
          ...finalkey,
        })
        .then((data) => {
          if (data) {
            return JSON.parse(data);
          }

          return {};
        })
        .catch((error) => {
          throw error;
        });

      if (!data || Object.keys(data).length === 0) {
        return 'fail';
      }
      data = {
        ...data,
        isLocked: value,
      };
      let res;

      await this.apiService
        .writeMDK({
          SOURCE: 'redis',
          TARGET: 'redis',
          ...finalkeyPost,
          AFSK: {
            AFI: data,
          },
        })
        .then(() => {
          res = 'success';
        })
        .catch(() => {
          res = 'fail';
        });

      return res;
    } catch (error) {
      throw error;
    }
  }

  async manageArtifactInfo(client: string, type: string, redisKey: string) {
    try {
      let artifactInfo: artifactInfo;
      let arrkey = redisKey.split(':');
      let finalkeyPost = this.convert8keysinto16keys(arrkey, false);
      let finalkey = this.convert8keysinto16keys(arrkey);
      let response = null;
      if (type === 'create') {
        artifactInfo = {
          createdBy: client,
          createdOn: new Date().toJSON(),
          updatedBy: '',
          updatedOn: '',
          isLocked: true,
          executionMode: '',
        };

        response = await this.apiService.writeMDK({
          SOURCE: 'redis',
          TARGET: 'redis',
          ...finalkeyPost,
          AFSK: {
            AFI: artifactInfo,
          },
        });
      } else {
        let res: artifactInfo | any = await this.apiService
          .readKeys({
            ...finalkey,
            AFSK: 'AFI',
          })
          .then((data) => {
            if (data) {
              return JSON.parse(data);
            } else return {};
          })
          .catch((error) => {
            throw error;
          });
        if (res) {
          artifactInfo = res;
          artifactInfo = {
            executionMode: '',
            ...artifactInfo,
            updatedBy: client,
            updatedOn: new Date().toJSON(),
            isLocked: true,
          };
          response = await this.apiService.writeMDK({
            SOURCE: 'redis',
            TARGET: 'redis',
            ...finalkeyPost,
            AFSK: {
              AFI: artifactInfo,
            },
          });
        } else {
          throw 'No ArtifactInfo Found';
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
  async getIniateEventsData(redisKey, artifactName = null) {
    try {
      let arrKey = JSON.parse(redisKey);
      let key = '';
      if (arrKey.length > 0) {
        key = arrKey.join(':');
      }

      let res = {};
      let finalKey = this.convert8keysinto16keys(arrKey);
      await this.apiService
        .readKeys({ ...finalKey, AFSK: 'NDS' })
        .then((data) => {
          if (data) {
            let node = JSON.parse(data);
            if (node) {
              let navBarData = this.gettingValues(node) ?? [];
              let controlJson = this.transformNodesToProps(node) ?? {};

              res = {
                status: 200,
                data: {
                  navBarData: navBarData,
                  controlJson: controlJson,
                },
              };

              if (artifactName) {
                let logicData = this.logicCenterData(node, artifactName) ?? {};
                let SecurityData =
                  this.securityCenterData(node, artifactName) ?? {};
                res = {
                  ...res,
                  data: {
                    ...res?.['data'],
                    logic: logicData,
                    security: SecurityData,
                  },
                };
              }
            } else {
              res = {
                status: 200,
                data: {
                  navBarData: [],
                  controlJson: {},
                },
              };
            }
          }
        })
        .catch((error) => {
          throw error;
        });
      return res;
    } catch (error) {
      console.error(error);
    }
  }
  gettingValues(value) {
    try {
      let components = [];
      let controls = [];
      var result = [];

      let sample = {
        component: {
          nodeId: 'canvas',
          nodeName: 'Canvas',
          nodeType: 'group',
        },
        controls: [
          {
            nodeId: 'canvas',
            nodeName: 'Canvas',
            nodeType: 'group',
            events: [
              {
                name: 'onLoad',
                type: 'Group',
                enabled: 'true',
              },
            ],
          },
        ],
      };

      let hasID = new Set([]);
      // Separate components and controls
      value.forEach((item) => {
        if (item.type === 'group') {
          components.push(item);
        } else {
          controls.push(item);
        }
      });

      // Create response object
      components.forEach((parent) => {
        hasID.add(parent.id);
        let singleEntity = {
          component: {
            nodeId: parent.id,
            nodeName: parent.data.label || parent.type,
            nodeType: parent.type,
            Pevents: parent?.data?.nodeProperty?.elementInfo?.events ?? [
              {
                name: 'onLoad',
                type: 'Group',
                enabled: 'true',
              },
            ],
          },
          controls: [
            {
              nodeId: parent.id,
              nodeName: parent.data.label || parent.type,
              nodeType: parent.type,
              events: parent?.data?.nodeProperty?.elementInfo?.events ?? [
                {
                  name: 'onLoad',
                  type: 'Group',
                  enabled: 'true',
                },
              ],
            },
          ],
        };

        controls.forEach((child) => {
          if (child.T_parentId) {
            if (parent.id === child.T_parentId) {
              if (!hasID.has(child.id)) {
                hasID.add(child.id);
                singleEntity.controls.push({
                  nodeId: child.id,
                  nodeName: child.data.label || child.type,
                  nodeType: child.type,
                  events: child?.data?.nodeProperty?.elementInfo?.events ?? [
                    {
                      name: 'onLoad',
                      type: 'Group',
                      enabled: 'true',
                    },
                  ],
                });
              }
            }
          }
        });

        result.push(singleEntity);
      });
      controls.forEach((child) => {
        if (!hasID.has(child.id)) {
          hasID.add(child.id);
          sample.controls.push({
            nodeId: child.id,
            nodeName: child.data.label || child.type,
            nodeType: child.type,
            events: child?.data?.nodeProperty?.elementInfo?.events ?? [
              {
                name: 'onLoad',
                type: 'Group',
                enabled: 'true',
              },
            ],
          });
        }
      });

      result.push(sample);

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  transformNodesToProps(nodes, id = [], parentID = '') {
    try {
      var ids = [...id];
      function transformGroupToEvents(nodes, parentID = '') {
        const data = [];
        nodes &&
          nodes.map((node) => {
            if (!parentID && node.type === 'group' && !ids.includes(node.id)) {
              ids.push(node.id);
              data.push({
                nodeId: node.id,
                nodeName: node.data.label,
                nodeType: node.type,
                elementInfo: node?.data?.nodeProperty?.elementInfo ?? {
                  event: [
                    {
                      name: 'onLoad',
                      type: 'Group',
                      enabled: 'true',
                    },
                  ],
                },
                children: [...transformGroupToEvents(nodes, node.id)],
              });
            }
            if (
              parentID &&
              ids.length > 0 &&
              node.hasOwnProperty('T_parentId') &&
              parentID === node.T_parentId &&
              !ids.includes(node.id)
            ) {
              ids.push(node.id);
              data.push({
                nodeId: node.id,
                nodeName: node.data.label,
                nodeType: node.type,
                elementInfo: node?.data?.nodeProperty?.elementInfo ?? {
                  event: [
                    {
                      name: 'onLoad',
                      type: 'Group',
                      enabled: 'true',
                    },
                  ],
                },
              });
            }

            return node;
          });

        return data;
      }

      const data = transformGroupToEvents(nodes, parentID);

      if (ids.length < nodes.length) {
        let child = [];
        nodes &&
          nodes.forEach((node) => {
            if (!ids.includes(node.id)) {
              ids.push(node.id);
              child.push({
                nodeId: node.id,
                nodeName: node.data.label,
                nodeType: node.type,
                elementInfo: node?.data?.nodeProperty?.elementInfo ?? {
                  event: [
                    {
                      name: 'onLoad',
                      type: 'Group',
                      enabled: 'true',
                    },
                  ],
                },
              });
            }
          }),
          data.push({
            nodeId: 'canvas',
            nodeName: 'canvas',
            nodeType: 'canvas',
            elementInfo: {
              event: [
                {
                  name: 'onLoad',
                  type: 'Group',
                  enabled: 'true',
                },
              ],
            },
            children: child,
          });
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  calculateRecentlyWorkingDetails(date: string) {
    const date1 = new Date(date);
    const date2 = new Date();
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return `Just now`;
    }
  }

  logicCenterData(nodes, artifactName) {
    try {
      let controlJson = this.transformNodesToProps(nodes);
      const act = {
        lock: {
          lockMode: '',
          name: '',
          ttl: '',
        },
        stateTransition: {
          sourceQueue: '',
          sourceStatus: '',
          targetQueue: '',
          targetStatus: '',
        },
        pagination: {
          page: '',
          count: '',
        },

        events: {},
      };
      let res = {
        artifact: {
          name: artifactName,
          action: act,
          code: '',
          testCode: '',
          rule: {},
          events: {},
          mapper: [],
          node: [],
        },
      };

      const handleObjElement = (node) => {
        if (!node || node.length === 0) return [];
        return node.map((item) => {
          return {
            elementName: item.nodeName,
            elementId: item.nodeId,
            elementType: node?.nodeType,
            action: act,
            code: '',
            testCode: '',
            rule: {},
            events: {},
            mapper: [],
          };
        });
      };

      controlJson.forEach((node) => {
        res.artifact.node.push({
          nodeId: node.nodeId,
          nodeName: node.nodeName,
          nodeType: node?.nodeType,
          action: act,
          code: '',
          testCode: '',
          rule: {},
          events: {},
          mapper: [],
          objElements: handleObjElement(node.children),
        });
      });
      return res;
    } catch (error) {
      console.error(error);
    }
  }
  logicCenterDataPO(pfdsummary, artifactName, edges) {
    try {
      const act = {
        lock: {
          lockMode: '',
          name: '',
          ttl: '',
        },
        stateTransition: {
          sourceQueue: '',
          sourceStatus: '',
          targetQueue: '',
          targetStatus: '',
        },
        pagination: {
          page: '',
          count: '',
        },
      };
      let res = {
        artifact: {
          name: artifactName,
          action: act,
          rule: {},
          code: '',
          testCode: '',
          mapper: [],

          node: [],
          events: {
            sourceQueue: '',
            sourceStatus: '',
            pre: {
              success: {
                targetQueue: '',
                targetStatus: '',
              },
              failure: {
                targetQueue: '',
                targetStatus: '',
              },
              suspicious: {
                targetQueue: '',
                targetStatus: '',
              },
            },
            pro: {
              success: {
                targetQueue: '',
                targetStatus: '',
              },
              failure: {
                targetQueue: '',
                targetStatus: '',
              },
              suspicious: {
                targetQueue: '',
                targetStatus: '',
              },
            },
            pst: {
              success: {
                targetQueue: '',
                targetStatus: '',
              },
              failure: {
                targetQueue: '',
                targetStatus: '',
              },
              suspicious: {
                targetQueue: '',
                targetStatus: '',
              },
            },
          },
        },
      };

      pfdsummary.forEach((node) => {
        let data = {
          nodeId: node?.nodeId || node?.id,
          nodeName: node?.nodeName || node?.data?.label,
          nodeType: node?.nodeType || node?.data?.nodeType,
          action: act,
          rule: {},
          code: '',
          testCode: '',
          mapper: [],
          events: {
            sourceQueue: '',
            sourceStatus: '',
            pre: {
              success: {
                targetQueue: '',
                targetStatus: '',
              },
              failure: {
                targetQueue: '',
                targetStatus: '',
              },
              suspicious: {
                targetQueue: '',
                targetStatus: '',
              },
            },
            pro: {
              success: {
                targetQueue: '',
                targetStatus: '',
              },
              failure: {
                targetQueue: '',
                targetStatus: '',
              },
              suspicious: {
                targetQueue: '',
                targetStatus: '',
              },
            },
            pst: {
              success: {
                targetQueue: '',
                targetStatus: '',
              },
              failure: {
                targetQueue: '',
                targetStatus: '',
              },
              suspicious: {
                targetQueue: '',
                targetStatus: '',
              },
            },
          },
          objElements: [],
        };
        if (edges && edges.length > 0) {
          let objElement = [];
          edges.forEach((edge) => {
            const targetNodeName = edge?.targetHandle.split(':').pop();
            if (data?.nodeName === targetNodeName) {
              objElement.push({
                elementName: edge?.sourceHandle
                  .split('.')
                  .slice(1, 3)
                  .join('.'),
                elementId: edge?.sourceHandle,
                elementType: edge?.sourceHandle.split('.')?.[1],
                events: {
                  sourceQueue: '',
                  sourceStatus: '',
                  pre: {
                    success: {
                      targetQueue: '',
                      targetStatus: '',
                    },
                    failure: {
                      targetQueue: '',
                      targetStatus: '',
                    },
                    suspicious: {
                      targetQueue: '',
                      targetStatus: '',
                    },
                  },
                  pro: {
                    success: {
                      targetQueue: '',
                      targetStatus: '',
                    },
                    failure: {
                      targetQueue: '',
                      targetStatus: '',
                    },
                    suspicious: {
                      targetQueue: '',
                      targetStatus: '',
                    },
                  },
                  pst: {
                    success: {
                      targetQueue: '',
                      targetStatus: '',
                    },
                    failure: {
                      targetQueue: '',
                      targetStatus: '',
                    },
                    suspicious: {
                      targetQueue: '',
                      targetStatus: '',
                    },
                  },
                },
              });
            }
          });
          if (objElement.length > 0)
            data = {
              ...data,
              objElements: objElement,
            };
        }
        res.artifact.node.push(data);
      });

      return res;
    } catch (error) {
      console.error(error);
    }
  }
  logicCenterDataDO(nodes, artifactName, subflow = null, id) {
    try {
      const act = {
        lock: {
          lockMode: '',
          name: '',
          ttl: '',
        },
        stateTransition: {
          sourceQueue: '',
          sourceStatus: '',
          targetQueue: '',
          targetStatus: '',
        },
        pagination: {
          page: '',
          count: '',
        },
      };
      let res = {
        artifact: {
          name: artifactName,
          // action: act,
          rule: {},
          code: '',
          testCode: '',
          mapper: [],
          node: [],
        },
      };
      if (Array.isArray(nodes) && nodes.length > 0) {
        nodes.forEach((node) => {
          res.artifact.node.push({
            nodeId: node.nodeId,
            nodeName: node.nodeName,
            nodeType: node.nodeType,
            action: act,
            rule: {},
            mapper: [],
            code: '',
            testCode: '',
            events: {
              sourceQueue: '',
              sourceStatus: '',
              pre: {
                success: {
                  targetQueue: '',
                  targetStatus: '',
                },
                failure: {
                  targetQueue: '',
                  targetStatus: '',
                },
                suspicious: {
                  targetQueue: '',
                  targetStatus: '',
                },
              },
              pro: {
                success: {
                  targetQueue: '',
                  targetStatus: '',
                },
                failure: {
                  targetQueue: '',
                  targetStatus: '',
                },
                suspicious: {
                  targetQueue: '',
                  targetStatus: '',
                },
              },
              pst: {
                success: {
                  targetQueue: '',
                  targetStatus: '',
                },
                failure: {
                  targetQueue: '',
                  targetStatus: '',
                },
                suspicious: {
                  targetQueue: '',
                  targetStatus: '',
                },
              },
            },
            objElements: node.schema.map((elementName) => ({
              elementId: node.nodeId + '|' + elementName.name,
              elementName: elementName.name,

              action: act,
              events: {
                sourceQueue: '',
                sourceStatus: '',
                pre: {
                  success: {
                    targetQueue: '',
                    targetStatus: '',
                  },
                  failure: {
                    targetQueue: '',
                    targetStatus: '',
                  },
                  suspicious: {
                    targetQueue: '',
                    targetStatus: '',
                  },
                },
                pro: {
                  success: {
                    targetQueue: '',
                    targetStatus: '',
                  },
                  failure: {
                    targetQueue: '',
                    targetStatus: '',
                  },
                  suspicious: {
                    targetQueue: '',
                    targetStatus: '',
                  },
                },
                pst: {
                  success: {
                    targetQueue: '',
                    targetStatus: '',
                  },
                  failure: {
                    targetQueue: '',
                    targetStatus: '',
                  },
                  suspicious: {
                    targetQueue: '',
                    targetStatus: '',
                  },
                },
              },
              rule: {},
              code: '',
              testCode: '',
              mapper: [],
            })),
          });
        });
      }

      return res;
    } catch (error) {
      console.error(error);
    }
  }

  logicCenterDataDstDO(nodes, artifactName) {
    try {
      const act = {
        lock: {
          lockMode: '',
          name: '',
          ttl: '',
        },

        pagination: {
          page: '',
          count: '',
        },
      };
      let res = {
        artifact: {
          name: artifactName,
          action: act,
          rule: {},
          code: '',
          testCode: '',
          mapper: [],
          node: [],
        },
      };
      if (Array.isArray(nodes) && nodes.length > 0) {
        nodes.forEach((node) => {
          res.artifact.node.push({
            nodeId: node?.nodeId + '|' + node?.id,
            nodeName: node.label,
            nodeType: node.path,
            action: act,
            rule: {},
            mapper: [],
            code: '',
            testCode: '',
            events: {
              sourceQueue: '',
              sourceStatus: '',
              pre: {
                success: {
                  targetQueue: '',
                  targetStatus: '',
                },
                failure: {
                  targetQueue: '',
                  targetStatus: '',
                },
                suspicious: {
                  targetQueue: '',
                  targetStatus: '',
                },
              },
              pro: {
                success: {
                  targetQueue: '',
                  targetStatus: '',
                },
                failure: {
                  targetQueue: '',
                  targetStatus: '',
                },
                suspicious: {
                  targetQueue: '',
                  targetStatus: '',
                },
              },
              pst: {
                success: {
                  targetQueue: '',
                  targetStatus: '',
                },
                failure: {
                  targetQueue: '',
                  targetStatus: '',
                },
                suspicious: {
                  targetQueue: '',
                  targetStatus: '',
                },
              },
            },
          });
        });
      }

      return res;
    } catch (error) {
      console.error(error);
    }
  }
  securityCenterDataDstDO(nodes, artifactName) {
    try {
      let res = {
        security: {
          artifact: {
            resource: artifactName,

            SIFlag: {
              uiType: 'dropdown',
              selectedValue: '',
              selectionList: ['AA', 'BA'],
            },
            node: [],
          },
        },
      };
      if (Array.isArray(nodes) && nodes.length > 0) {
        nodes.forEach((node) => {
          res.security.artifact.node.push({
            resource: node.nodeName,
            resourceId: node?.nodeId + '|' + node?.id,
            resourceType: node.path,
            SIFlag: {
              uiType: 'dropdown',
              selectedValue: '',
              selectionList: ['AA', 'BA', 'ATO', 'BTO'],
            },
          });
        });
      }
      return res;
    } catch (error) {
      console.error(error);
    }
  }
  logicSchemaDO(nodes, artifactName, subflow = null, id) {
    try {
      let res = [];
      if (Array.isArray(nodes) && nodes.length > 0) {
        nodes.forEach((node) => {
          res.push({
            nodeId: node.nodeId,
            nodeName: node.nodeName,
            nodeType: node.nodeType,
            children: node.schema.map((nodeName) => ({
              nodeId: node.nodeId + '|' + nodeName.name,
              nodeName: nodeName.name,
              nodeType: node.nodeType,
            })),
          });
        });
        return res;
      }
    } catch (error) {
      console.error(error);
    }
  }

  securityCenterDataDO(nodes, artifactName, subflow = null, id) {
    try {
      let res = {
        security: {
          artifact: {
            resource: artifactName,
            SIFlag: {
              uiType: 'dropdown',
              selectedValue: '',
              selectionList: ['AA', 'BA'],
            },
            node: [],
          },
        },
      };
      if (Array.isArray(nodes) && nodes.length > 0) {
        nodes.forEach((node) => {
          res.security.artifact.node.push({
            resource: node.nodeName,
            resourceId: node.nodeId,
            resourceType: node.nodeType,
            SIFlag: {
              uiType: 'dropdown',
              selectedValue: '',
              selectionList: ['AA', 'BA', 'ATO', 'BTO'],
            },
            objElements: node.schema.map((elementName) => ({
              resource: elementName.name,
              resourceId: node.nodeId + '|' + elementName.name,
              resourceType: node.nodeType,
              SIFlag: {
                uiType: 'dropdown',
                selectedValue: '',
                selectionList: ['AA', 'BA', 'ATO', 'BTO'],
              },
            })),
          });
        });
      }

      return res;
    } catch (error) {
      console.error(error);
    }
  }

  securityCenterData(nodes, artifactName) {
    try {
      let res = {
        security: {
          artifact: {
            resource: artifactName,
            resourceId: artifactName,
            SIFlag: {
              uiType: 'dropdown',
              selectedValue: '',
              selectionList: ['AA', 'BA'],
            },
            node: [],
          },
        },
      };

      let controlJson = this.transformNodesToProps(nodes);
      const handleObjElement = (node) => {
        if (!node || node.length === 0) return [];
        return node.map((item) => {
          return {
            resource: item.nodeName,
            resourceId: item.nodeId,
            resourceType: item.nodeType,
            SIFlag: {
              uiType: 'dropdown',
              selectedValue: '',
              selectionList: ['AA', 'BA', 'ATO', 'BTO'],
            },
          };
        });
      };

      controlJson.forEach((node) => {
        res.security.artifact.node.push({
          resource: node.nodeName,
          resourceId: node.nodeId,
          resourceType: node.nodeType,
          SIFlag: {
            uiType: 'dropdown',
            selectedValue: '',
            selectionList: ['AA', 'BA', 'ATO', 'BTO'],
          },
          objElements: handleObjElement(node.children),
        });
      });

      return res;
    } catch (error) {
      console.error(error);
    }
  }
  securityCenterDataPO(pfdsummary, artifactName, subflow = null) {
    try {
      let res = {
        security: {
          artifact: {
            resource: artifactName,
            SIFlag: {
              uiType: 'dropdown',
              selectedValue: '',
              selectionList: ['AA', 'BA'],
            },
            node: [],
          },
        },
      };

      pfdsummary.forEach((node) => {
        res.security.artifact.node.push({
          resource: node?.nodeName || node?.data?.label,
          nodeId: node.nodeId || node?.id,
          resourceId: node?.nodeId || node?.id,
          nodeType: node?.nodeType || node?.type,
          SIFlag: {
            uiType: 'dropdown',
            selectedValue: '',
            selectionList: ['AA', 'BA', 'ATO', 'BTO'],
          },
        });
      });

      return res;
    } catch (error) {
      console.error(error);
    }
  }
  convert8keysinto16keys(arrKey: string[], isArray = true): keys16 {
    let returnKeys = isArray
      ? {
          CK: '',
          FNGK: '',
          FNK: '',
          CATK: [],
          AFGK: [],
          AFK: [],
          AFVK: [],
          AFSK: [],
        }
      : {
          CK: '',
          FNGK: '',
          FNK: '',
          CATK: '',
          AFGK: '',
          AFK: '',
          AFVK: '',
          AFSK: '',
        };
    for (let i = 0; i < arrKey.length; i++) {
      let key = Object.keys(returnKeys)[i];
      if (Array.isArray(returnKeys[key])) {
        returnKeys[key] = [arrKey[i]];
      } else {
        returnKeys[key] = arrKey[i];
      }
    }
    return returnKeys;
  }

  transformNode(flowNodes) {
    let newArr = flowNodes.map((element) => {
      return {
        id: element?.id,
        type: element?.type,
        grid: element?.grid,
        groupType: element?.groupType,
        T_parentId: element?.T_parentId,
        layoutFlag: element?.layoutFlag,
        height: element?.height,
        label: element.data.label ?? element.property.name,
        elementInfo: element.data.nodeProperty.elementInfo
          ? element.data.nodeProperty.elementInfo
          : { label: element.data.label ?? element.property.name },
      };
    });
    return newArr;
  }

  convertMappedDataEventsToEvents = (input) => {
    console.dir(input, { depth: null });
    let mappedData = structuredClone(input);
    let result = {
      name: mappedData.name,
      component: [],
    };

    let component = [];
    let node = mappedData?.node;
    if (node) {
      node.forEach((element) => {
        let newComponent = {
          component: element.nodeName,
          id: element.nodeId,
          // type: objElement.nodeType,
          control: [
            {
              name: element.nodeName,
              id: element.nodeId,
              events: element?.events,
            },
          ],
        };
        if (element?.objElements) {
          element?.objElements.forEach((objElement) => {
            newComponent.control.push({
              name: objElement.elementName,
              // type: element.type,
              id: objElement.elementId,
              events: objElement.events,
            });
          });
        }
        component.push(newComponent);
      });
    }

    result.component = component;

    return {
      artifact: mappedData.events.eventSummary,
      component: result.component,
    };
  };

  convert16keysinto8keys(inputString: any) {
    const pairs = inputString.split(':').reduce((acc, value, index) => {
      if (index % 2 === 0) acc.push([value, '']);
      else acc[acc.length - 1][1] = value;
      return acc;
    }, []);
    return Object.fromEntries(pairs);
  }

  handlNestedObj(
    operation: 'set' | 'get' | 'delete',
    editedValue: any,
    editingKey: any,
    labels: string[],
    labelsValue: string[],
    obj: any,
    replace = false,
  ) {
    try {
      let EditedValue = editedValue;
      let EditingKey = editingKey;

      let Labels = _.cloneDeep(labels);
      let LabelsValue = _.cloneDeep(labelsValue);
      let Obj = _.cloneDeep(obj);

      let path = '';
      const findObjPath = (obj, p) => {
        let Obj = _.cloneDeep(obj);

        if (Array.isArray(Obj)) {
          for (let i = 0; i < Obj.length; i++) {
            if (
              typeof Obj[i] === 'object' &&
              !Array.isArray(Obj[i]) &&
              !_.isEmpty(Obj[i])
            ) {
              let keys = Object.keys(Obj[i]);
              for (let j = 0; j < keys.length; j++) {
                if (
                  Obj[i]?.[keys[j]] &&
                  keys[j] === Labels[0] &&
                  Obj[i]?.[keys[j]] === LabelsValue[0]
                ) {
                  Labels.shift();
                  LabelsValue.shift();

                  if (!path && Labels.length == 0 && LabelsValue.length == 0) {
                    let finalPath = p.split('.');
                    finalPath.shift();
                    path = finalPath.join('.') + '.' + i;
                  }
                }
                if (
                  typeof Obj[i]?.[keys[j]] === 'object' &&
                  !_.isEmpty(Obj[i]?.[keys[j]])
                ) {
                  if (!path)
                    findObjPath(Obj[i]?.[keys[j]], p + '.' + i + '.' + keys[j]);
                }
              }
            }
          }
        }
        if (typeof Obj === 'object' && !Array.isArray(Obj) && !_.isEmpty(Obj)) {
          let keys = Object.keys(Obj);
          for (let i = 0; i < keys.length; i++) {
            if (
              Obj?.[keys[i]] &&
              keys[i] === Labels[0] &&
              Obj?.[keys[i]] === LabelsValue[0]
            ) {
              Labels.shift();
              LabelsValue.shift();
              if (!path && Labels.length == 0 && LabelsValue.length == 0) {
                let finalPath = p.split('.');
                finalPath.shift();
                path = finalPath.join('.');
              }
            }
            if (typeof Obj[keys[i]] === 'object' && !_.isEmpty(Obj[keys[i]])) {
              if (!path) findObjPath(Obj[keys[i]], p + '.' + keys[i]);
            }
          }
        }
      };
      findObjPath(Obj, '');

      if (path && operation === 'set') {
        Obj = _.update(Obj, path, (e) => {
          if (typeof e === 'object' && !Array.isArray(e) && !_.isEmpty(e)) {
            if (
              e?.[EditingKey] &&
              typeof e?.[EditingKey] === 'object' &&
              !_.isEmpty(e?.[EditingKey]) &&
              !Array.isArray(e?.[EditingKey])
            ) {
              e[EditingKey] = EditedValue;
            } else if (e?.[EditingKey] && Array.isArray(e?.[EditingKey])) {
              if (replace) {
                e[EditingKey] = EditedValue;
              } else {
                let uniqueKey = new Set(e[EditingKey]);
                uniqueKey.add(EditedValue[0]);
                e[EditingKey] = Array.from(uniqueKey);
              }
            } else e[EditingKey] = EditedValue;
          }
          if (Array.isArray(e)) {
            if (replace) {
              e = EditedValue;
            } else e.push(EditedValue);
          }
          return e;
        });
      }
      if (path && operation === 'get') {
        Obj = _.get(Obj, path + '.' + EditingKey);
      }

      if (path && operation === 'delete') {
        Obj = _.update(Obj, path, (e) => {
          if (Array.isArray(e)) {
            e.splice(EditingKey, 1);
          }
          if (typeof e === 'object' && !_.isEmpty(e)) {
            if (e.hasOwnProperty(editingKey)) delete e[EditingKey];
          }

          return e;
        });
      }
      return Obj;
    } catch (error) {
      console.error(error);
    }
  }

  findDiffAndChangeDiffInObject(
    newObject: Object,
    oldObject: Object,
    toLookupKeys: string[],
    validationKeys: Array<string | string[]>,
    replaceNewWithOld = false,
  ): Object {
    try {
      let result = _.cloneDeep(newObject);
      let newO = _.cloneDeep(newObject);
      let oldO = _.cloneDeep(oldObject);
      const finalPaths = [];
      const findBy = (
        obj: Object,
        p: string,
        whatToFind: any,
        byValue = undefined,
      ): string => {
        let path = '';
        if (!_.isEmpty(obj) && typeof obj === 'object') {
          Object.keys(obj)
            .filter((key) => !toLookupKeys.includes(key))
            .forEach((innerkey) => {
              const p1 = p !== '' ? p + '.' + innerkey : innerkey;
              if (byValue !== undefined) {
                if (innerkey === byValue)
                  if (_.isEqual(obj[innerkey], whatToFind)) {
                    path = p;
                  }
              } else if (innerkey === whatToFind) {
                const oldPath = findBy(oldO, '', obj[innerkey], innerkey);
                if (!_.isEmpty(oldPath) && typeof oldPath === 'string') {
                  if (
                    finalPaths.findIndex(
                      (f) => f.newPath === p && f.oldPath === oldPath,
                    ) === -1
                  )
                    finalPaths.push({
                      newPath: p,
                      oldPath: oldPath,
                    });
                }
              }
              if (
                typeof obj[innerkey] === 'object' &&
                !_.isEmpty(obj[innerkey])
              ) {
                const found = findBy(obj[innerkey], p1, whatToFind, byValue);
                if (!_.isEmpty(found) && typeof found === 'string')
                  path = found;
              }
            });
        }

        return path;
      };

      if (_.isEmpty(oldO)) return result;

      validationKeys.forEach((key) => {
        if (Array.isArray(key)) {
          key.forEach((k) => {
            findBy(newO, '', k);
          });
        }
        if (typeof key === 'string') {
          findBy(newO, '', key);
        }
      });

      finalPaths.forEach((path) => {
        toLookupKeys.forEach((key) => {
          const oldValue = _.get(oldO, path.oldPath + '.' + key);
          const newValue = _.get(newO, path.newPath + '.' + key);
          if (replaceNewWithOld) {
            if (!_.isEmpty(oldValue))
              _.set(result, path.newPath + '.' + key, oldValue);
          } else {
            if (!_.isEmpty(newValue)) {
              if (!_.isEqual(oldValue, newValue)) {
                _.set(result, path.newPath + '.' + key, newValue);
              }
            } else {
              _.set(result, path.newPath + '.' + key, oldValue);
            }
          }
        });
      });

      return result;
    } catch (error) {
      console.error(error);
    }
  }
  findAndExceute(
    object: Object,
    key: string,
    execute: Function,
    takeKeyValueOnly = true,
    skipableKeys: Array<string>,
  ) {
    try {
      let output = _.cloneDeep(object);
      const paths = [];
      const cycleObj = (object, path = '') => {
        if (!_.isEmpty(object) && typeof object === 'object') {
          Object.keys(object).forEach((innerkey) => {
            const p = path !== '' ? path + '.' + innerkey : innerkey;
            if (key === innerkey) {
              if (takeKeyValueOnly) paths.push(p);
              else paths.push(path);
            }

            if (
              typeof object[innerkey] === 'object' &&
              !_.isEmpty(object[innerkey]) &&
              !skipableKeys.includes(innerkey)
            )
              cycleObj(object[innerkey], p);
          });
        }
      };
      if (!_.isEmpty(object)) cycleObj(object);

      if (!_.isEmpty(paths)) {
        paths.forEach((path) => {
          output = _.update(output, path, execute);
        });
      }
      return output;
    } catch (error) {
      console.error(error);
    }
  }
  checkArrayHasEmptyElement(array) {
    if (Array.isArray(array)) {
      return array.some((element) => {
        return element === '' || element === null || element === undefined;
      });
    }
  }

  convertArrayKeysIntoString(array: Array<string>) {
    const arkey = ['CK', 'FNGK', 'FNK', 'CATK', 'AFGK', 'AFK', 'AFVK', 'AFSK'];
    const finalKey = array.map((key, index) => [arkey?.[index], key]).flat();
    return finalKey.join(':');
  }
}
