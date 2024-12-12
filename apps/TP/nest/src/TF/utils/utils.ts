import axios from "axios";
import { TfSecurityCheckService } from "../tf-security-check/tf-security-check/tf-security-check.service";
import { Injectable } from "@nestjs/common";
import { TF_CommonService } from "../tf.common.service";

@Injectable()
export class TFUtilServices {
    constructor(
        private readonly appService: TfSecurityCheckService,
        private readonly tfCommonService: TF_CommonService
    ) { }
    // SECURITY CHECK
    async checkAuthorization(nodeName: any, key: any, token: any) {
        const response = await this.appService.securityCheck(key, token, nodeName, false);
        return response;
    }

    async flattenHierarchy(data: any) {
        const result = [];

        function traverse(items: any, menuGroup: any) {
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

    // GENERATE DART CLASS NAME
    generateClassName(str: string): string {
        return str.split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }

    // GENERATE DART FILE NAME
    generateFileName(str: any) {
        return str.toLowerCase().split(' ').join('_');
    }

    // GET EVENTS
    async getEventArray(uo: any, nodeId: any, nodeParentId: any) {
        if (uo && nodeId && nodeParentId) {
            for (let e of uo) {
                if (e.nodeId === nodeParentId) {
                    for (let element of e.objElements) {
                        if (element.elementId === nodeId && element.events?.eventSummary?.children) {
                            let eventProps = this.tfCommonService.eventFunction(element.events?.eventSummary);
                            return [eventProps, e.nodeName, element.events?.eventSummary?.name, element.code];
                        } 
                        if (element.elementId === nodeId){
                            let eventProps = this.tfCommonService.eventFunction(element.events?.eventSummary);
                            return [eventProps, e.nodeName, element.events?.eventSummary?.name, element.code];
                        }
                    }
                }
            }
        }
        return [];
    }


    // GROUP WIDGETS
    groupWidgetsByParentId(screen: any) {
        const groupedWidgets: { [key: string]: { name: string; widgets: any[] } } = {};

        screen.ufs.forEach((widget: any) => {
            const groupId = widget.T_parentId;

         if (!groupedWidgets[groupId]) {
                const group = screen.ufs.find((g: any) => g.id === groupId); 
                const groupName = group ? group.label : 'Unnamed Group';

                groupedWidgets[groupId] = {
                    name: groupName,
                    widgets: []
                };
            }

            groupedWidgets[groupId].widgets.push(widget);
        });

        for (const groupId in groupedWidgets) {
            if (groupedWidgets.hasOwnProperty(groupId)) {
                groupedWidgets[groupId].widgets.sort((a: any, b: any) => {
                    const rowStartA = a.grid?.row?.start ?? 0;
                    const rowStartB = b.grid?.row?.start ?? 0;
                    return rowStartA - rowStartB;  
                });
            }
        }
        
        return groupedWidgets;
    }

}
