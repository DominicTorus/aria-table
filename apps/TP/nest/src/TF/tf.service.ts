import * as path from 'path';
import { HttpStatus, Injectable } from '@nestjs/common';
import { TF_CommonService } from './tf.common.service';
import { TfUfGluestacksService } from './tf-uf-gluestacks/tf-uf-gluestacks.service';
import { errorObj } from 'src/TG/Interfaces/errorObj.interface';
import { CommonService } from 'src/commonService';
import { TFUtilServices } from './utils/utils';
import { log } from 'console';

@Injectable()
export class TfService {
  constructor(
    private readonly tfCommonService: TF_CommonService,
    private readonly tfUfGluestacksService: TfUfGluestacksService,
    private readonly commonService: CommonService,
    private readonly utils: TFUtilServices,
  ) {}
   
  async codeGeneration(platform: string, key : string, token: any): Promise<any> {
    console.log('code generation started');
    let assemblerKey: string = key;
    let tenantName: string;
    let appGroupName: string;
    let keyParts: string[];
    let appName: string;
    let tenantPath: string = path.dirname(path.dirname(path.dirname(path.dirname(path.dirname(__dirname)))),);

    assemblerKey = key;
    keyParts = assemblerKey.split(':');
    tenantName = keyParts[7];
    appGroupName = keyParts[9];
    appName = keyParts[11];

    if (!assemblerKey || assemblerKey === '') {
      let errorObj: errorObj = {
        tname: 'TF',
        errGrp: 'Technical',
        fabric: 'AK',
        errType: 'Fatal',
        errCode: 'TF001',
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

    // GET ASSEMBLER DATA
    let assemblerData = await this.tfCommonService.readAPI(assemblerKey, 'redis', 'redis',);

    if (!assemblerData || assemblerData === '') {
      let errorObj: errorObj = {
        tname: 'TF',
        errGrp: 'Technical',
        fabric: 'AK',
        errType: 'Fatal',
        errCode: 'TF002',
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


    await this.tfUfGluestacksService.generateDepandencies(tenantPath, appName);
    await this.tfUfGluestacksService.generatePlatformFiles(tenantPath, appName);
    await this.tfUfGluestacksService.createLibraryFiles(tenantPath, appName);

    //Providers
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', 'src/TF/app_template/lib/providers', 'data_provider.ejs'), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/providers', 'provider.dart'));

    // Widgets
    // layout
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', 'src/TF/tf-widgets/dynamic/layout', 'appbar.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/widgets/layout', 'appbar.dart'));
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', 'src/TF/tf-widgets/dynamic/layout', 'hStack.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/widgets/layout', 'hStack.dart'));
    await this.tfCommonService.copyFile(null, path.join(path.dirname(__dirname), '..', 'src/TF/tf-widgets/dynamic/layout', 'vStack.ejs',), path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/widgets/layout', 'vStack.dart'));


    // const keys: string[] = [];
    const screens: any[] = [];
    let result: { [key: string]: any } = {};
    let screenData: any;
    let navbarData: any;
    let exportedScreens = [];
    let exportedWidgetsByScreen = {};
    let currentScreenUFS: any = [];
    let currentScreenUO: any = [];

    if (assemblerData.artifactList.length > 0) {
      screenData = await this.utils.flattenHierarchy(assemblerData.artifactList);
    }

    navbarData = screenData.reduce(
      (acc:any, { menuGroup, screenName, SF, UF }) => {
        const formattedScreenName: any = {
          'name': screenName,
          'key': UF,
          'ufs': '',
          'uo': ''
        };

        const menuGroupObj: any = acc.find(
          (item: any) => item.menuGroup === menuGroup,
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

    if (Array.isArray(navbarData) && navbarData.length > 0) {
      for (const e of navbarData) {
        if (e.screenDetails) {
          for (const screen of e.screenDetails) {
            //GET UFS
            const data = await this.tfCommonService.readAPI(
              `${screen.key}:UFS`,
              'redis',
              'redis',
            );

            if (data.length > 0) {
              await Promise.all(
                data.map(async (node: any) => {
                  if (node.type === 'group') {
                    const auth = await this.utils.checkAuthorization(node['label'], screen.key, token);
                    result[node.id] = {
                      id: node.id,
                      authData: auth,
                    };
                  }
                }),
              );
              // SET UFS
              data.forEach(async (node: any) => {
                if (node.type === 'group') {
                  currentScreenUFS.push(node);
                } else{
                  if (node.type != 'group') {
                    if (result[node.T_parentId]?.authData) {
                      if (result[node.T_parentId].authData.includes(node.label.toLowerCase())) {
                        currentScreenUFS.push(node);
                      }
                    }
                  }
                }
                screen.ufs = currentScreenUFS;
              });

              // GET UO
              const uo = await this.tfCommonService.readAPI(
                `${screen.key}:UO`,
                'redis',
                'redis',
              );

              // SET UO
              data.forEach(async (node: any) => {
                if (uo) {
                  const uoNodes = uo.mappedData.artifact.node;
                  uoNodes.forEach((uoNode: any) => {
                    if (uoNode['nodeId'] === node['id']) {
                      currentScreenUO.push(uoNode);
                    }
                  });
                }
                screen.uo = currentScreenUO;
              });
            }
            currentScreenUFS = [];
            currentScreenUO = [];
          }
        }
      }
    }
    

    if (screenData.length > 0) {
      if (navbarData[0].screenDetails.length > 0) {
        for (const screen of navbarData[0].screenDetails) {
          const screenName = this.utils.generateFileName(screen.name);

          if (!exportedWidgetsByScreen[screenName]) {
            exportedWidgetsByScreen[screenName] = [];
          }

          // CREATE SCREEN NAMED FOLDER
          await this.tfCommonService.createFolder(
            path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/screens', screenName)
          );

          // CREATE WIDGET FOLDER
          await this.tfCommonService.createFolder(
            path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/screens', screenName, 'widgets')
          );
          
          const groupedWidgets = this.utils.groupWidgetsByParentId(screen);
          for (const groupId in groupedWidgets) {
            const widgets = groupedWidgets[groupId].widgets;
            for (const widget of widgets) {
              let eventArray = [];
              if (widget.type === 'group' && widget.groupType === 'table') {
                let isPivotTable = false;
                let defaultColumns = [];
                widgets.map((e) => {
                  if(e.type.toLowerCase() === 'column'){
                    defaultColumns.push(e.label);
                  }
                  if (e.elementInfo.props){
                    e.elementInfo.props.forEach(prop => { 
                      let propName = prop.name;
                      let selectedValue = prop.enum.selectedValue;
                      if (selectedValue && selectedValue.length > 0) {
                        selectedValue = prop.enum.selectedValue;
                      } else {
                        selectedValue = prop.default;
                      }
                      if (propName === "isPivotTable" && selectedValue[0] === 'true') {
                        isPivotTable = true;
                      }
                    });
                  }
                });
                eventArray = await this.utils.getEventArray(screen.uo, widget.id, widget.T_parentId);
                if (isPivotTable){
                  await this.tfCommonService.CreateFileWithThreeParam(
                    null,
                    path.join(path.dirname(__dirname), '..', 'src/TF/tf-widgets/dynamic', 'customTable.ejs'),
                    widget,
                    [this.utils.generateClassName(screenName + widget.label.toString()), screen.key, defaultColumns],
                    eventArray,
                    '',
                    path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/screens', screenName, 'widgets', this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_customTable.dart')
                  );
                  exportedWidgetsByScreen[screenName].push(this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_customTable.dart');
                } else{
                  await this.tfCommonService.CreateFileWithThreeParam(
                    null,
                    path.join(path.dirname(__dirname), '..', 'src/TF/tf-widgets/dynamic', 'table.ejs'),
                    widget,
                    [this.utils.generateClassName(screenName + widget.label.toString()), screen.key, defaultColumns],
                    eventArray,
                    '',
                    path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/screens', screenName, 'widgets', this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_table.dart')
                  );
                  exportedWidgetsByScreen[screenName].push(this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_table.dart');
                }
              } else if(widget.type === 'group' && widget.groupType === 'list'){
                let defaultLabels = [];
                widgets.map((e) => {
                  if(e.type.toLowerCase() === 'card'){
                    defaultLabels.push(e.label);
                  }
                });
                eventArray = await this.utils.getEventArray(screen.uo, widget.id, widget.T_parentId);
                await this.tfCommonService.CreateFileWithThreeParam(
                  null,
                  path.join(path.dirname(__dirname), '..', 'src/TF/tf-widgets/dynamic', 'list.ejs'),
                  widget,
                  [this.utils.generateClassName(screenName + widget.label.toString()), screen.key, defaultLabels],
                  ['',widget.label],
                  '',
                  path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/screens', screenName, 'widgets', this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_list.dart')
                );
                exportedWidgetsByScreen[screenName].push(this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_list.dart');
              }  else{
                switch (widget.type.toString()) {
                  case 'button':
                    eventArray = await this.utils.getEventArray(screen.uo, widget.id, widget.T_parentId);
                    await this.tfCommonService.CreateFileWithThreeParam(
                      null,
                      path.join(path.dirname(__dirname), '..', 'src/TF/tf-widgets/dynamic', 'button.ejs'),
                      widget,
                      [this.utils.generateClassName(screenName + widget.label.toString()), screen.key],
                      eventArray,
                      '',
                      path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/screens', screenName, 'widgets', this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_button.dart')
                    );
                    exportedWidgetsByScreen[screenName].push(this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_button.dart');
                    break;
                  case 'textinput':
                    eventArray = await this.utils.getEventArray(screen.uo, widget.id, widget.T_parentId);
                    await this.tfCommonService.CreateFileWithThreeParam(
                      null,
                      path.join(path.dirname(__dirname), '..', 'src/TF/tf-widgets/dynamic', 'textinput.ejs'),
                      widget,
                      [this.utils.generateClassName(screenName + widget.label.toString()), screen.key],
                      eventArray,
                      '',
                      path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/screens', screenName, 'widgets', this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_textinput.dart')
                    );
                    exportedWidgetsByScreen[screenName].push(this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_textinput.dart');
                    break;
                  case 'datepicker':
                    eventArray = await this.utils.getEventArray(screen.uo, widget.id, widget.T_parentId);
                    await this.tfCommonService.CreateFileWithThreeParam(
                      null,
                      path.join(path.dirname(__dirname), '..', 'src/TF/tf-widgets/dynamic', 'datepicker.ejs'),
                      widget,
                      [this.utils.generateClassName(screenName + widget.label.toString()), screen.key],
                      eventArray,
                      '',
                      path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/screens', screenName, 'widgets', this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_datepicker.dart')
                    );

                    exportedWidgetsByScreen[screenName].push(this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_datepicker.dart');
                    break;
                  case 'fab':
                    eventArray = await this.utils.getEventArray(screen.uo, widget.id, widget.T_parentId);
                    await this.tfCommonService.CreateFileWithThreeParam(
                      null,
                      path.join(path.dirname(__dirname), '..', 'src/TF/tf-widgets/dynamic', 'fab.ejs'),
                      widget,
                      [this.utils.generateClassName(screenName + widget.label.toString()), screen.key],
                      eventArray,
                      '',
                      path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/screens', screenName, 'widgets', this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_fab.dart')
                    );

                    exportedWidgetsByScreen[screenName].push(this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_fab.dart');
                    break;
                  case 'dropdown':
                    await this.tfCommonService.CreateFileWithThreeParam(
                      null,
                      path.join(path.dirname(__dirname), '..', 'src/TF/tf-widgets/dynamic', 'dropdown.ejs'),
                      widget,
                      [this.utils.generateClassName(screenName + widget.label.toString()), screen.key],
                      ['', groupedWidgets[groupId].name, widget.label],
                      '',
                      path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/screens', screenName, 'widgets', this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_dropdown.dart')
                    );

                    exportedWidgetsByScreen[screenName].push(this.utils.generateFileName(widget.label.toString().toLowerCase()) + '_dropdown.dart');
                    break;
                  default:
                    break;
                }
              }
            }
          }
          
          // CREATE SCREEN FILE
          await this.tfCommonService.CreateFileWithThreeParam(
            null,
            path.join(path.dirname(__dirname), '..', 'src/TF/app_template/lib/layout', 'flutter_new_layout.ejs'),
            screen,
            '',
            '',
            '',
            path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib/screens', screenName, screenName + '.dart')
          );

          exportedScreens.push(screenName);
        }

        await this.tfCommonService.CreateFileWithThreeParam(
          null,
          path.join(path.dirname(__dirname), '..', 'src/TF/app_template/lib', 'exports.ejs'),
          exportedScreens,
          '',
          exportedWidgetsByScreen,
          '',
          path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib', 'exports.dart')
        );
      }
    }
    
    // main.dart
    await this.tfCommonService.CreateFileWithThreeParam(null, path.join(path.dirname(__dirname), '..', 'src/TF/app_template/lib', 'main.ejs',), exportedScreens, '', '', '', path.join(tenantPath, 'apps/mobile', 'generated_app', 'lib', 'main.dart'));

    console.log('code generation done');
    return { status: 201, message: 'code generated successfully'};
  }

  async getIFO(key: string, controlName : any) {
    if (key !== '') {
      let spiltedkey: any[] = key.split(':');
      let findingkey: string = spiltedkey.pop();
      let newKey = structuredClone(spiltedkey);
      const POdata = await this.tfCommonService.readAPI(
        spiltedkey.join(':') + ':PO',
        'redis',
        'redis',
      );

      if (POdata) {
        if (POdata?.mappedData?.artifact?.node?.length) {
          for (let i = 0; i < POdata.mappedData.artifact.node.length; i++) {
            if (POdata.mappedData.artifact.node[i].nodeName == findingkey) {
              if (POdata.mappedData.artifact.node[i].ifo) {
                let filterItems: any = [];
                for (
                  let j = 0;
                  j < POdata.mappedData.artifact.node[i].ifo.length;
                  j++
                ) {
                  let NodeId: any = POdata.mappedData.artifact.node[i].ifo[j].nodeId.split("/");
                  if (NodeId[1] == controlName) {
                    let nodeName: string = POdata.mappedData.artifact.node[i].ifo[j].nodeName;
                    nodeName = nodeName.toLocaleLowerCase();
                    if (nodeName != ''){
                      filterItems.push(nodeName);
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
  }
}
