import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtServices } from 'src/jwt.services';
import { RedisService } from 'src/redisService';
import { TG_CommonService } from '../tg-common/tg-common.service';
import * as v from 'valibot';
import { RuleService } from 'src/ruleService';

@Injectable()
export class TgSecurityCheckService {
  constructor(
    private readonly jwtService: JwtServices,
    private readonly redisService: RedisService,
    private readonly commonService: TG_CommonService,
  ) {}
  async commonDetails(
    key: string,
    componentName: string,
    controlName: string,
   
  ) {
    try {

      const UO: any = await this.commonService.readAPI(
        key + ':UO',
        'redis',
        'redis',
      );
      let mappedData: any = UO.mappedData.artifact.node;
      if (UO) {  
        if (key && !componentName && !controlName) {
          let object = {
            action: UO.mappedData?.action,
            code: UO.mappedData.artifact?.code,
            rule: UO.mappedData.artifact?.rule,
            events: UO.mappedData.artifact?.events,
            mapper:UO.mappedData.artifact?.mapper,
            node:UO.mappedData.artifact?.node,
          };
          return object;
        }
         else if(key && componentName && !controlName){
          for (let i = 0; i < mappedData.length; i++) {
            if (componentName === mappedData[i].nodeName) {

              let object = {
                action: mappedData[i]?.action,
                code: mappedData[i]?.code,
                rule: mappedData[i]?.rule,
                events: mappedData[i]?.events,
                mapper:mappedData[i]?.mapper,
                node:mappedData[i]?.objElements,
              };
              
              return object;
            }        
          }
         }
         else if (key && componentName && controlName) {
          for (let i = 0; i < mappedData.length; i++) {
            if (componentName === mappedData[i].nodeName) {
              for(let j=0;j<mappedData[i].objElements.length;j++){
                if(controlName===mappedData[i].objElements[j].elementName){
                  let object = {
                  action: mappedData[i].objElements[j]?.action,
                  code: mappedData[i].objElements[j]?.code,
                  rule: mappedData[i].objElements[j]?.rule,
                  events: mappedData[i].objElements[j]?.events,
                  mapper:mappedData[i].objElements[j]?.mapper,  
                };
              return object
             }
            } 
          }
         }
        }
      } else {
        throw 'UO not found';
      }
    } catch (error) {
      return {
        error: true,
        errorDetails: { message: error },
      };
    }
  }
  async elementsFilter(key: string, groupName?: any, controlName?: string) {
    try {
      let rule: string = '';
      const UO: any = await this.commonService.readAPI(
        key + ':UO',
        'redis',
        'redis',
      );
      let elements: any = {};

      let artifact: any = key.split(':')[11];
      elements = {};
      // return elements;
      let mappedData = UO.mappedData;
      if (mappedData) {
        for (let i = 0; i < mappedData.artifact.node.length; i++) {
          let group = mappedData.artifact.node[i];
          elements[group?.nodeName] = {};
          group.objElements.map((controls) => {
            if (controls?.elementName)
              elements[group?.nodeName][controls.elementName] = {};
          });
        }
      } else {
        throw 'UO not found';
      }
      return elements;
    } catch (error) {
      return {
        error: true,
        errorDetails: { message: error },
      };
    }
  }
  async getMapperDetails(
    key: string,
    componentId: string,
    controlId: string,
    category: string,
    bindtranValue?: any,
    code?: any,
  ) {
    try {
      let codName: any;
      const UO: any = await this.commonService.readAPI(
        key + ':UO',
        'redis',
        'redis',
      );
      if (UO) {
        let mappedData: any = UO.mappedData.artifact.node;
        if (mappedData) {
          if (key && !componentId && !controlId) {
            if (UO.mappedData.artifact.mapper.length == 0) return [];
            return UO.mappedData.artifact.mapper;
          } else if (key && componentId && !controlId) {
            for (let i = 0; i < mappedData.length; i++) {
              if (componentId === mappedData[i].nodeId) {
                if (mappedData[i].mapper.length == 0) return [];
                return mappedData[i].mapper;
              }
            }
          } else if (key && componentId && controlId) {
            for (let i = 0; i < mappedData.length; i++) {
              if (componentId === mappedData[i].nodeId) {
                for (let j = 0; j < mappedData[i].objElements.length; j++) {
                  if (
                    controlId === mappedData[i].objElements[j].elementId
                  ) {
                    if (mappedData[i].objElements[j].mapper.length == 0)
                      return [];
                    let dfdKey: string =
                      mappedData[i].objElements[j].mapper[0].sourceKey[0].split(
                        '.',
                      )[0];
                    let mapperColumn: string =
                      mappedData[i].objElements[j].mapper[0].sourceKey[0].split(
                        '.',
                      )[2];
                    let dstKey: string = dfdKey
                      .replace(':AFC:', ':AFCP:')
                      .replace(':DF-DFD:', ':DF-DST:');
                    console.log(dstKey, 'dstKey');
                    let dfData: any = await this.commonService.readAPI(
                      dstKey + ':DS_Object',
                      'redis',
                      'redis',
                    );
                    if (category && !bindtranValue && !code) {
                      let categoryData: any[] = [];
                      let dropdownData: string[] = [];
                      for (let i = 0; i < dfData.data.length; i++) {
                        Object.keys(dfData.data[i]).map((keyName) => {
                          if (category === dfData.data[i][keyName]) {
                            categoryData.push(dfData.data[i]);
                          }
                        });
                      }
                      for (let i = 0; i < categoryData.length; i++) {
                        Object.keys(categoryData[i]).map((keyName) => {
                          if (mapperColumn === keyName) {
                            dropdownData.push(categoryData[i][keyName]);
                          }
                        });
                      }
                      return dropdownData;
                    } else if(code && bindtranValue){
                      for (let i = 0; i < dfData.data.length; i++) {
                        Object.keys(dfData.data[i]).map((keyName) => {
                          if (bindtranValue === dfData.data[i][keyName]) {
                            codName = dfData.data[i].code;
                          }
                        });
                      }
                      return codName;
                    }else if (code) {
                      let categoryData: any[] = [];
                      let dropdownData: string[] = [];
                      for (let i = 0; i < dfData.data.length; i++) {
                        Object.keys(dfData.data[i]).map((keyName) => {
                          if (category === dfData.data[i][keyName]) {
                            categoryData.push(dfData.data[i]);
                          }
                        });
                      }
                      for (let j = 0; j < categoryData.length; j++) {
                        Object.keys(categoryData[j]).map((keyName) => {
                          if (
                            categoryData[j].parentCode === code &&
                            mapperColumn === keyName
                          ) {
                            dropdownData.push(categoryData[j][keyName]);
                          }
                        });
                      }
                      return dropdownData;
                    } else if (bindtranValue) {
                      for (let i = 0; i < dfData.data.length; i++) {
                        Object.keys(dfData.data[i]).map((keyName) => {
                          if (bindtranValue === dfData.data[i][keyName]) {
                            codName = dfData.data[i].code;
                          }
                        });
                      }
                      return codName;
                    } else {
                      let dropdownData: string[] = [];
                      for (let i = 0; i < dfData.data.length; i++) {
                        Object.keys(dfData.data[i]).map((keyName) => {
                          if (mapperColumn === keyName) {
                            dropdownData.push(dfData.data[i][keyName]);
                          }
                        });
                      }
                      return dropdownData;
                    }
                  }
                }
              }
            }
          }
        } else {
          throw 'mapper data not found';
        }
      } else {
        throw 'UO not found';
      }
    } catch (error) {
      return {
        error: true,
        errorDetails: { message: error },
      };
    }
  }

  async codeExecution(stringCode: string, params: any) {
    function runCodeWithObjectParams(codeString, paramsObject) {
      // Create a function with destructured parameters from the object
      const keys = Object.keys(paramsObject);
      const values = Object.values(paramsObject);

      const runCode = new Function(...keys, `${codeString};`);

      // Call the function with the values from the object
      return runCode(...values);
    }
    return runCodeWithObjectParams(stringCode, params);
  }
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
            code: item.code,
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
  async codefilter(
    key: string,
    groupId?: any,
    controlId?: string,
    event?: any,
  ) {
    try {
      let rule: string = '';
      const UO: any = await this.commonService.readAPI(
        key + ':UO',
        'redis',
        'redis',
      );
 
      let mappedData = UO.mappedData;  
      if (mappedData) {
        
        if (groupId) {
          if(event){
            let eventProperty: any;
            for(let i=0;i<mappedData.artifact.node.length;i++){
              let group = mappedData.artifact.node[i];
              if(group.nodeId == groupId){
                eventProperty = group.events.eventSummary;
              }
            }
            let eventDetails: any = await this.eventFunction(eventProperty);
              let eventDetailsArray = eventDetails[0];
              for (let i = 0; i < eventDetailsArray.length; i++) {            
                if (
                  eventDetailsArray[i].name === event
                ) {
                  console.log(eventDetailsArray[i].code);
                  
                  return eventDetailsArray[i].code
                }
              }
          }
          if (controlId) {
            if (event) {
              let eventProperty: any;
              for (let i = 0; i < mappedData.artifact.node.length; i++) {
                let group = mappedData.artifact.node[i];
                if (group.nodeId == groupId) {
                  for (let j = 0; j < group.objElements.length; j++) {
                    let control = group.objElements[j];
                    if (control.elementId == controlId) {
                      eventProperty = control.events.eventSummary;
                    }
                  }
                }
              }              
              let eventDetails: any = await this.eventFunction(eventProperty);
              let eventDetailsArray = eventDetails[0];
              for (let i = 0; i < eventDetailsArray.length; i++) {            
                if (
                  eventDetailsArray[i].name === event
                ) {
                  console.log(eventDetailsArray[i].code,"++++");
                  
                  return eventDetailsArray[i].code
                }
              }
            } else {
              for (let i = 0; i < mappedData.artifact.node.length; i++) {
                let group = mappedData.artifact.node[i];
                if (group.node == groupId) {
                  for (let j = 0; j < group.objElements.length; j++) {
                    let control = group.objElements[j];
                      if (control.code != '') return control.code;
                      else throw 'there is no rule in this level';
                  }
                }
              }
            }
          } else {
            for (let i = 0; i < mappedData.artifact.node.length; i++) {
              let group = mappedData.artifact.node[i];
              if (group.nodeId == groupId) {
                if (group.code != '') return group.code;
                else throw 'there is no rule in this level';
              }
            }
          }
        } else {
          if (mappedData.artifact.code != '') return mappedData.artifact.code;
          else throw 'there is no rule in this level';
        }
      }
    } catch (error) {
      return {
        error: true,
        errorDetails: { message: error },
      };
    }
  }


  async ifo(
    formData: any,
    key: string,
    controlId: string,
    isTable?: Boolean,
  ) {
    if (isTable == true) {
      try {
        if (formData == undefined || Object.keys(formData).length === 0)
          throw 'post data is not a valid data';
        if (key !== '') {
          let spiltedkey: any[] = key.split(':');
          let findingkey: string = spiltedkey.pop();
          let newKey = structuredClone(spiltedkey);
          const POdata = await this.commonService.readAPI(
            spiltedkey.join(':') + ':PO',
            'redis',
            'redis',
          );

          if (POdata) {
            if (POdata?.mappedData?.artifact?.node?.length) {
              for (let i = 0; i < POdata.mappedData.artifact.node.length; i++) {
                if (POdata.mappedData.artifact.node[i].nodeName == findingkey) {
                  if (POdata.mappedData.artifact.node[i].ifo) {
                    let filterItems: any = {};
                    for (
                      let j = 0;
                      j < POdata.mappedData.artifact.node[i].ifo.length;
                      j++
                    ) {
                      let NodeId: any =
                        POdata.mappedData.artifact.node[i].ifo[j].nodeId.split(
                          '.', 
                        );
                      console.log(j, '=', NodeId, 'NodeId');
                      let groupName: string = NodeId[1].split('/')[0];

                      
                      if (NodeId == controlId) {
                        let nodeName: string =
                          POdata.mappedData.artifact.node[i].ifo[j].nodeName;
                        nodeName = nodeName.toLocaleLowerCase();
                        if (nodeName in formData) {
                          filterItems[nodeName] = formData[nodeName];
                        }
                      }
                    }
                    return filterItems;
                  }
                }
              }
              throw 'ifo not found';
            }
          } else {
            throw 'key is not a valid key';
          }
        } else {
          throw 'key is not a valid key';
        }
      } catch (error) {
        return {
          error: true,
          errorDetails: { message: error },
        };
      }
    } else {
      try {
        if (formData == undefined || Object.keys(formData).length === 0)
          throw 'post data is not a valid data';
        if (key !== '') {
          let spiltedkey: any[] = key.split(':');
          let findingkey: string = spiltedkey.pop();
          let newKey = structuredClone(spiltedkey);
          const POdata = await this.commonService.readAPI(
            spiltedkey.join(':') + ':PO',
            'redis',
            'redis',
          );

          if (POdata) {
            if (POdata?.mappedData?.artifact?.node?.length) {
              for (let i = 0; i < POdata.mappedData.artifact.node.length; i++) {
                if (POdata.mappedData.artifact.node[i].nodeName == findingkey) {
                  if (POdata.mappedData.artifact.node[i].ifo) {
                    let filterItems: any = {};
                    for (
                      let j = 0;
                      j < POdata.mappedData.artifact.node[i].ifo.length;
                      j++
                    ) {
                      let NodeId: any =
                        POdata.mappedData.artifact.node[i].ifo[j].nodeId.split(
                          '/',
                        );

                      if (NodeId[1] == controlId) {
                        let nodeName: string =
                          POdata.mappedData.artifact.node[i].ifo[j].nodeName;
                        nodeName = nodeName.toLocaleLowerCase();
                        if (formData[nodeName] != undefined) {
                          filterItems[nodeName] = formData[nodeName];
                        }else{
                          filterItems[nodeName] = "";
                        }
                      }
                    }
                    return filterItems;
                  }
                }
              }
              throw 'ifo not found';
            }
          } else {
            throw 'key is not a valid key';
          }
        } else {
          throw 'key is not a valid key';
        }
      } catch (error) {
        return {
          error: true,
          errorDetails: { message: error },
        };
      }
    }
  }

  async fetchActionDetails(
    key: string,
    groupId: string,
    controlName: string,
  ) {
    try {
      const UO: any = await this.commonService.readAPI(
        key + ':UO',
        'redis',
        'redis',
      );

      // return UO;
      if (UO) {
        let mappedData: any = UO.mappedData.artifact.node;
        if (mappedData) {
          for (let i = 0; i < mappedData.length; i++) {
            if (groupId === mappedData[i].nodeId) {
              let lockMode = mappedData[i].action.lock;
              let paginationMode = mappedData[i].action.pagination;
              return {
                lockDetails: lockMode,
                paginationDetails: paginationMode,
              };
            }
          }
        } else {
          throw 'The process flow is not connected to the screen';
        }
      } else {
        throw 'The process flow is not connected to the screen';
      }
    } catch (error) {
      return {
        error: true,
        errorDetails: { message: error },
      };
    }
  }

  async fetchRuleDetails(key: string, groupId: string, controlId: string) {
    try {
      const UO: any = await this.commonService.readAPI(
        key + ':UO',
        'redis',
        'redis',
      );

      // return UO;
      if (UO) {
        let mappedData: any = UO.mappedData.artifact.node;
        if (mappedData) {
          for (let i = 0; i < mappedData.length; i++) {
            if (groupId === mappedData[i].nodeId) {
              let rule = Object.keys(mappedData[i].rule);
              if (rule.length > 0) {
                return mappedData[i].rule;
              } else {
                return 'Rule is empty';
              }
            }
          }
        } else {
          throw 'The process flow is not connected to the screen';
        }
      } else {
        throw 'The process flow is not connected to the screen';
      }
    } catch (error) {
      return {
        error: true,
        errorDetails: { message: error },
      };
    }
  }

  async InitiatePF(key: string) {
    try {
      if (key !== '') {
        let spiltedkey: any[] = key.split(':');
        let findingkey: string = spiltedkey.pop();
console.log(findingkey,"FK");

        let newKey = structuredClone(spiltedkey);

        const NDSdata = await this.commonService.readAPI(
          spiltedkey.join(':') + ':NDS',
          'redis',
          'redis',
        );
        const POdata = await this.commonService.readAPI(
          spiltedkey.join(':') + ':PO',
          'redis',
          'redis',
        );

        let nodeProperty: any = {
          key: newKey.join(':'),
        };
        if (NDSdata && NDSdata.length) {
          NDSdata.map((nodes) => {
            if (nodes.data.label === findingkey) {
              nodeProperty = { ...nodeProperty, ...nodes.data.nodeProperty };
            }
          });
          if (Object.keys(nodeProperty).length === 0) {
            throw 'node property not found';
          } else {
            delete nodeProperty.data;
            nodeProperty.key = nodeProperty.key + ':';
          }
        } else {
          throw 'node property not found';
        }
        let eventProperty: any = {};
        if (POdata) {
          if (POdata?.mappedData?.artifact?.node.length) {
            POdata?.mappedData?.artifact?.node.map((nodes) => {
              if (nodes.nodeName === findingkey) {
                if (nodes.events) {
                  eventProperty = nodes.events;
                }
              }
            });
            if (Object.keys(eventProperty).length === 0) {
              throw 'event not found';
            }
          } else {
            throw 'event not found';
          }
        } else {
          throw 'event not found';
        }

        return { nodeProperty, eventProperty };
      } else {
        throw 'key not found';
      }
    } catch (error) {
      return {
        error: true,
        errorDetails: { message: error },
      };
    }
  }

  async getPFDetails(
    isTable: Boolean,
    key: string,
    groupId: string,
    controlId: string,
  ) {
    if (isTable) {
      try {
        // throw new BadRequestException(
        //   'The process flow is not connected to the screen',
        // );
        const UO: any = await this.commonService.readAPI(
          key + ':UO',
          'redis',
          'redis',
        );

        // return UO;
        if (UO) {
          let mappedData: any = UO.mappedData.artifact.node;
          if (mappedData) {
            for (let i = 0; i < mappedData.length; i++) {
              if (groupId === mappedData[i].nodeId) {
                let eventProperty = mappedData[i].events.eventSummary;

                let eventDetails: any =
                  await this.commonService.eventFunction(eventProperty);
                let eventDetailsArray = eventDetails[0];

                for (let k = 0; k < eventDetailsArray.length; k++) {
                  if (
                    eventDetailsArray[k].type === 'handlerNode' &&
                    eventDetailsArray[k].name === 'saveHandler'
                  ) {
                    if (
                      eventDetailsArray[k].targetKey &&
                      eventDetailsArray[k].targetKey.length > 0 &&
                      eventDetailsArray[k].url
                    ) {
                      return {
                        key: eventDetailsArray[k].targetKey[0],
                        url: eventDetailsArray[k].url,
                        primaryKey: eventDetailsArray[k].primaryKey,
                      };
                    } else if (!eventDetailsArray[k].targetKey) {
                      return {
                        url: eventDetailsArray[k].url,
                        primaryKey: eventDetailsArray[k].primaryKey,
                      };
                    }
                  } else if (
                    eventDetailsArray[k].type === 'handlerNode' &&
                    eventDetailsArray[k].name === 'updateHandler'
                  ) {
                    if (
                      eventDetailsArray[k].targetKey &&
                      eventDetailsArray[k].targetKey.length > 0
                    ) {
                      return {
                        key: eventDetailsArray[k].targetKey[0],
                        primaryKey: eventDetailsArray[k].primaryKey,
                        tableName: eventDetailsArray[k]?.tableName,
                        status: eventDetailsArray[k]?.status,
                      };
                    } else if (!eventDetailsArray[k].targetKey) {
                      throw 'The process flow is not connected to the screen';
                    }
                  }
                }
              }
            }
          } else {
            throw 'mapperData not found';
          }
        } else {
          throw 'Uo not found';
        }
      } catch (error) {
        return {
          error: true,
          errorDetails: { message: error },
        };
      }
    } else {
      try {
        // throw new BadRequestException(
        //   'The process flow is not connected to the screen',
        // );
        const UO: any = await this.commonService.readAPI(
          key + ':UO',
          'redis',
          'redis',
        );

        // return UO;
        if (UO) {
          let mappedData: any = UO.mappedData.artifact.node;
          if (mappedData) {
            for (let i = 0; i < mappedData.length; i++) {
              if (groupId === mappedData[i].nodeId) {
                for (let j = 0; j < mappedData[i].objElements.length; j++) {
                  if (
                    controlId === mappedData[i].objElements[j].elementId
                  ) {
                    let eventProperty =
                      mappedData[i].objElements[j].events.eventSummary;

                    let eventDetails: any =
                      await this.commonService.eventFunction(eventProperty);
                    let eventDetailsArray = eventDetails[0];

                    for (let k = 0; k < eventDetailsArray.length; k++) {
                      if (
                        eventDetailsArray[k].type === 'handlerNode' &&
                        eventDetailsArray[k].name === 'saveHandler'
                      ) {
                        if (
                          eventDetailsArray[k].targetKey &&
                          eventDetailsArray[k].targetKey.length > 0 &&
                          eventDetailsArray[k].url
                        ) {
                          return {
                            key: eventDetailsArray[k].targetKey[0],
                            url: eventDetailsArray[k].url,
                            primaryKey: eventDetailsArray[k].primaryKey,
                          };
                        } else if (!eventDetailsArray[k].targetKey) {
                          return {
                            url: eventDetailsArray[k].url,
                            primaryKey: eventDetailsArray[k].primaryKey,
                          };
                        }
                      } else if (
                        eventDetailsArray[k].type === 'handlerNode' &&
                        eventDetailsArray[k].name !== 'saveHandler'
                      ) {
                        if (
                          eventDetailsArray[k].targetKey &&
                          eventDetailsArray[k].targetKey.length > 0
                        ) {
                          return {
                            key: eventDetailsArray[k].targetKey[0],
                            primaryKey: eventDetailsArray[k].primaryKey,
                            tableName: eventDetailsArray[k]?.tableName,
                            status: eventDetailsArray[k]?.status,
                          };
                        } else if (!eventDetailsArray[k].targetKey) {
                          throw 'The process flow is not connected to the screen';
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            throw 'The process flow is not connected to the screen';
          }
        } else {
          throw 'The process flow is not connected to the screen';
        }
      } catch (error) {
        return {
          error: true,
          errorDetails: { message: error },
        };
      }
    }
  }

  async getDfkey(ufKey: any, groupid?: string) {
    try {
      let sourceData: any[];
      const source: string = 'redis';
      const target: string = 'redis';
      let DFkeys: string[] = [];

      const mapperProperties: any = await this.commonService.readAPI(
        ufKey + ':UO',
        source,
        target,
      );
      // console.log(mapperProperties,"mapperProperties");
      if (mapperProperties) {
        if (groupid) {
          sourceData = mapperProperties.mappedData.artifact.node;
          if (sourceData) {
            for (let i = 0; i < sourceData.length; i++) {
              if (groupid === sourceData[i].nodeId) {
                  let dfKey: string 
                  for (let node = 0; node < sourceData[i].objElements.length; node++) {
                   if (sourceData[i].objElements[node].mapper.length > 0) {
                    dfKey =sourceData[i].objElements[node].mapper[0].sourceKey[0].split(
                      '.',
                    )[0];
                    dfKey = dfKey + ':';
                    return dfKey;
                   }                    
                  }
                
              }
            }
          } else {
            throw 'sourceData not found';
          }
        } else {
          sourceData = mapperProperties.source;
          if (sourceData) {
            for (let i = 0; i < sourceData.length; i++) {
              let dfKey: string = sourceData[i].dfdKey;

              dfKey = dfKey + ':';
              DFkeys.push(dfKey);
            }
            return DFkeys;
          } else {
            throw 'sourceData not found';
          }
        }
      } else {
        throw 'mapperProperties not found';
      }
    } catch (error: any) {
      // console.log(error,"ERROR+++++");

      return {
        error: true,
        errorDetails: { message: error },
      };
    }
  }

  async zenrule(rule: any, data: any) {
    try {
      var goruleEngine: RuleService = new RuleService();
      let goruleres = await goruleEngine.goRule(data, rule);
      return goruleres;
    } catch (error) {
      // console.error('Error in zenrule:', error);
      // throw error;
      return {
        error: 'cant make rule',
      };
    }
  }

  async paginationDataFilter(ufKey: any, data: any) {
    try {
      const source: string = 'redis';
      const target: string = 'redis';
      const mapperProperties: any = await this.commonService.readAPI(
        ufKey + ':UO',
        source,
        target,
      );
      if (mapperProperties) {
        if (data == undefined || data.length == 0)
          throw 'pagination data not found';
        if (mapperProperties.mappedData) {
          let mapperSourceData: any = {};
          let mapperData: any = [];
          let objectfn: any = [];
          let rule: any = [];

          let mapperSourceDataKeys: any = [];
          mapperSourceDataKeys.push(...Object.keys(mapperSourceData));

          mapperData = [...mapperProperties.mappedData.artifact.mapper];
          if (mapperProperties.mappedData.artifact.code != '')
            objectfn = [
              ...objectfn,
              {
                name: mapperProperties.mappedData.artifact.name.toLowerCase(),
                code: mapperProperties.mappedData.artifact.code,
              },
            ];
          if (
            Object.keys(mapperProperties.mappedData.artifact.rule).length > 0
          ) {
            rule.push(mapperProperties.mappedData.artifact.rule);
          }

          mapperProperties.mappedData.artifact.node.forEach((element: any) => {
            // if (element.nodeName === groupName) {
            mapperData = [...mapperData, ...element.mapper];
            if (element.code != '')
              objectfn = [
                ...objectfn,
                { name: element.nodeName.toLowerCase(), code: element.code },
              ];
            if (Object.keys(element.rule).length > 0) {
              rule.push(element.rule);
            }

            element.objElements.forEach((element: any) => {
              mapperData = [...mapperData, ...element.mapper];
              if (element.code != '')
                objectfn = [
                  ...objectfn,
                  {
                    name: element.elementName.toLowerCase(),
                    code: element.code,
                  },
                ];
              if (Object.keys(element.rule).length > 0) {
                rule.push(element.rule);
              }
            });
            // }
          });
          // return rule;
          // return mapperData;
          //----------------------------mapper Start-------------------------
          let targetKeys: any = [];
          let redisKey: any;
          let nodeName: any;
          let value: any;
          for (let i = 0; i < mapperData.length; i++) {
            targetKeys.push({
              targetKey:
                mapperData[i].targetKey.split(':')[
                  mapperData[i].targetKey.split(':').length - 1
                ],
              columnKey: mapperData[i].sourceKey[0].split('.')[2],
            });
            nodeName = mapperData[i].sourceKey[0].split('.')[1];
          }

          targetKeys.push({
            targetKey: 'next_status',
            columnKey: 'next_status',
          });
          targetKeys.push({ targetKey: 'status', columnKey: 'status' });
          targetKeys.push({ targetKey: 'process_id', columnKey: 'process_id' });
          value = await this.commonService.readAPI(
            redisKey + ':DS_Object',
            source,
            target,
          );
          let temp = {};
          // return data;
          var newData: any = [];
          if (data) {
            data.map((ele) => {
              Object.keys(ele).map((key) => {
                const keyName = key;
                for (let i = 0; i < targetKeys.length; i++) {
                  if (targetKeys[i].targetKey.toLowerCase() === keyName) {
                    temp = {
                      ...temp,
                      [targetKeys[i].targetKey.toLowerCase()]:
                        ele[targetKeys[i].columnKey],
                    };
                  }
                }
              });
              newData.push(temp);
            });
          }
          return newData;
          // return objectfn;
          //----------------------------mapper End-------------------------
          //------------------------------function start--------------------------------------------
          if (objectfn.length > 0) {
            for (let l = 0; l < objectfn.length; l++) {
              if (objectfn[l].name != '' && objectfn[l].code != '') {
                for (let i = 0; i < newData.length; i++) {
                  const transformFunction = new Function(
                    'v',
                    `return ${objectfn[l].code};`,
                  )(v);

                  let result = v.safeParse(
                    transformFunction,
                    newData[i][objectfn[l].name],
                  );
                  if (result.success) {
                    newData[i] = {
                      ...newData[i],
                      [objectfn[l].name]: result.output,
                    };
                  }
                }
              }
            }
          }

          //------------------------------function end--------------------------------------------
          // console.log(rule, "rule");
          return newData;
          //------------------------------------go-rule start------------------------------------

          if (rule.length > 0) {
            let finalData = [];
            for (let i = 0; i < rule.length; i++) {
              if (rule[i]?.nodes.length && rule[i]?.edges.length) {
                if (i == 0) {
                  for (let j = 0; j < newData.length; j++) {
                    let result: any = await this.zenrule(newData[j], rule[i]);
                    if (result?.error) {
                      break;
                    } else if (result?.result?.output === true) {
                      finalData.push(newData[j]);
                    }
                  }
                } else {
                  let temp = finalData;
                  finalData = [];
                  for (let j = 0; j < temp.length; j++) {
                    let result: any = await this.zenrule(temp[j], rule[i]);
                    if (result?.error) {
                      break;
                    } else if (result.result.output === true) {
                      finalData.push(temp[j]);
                    }
                  }
                }
              }
            }
            return finalData;
          } else return newData;

          //---------------------------------------go-rule end------------------------------------
        }
      } else {
        throw 'mapper data not found';
      }
    } catch (error) {
      return {
        error: true,
        errorDetails: { message: error },
      };
    }
  }

  async dataOrchestrator(sessionInfo: any, ufKey: any, groupName: any) {
    const source: string = 'redis';
    const target: string = 'redis';
    const mapperProperties: any = await this.commonService.readAPI(
      ufKey + ':UO',
      source,
      target,
    );
    if (mapperProperties.mappedData) {
      let mapperSourceData: any = {};

      let mapperData: any = [];
      let data: any = [];
      let filterData: any;
      let objectfn: any = [];
      let rule: any = [];

      let mapperSourceDataKeys: any = [];
      mapperSourceDataKeys.push(...Object.keys(mapperSourceData));

      mapperData = [...mapperProperties.mappedData.artifact.mapper];
      if (mapperProperties.mappedData.artifact.code != '')
        objectfn = [
          ...objectfn,
          {
            name: mapperProperties.mappedData.artifact.name.toLowerCase(),
            code: mapperProperties.mappedData.artifact.code,
          },
        ];
      if (Object.keys(mapperProperties.mappedData.artifact.rule).length > 0) {
        rule.push(mapperProperties.mappedData.artifact.rule);
      }

      mapperProperties.mappedData.artifact.node.forEach((element: any) => {
        // if (element.nodeName === groupName) {
        mapperData = [...mapperData, ...element.mapper];
        if (element.code != '')
          objectfn = [
            ...objectfn,
            { name: element.nodeName.toLowerCase(), code: element.code },
          ];
        if (Object.keys(element.rule).length > 0) {
          rule.push(element.rule);
        }

        element.objElements.forEach((element: any) => {
          mapperData = [...mapperData, ...element.mapper];
          if (element.code != '')
            objectfn = [
              ...objectfn,
              { name: element.elementName.toLowerCase(), code: element.code },
            ];
          if (Object.keys(element.rule).length > 0) {
            rule.push(element.rule);
          }
        });
        // }
      });
      // return rule;
      // return mapperData;
      //----------------------------mapper Start-------------------------
      let targetKeys: any = [];
      let redisKey: any;
      let nodeName: any;
      let value: any;
      for (let i = 0; i < mapperData.length; i++) {
        targetKeys.push({
          targetKey:
            mapperData[i].targetKey.split(':')[
              mapperData[i].targetKey.split(':').length - 1
            ],
          columnKey: mapperData[i].sourceKey[0].split('.')[2],
        });

        redisKey = mapperData[i].sourceKey[0].split('.')[0];
        nodeName = mapperData[i].sourceKey[0].split('.')[1];
      }

      targetKeys.push({
        targetKey: 'next_status',
        columnKey: 'next_status',
      });
      targetKeys.push({ targetKey: 'status', columnKey: 'status' });
      value = await this.commonService.readAPI(
        redisKey + ':DS_Object',
        source,
        target,
      );
      let temp = {};
      if (value) {
        value.map((DS_Object) => {
          if (DS_Object.nodeName == nodeName) {
            DS_Object.data.map((ele) => {
              Object.keys(ele).map((key) => {
                const keyName = key;
                for (let i = 0; i < targetKeys.length; i++) {
                  if (targetKeys[i].targetKey.toLowerCase() === keyName) {
                    temp = {
                      ...temp,
                      [targetKeys[i].targetKey.toLowerCase()]:
                        ele[targetKeys[i].columnKey],
                    };
                  }
                }
              });
              data.push(temp);
            });
          }
        });
      }
      // return data;
      // return objectfn;
      //----------------------------mapper End-------------------------
      //------------------------------function start--------------------------------------------
      if (objectfn.length > 0) {
        for (let l = 0; l < objectfn.length; l++) {
          if (objectfn[l].name != '' && objectfn[l].code != '') {
            for (let i = 0; i < data.length; i++) {
              const transformFunction = new Function(
                'v',
                `return ${objectfn[l].code};`,
              )(v);

              let result = v.safeParse(
                transformFunction,
                data[i][objectfn[l].name],
              );
              if (result.success) {
                data[i] = { ...data[i], [objectfn[l].name]: result.output };
              }
            }
          }
        }
      }

      //------------------------------function end--------------------------------------------
      // console.log(rule, "rule");
      // return data
      //------------------------------------go-rule start------------------------------------

      if (rule.length > 0) {
        let finalData = [];
        for (let i = 0; i < rule.length; i++) {
          if (rule[i]?.nodes.length && rule[i]?.edges.length) {
            if (i == 0) {
              for (let j = 0; j < data.length; j++) {
                let result: any = await this.zenrule(data[j], rule[i]);
                if (result?.error) {
                  break;
                } else if (result?.result?.output === true) {
                  finalData.push(data[j]);
                }
              }
            } else {
              let temp = finalData;
              finalData = [];
              for (let j = 0; j < temp.length; j++) {
                let result: any = await this.zenrule(temp[j], rule[i]);
                if (result?.error) {
                  break;
                } else if (result.result.output === true) {
                  finalData.push(temp[j]);
                }
              }
            }
          }
        }
        return finalData;
      } else return data;

      //---------------------------------------go-rule end------------------------------------
    }
  }

  async setSaveHandlerData(key, value, path) {
    let temp = structuredClone(value);
    let obj = {};
    if (Array.isArray(temp) || typeof temp === 'string') {
      obj = value;
    } else {
      Object.keys(temp).forEach((item) => {
        if (
          temp[item] !== '' &&
          temp[item] !== undefined &&
          temp[item] !== null
        ) {
          obj[item] = temp[item];
        }
      });
    }
    value = JSON.stringify(obj);
    await this.redisService.setJsonData(key, value, path);
  }

  async uploadHandlerData(key) {
    const flag: any = await this.redisService.getJsonData(key); //await this.commonService.readAPI(key, 'source', 'target');
    let value: any = {
      params: {
        request: {},
        response: {},
        exception: {},
        urls: {
          apiUrl: 'http://192.168.2.94:3010/expensedetails',
        },
        filters: [{}],
        filterConditions: [{}],
        defaults: {
          created_date: '2024-05-23T12:30:00Z',
          created_by: 'Maker',
          modified_date: '2024-05-23T12:30:00Z',
          modified_by: 'Maker',
        },
      },
      stt: {
        eligibleStatus: 'formValidated',
        eligibleProcessStatus: 'verified',
        finalStatus: 'Created',
        finalProcessStatus: 'TransactionInitiated',
      },
    };
    if (!flag) {
      value = JSON.stringify(value);
      await this.redisService.setJsonData(key, value);
    }
  }

  async SFCheckScreen(
    ufKey: string,
    token: string,
    nodeId?: string,
    isTable?: boolean,
  ) {
    try {
      const screenName: string = ufKey.split(':')[11];
      const source: string = 'redis';
      const target: string = 'redis';
      const decodedToken: any = await this.jwtService.decodeToken(token);
      const DO: any = await this.commonService.readAPI(
        ufKey + ':UO',
        source,
        target,
      );

      if (DO) {
        const securityData: any = DO.securityData;
        const templateArray: any[] = securityData.accessProfile;
        // decodedToken.template = 'T1';

        // const ufKeyArray = ufKey.split(':');
        // ufKeyArray[3] = ufKeyArray[3].replace('AFC', 'AF');
        // ufKey = ufKeyArray.join(':');

        if (ufKey === securityData.afk) {
          if (!nodeId) {
            for (let i = 0; i < templateArray.length; i++) {
              if (
                decodedToken.accessProfile.includes(
                  templateArray[i].accessProfile,
                ) &&
                screenName === templateArray[i].security.artifact.resource
              ) {
                return {
                  result:
                    templateArray[i].security.artifact.SIFlag.selectedValue,
                };
              }
            }
          } else {
            for (let i = 0; i < templateArray.length; i++) {
              for (
                let j = 0;
                j < templateArray[i].security.artifact.node.length;
                j++
              ) {
                if (
                  nodeId ===
                  templateArray[i].security.artifact.node[j].resourceId
                ) {
                  let selectedValues: any = [];
                  let controlNames: any = [];
                  for (
                    let l = 0;
                    l < templateArray[i].security.artifact.node.length;
                    l++
                  ) {
                    selectedValues.push(
                      templateArray[i].security.artifact.node[l].SIFlag
                        .selectedValue,
                    );
                  }
                  if (
                    selectedValues.includes('ATO') &&
                    templateArray[i].security.artifact.node[j].SIFlag
                      .selectedValue === 'ATO'
                  ) {
                    if (isTable === true) {
                      for (let i = 0; i < templateArray.length; i++) {
                        if (
                          screenName ===
                          templateArray[i].security.artifact.resource
                        ) {
                          let componentNameArray: string[] = [];
                          for (
                            let j = 0;
                            j < templateArray[i].security.artifact.node.length;
                            j++
                          ) {
                            if (
                              nodeId ===
                              templateArray[i].security.artifact.node[j]
                                .resourceId
                            ) {
                              componentNameArray.push( templateArray[i].security.artifact.node[j]
                                .resource);
                            }
                          }
                          return componentNameArray;
                        }
                      }
                    } else {
                      for (
                        let k = 0;
                        k <
                        templateArray[i].security.artifact.node[j].objElements
                          .length;
                        k++
                      ) {
                        if (
                          templateArray[i].security.artifact.node[j]
                            .objElements[k].SIFlag.selectedValue !== 'BTO'
                        ) {
                          controlNames.push(
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].resource,
                          );
                        }
                      }
                      controlNames = controlNames.map((item) =>
                        item.toLowerCase(),
                      );
                      return controlNames;
                    }
                  }
                  if (selectedValues.includes('ATO')) {
                    break;
                  }
                  if (
                    templateArray[i].security.artifact.node[j].SIFlag
                      .selectedValue === 'AA'
                  ) {
                    if (isTable === true) {
                      let componentNameArray: string[] = [];
                      for (let i = 0; i < templateArray.length; i++) {
                        if (
                          screenName ===
                          templateArray[i].security.artifact.resource
                        ) {
                          let componentNameArray: string[] = [];
                          for (
                            let j = 0;
                            j < templateArray[i].security.artifact.node.length;
                            j++
                          ) {
                            if (
                              nodeId ===
                              templateArray[i].security.artifact.node[j].resourceId
                            ) {
                              componentNameArray.push(
                                templateArray[i].security.artifact.node[j].resource
                              );
                            }
                          }
                          for (
                            let k = 0;
                            k <
                            templateArray[i].security.artifact.node[j]
                              .objElements.length;
                            k++
                          ) {
                            if (
                              templateArray[i].security.artifact.node[j]
                                .objElements[k].SIFlag.selectedValue !== 'BTO'
                            ) {
                              controlNames.push(
                                templateArray[i].security.artifact.node[j]
                                  .objElements[k].resource,
                              );
                            }
                          }
                          controlNames = controlNames.map((item) =>
                            item.toLowerCase(),
                          );
                          componentNameArray =
                            componentNameArray.concat(controlNames);
                          return componentNameArray;
                        }
                      }
                      for (
                        let k = 0;
                        k <
                        templateArray[i].security.artifact.node[j].objElements
                          .length;
                        k++
                      ) {
                        if (
                          templateArray[i].security.artifact.node[j]
                            .objElements[k].SIFlag.selectedValue !== 'BTO'
                        ) {
                          controlNames.push(
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].resource,
                          );
                        }
                      }
                      controlNames = controlNames.map((item) =>
                        item.toLowerCase(),
                      );
                      componentNameArray =
                        componentNameArray.concat(controlNames);
                      return componentNameArray;
                    } else {
                      for (
                        let k = 0;
                        k <
                        templateArray[i].security.artifact.node[j].objElements
                          .length;
                        k++
                      ) {
                        if (
                          templateArray[i].security.artifact.node[j]
                            .objElements[k].SIFlag.selectedValue !== 'BTO'
                        ) {
                          controlNames.push(
                            templateArray[i].security.artifact.node[j]
                              .objElements[k].resource,
                          );
                        }
                      }
                      controlNames = controlNames.map((item) =>
                        item.toLowerCase(),
                      );
                      return controlNames;
                    }
                  } else if (
                    templateArray[i].security.artifact.node[j].SIFlag
                      .selectedValue === 'BTO'
                  ) {
                    controlNames = controlNames.map((item) =>
                      item.toLowerCase(),
                    );
                    return controlNames;
                  }
                }
              }
            }
          }
        } else {
          throw 'UO data not found';
        }
      } else {
        throw 'UO data not found';
      }
    } catch (error) {
      return {
        error: true,
        errorDetails: { message: error },
      };
    }
  }

  // async InitiatePF(key: string, event: string, upId: string) {
  //   if (key !== '') {
  //     console.log('called');
  //     let spiltedkey: any[] = key.split(':');

  //     let findingkey: string = spiltedkey.pop();
  //     spiltedkey.push('NDS');
  //     const res = await this.commonService.readAPI(
  //       spiltedkey.join(':'),
  //       'redis',
  //       'redis',
  //     );
  //     let nodeProperty: any = {};
  //     if (res && res.length) {
  //       res.map((nodes) => {
  //         if (nodes.data.label === findingkey) {
  //           nodeProperty = nodes.data.nodeProperty;
  //         }
  //       });
  //       if (Object.keys(nodeProperty).length === 0) {
  //         return { msg: 'key not found' };
  //       }
  //       return nodeProperty;
  //     } else {
  //       return { msg: 'key not found' };
  //     }

  //     return res;
  //   } else {
  //     return { msg: 'key not found' };
  //   }
  // }
}
