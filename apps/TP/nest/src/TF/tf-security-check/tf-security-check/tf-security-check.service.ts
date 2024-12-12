import { Injectable } from '@nestjs/common';
import { JwtServices } from 'src/jwt.services';
import { TG_CommonService } from 'src/TG/tg-common/tg-common.service';

@Injectable()
export class TfSecurityCheckService {
    constructor(
        private readonly jwtService: JwtServices,
        private readonly commonService: TG_CommonService,
    ) { }
    
    async securityCheck(ufKey: string, token: string, componentName?: string, isTable?: boolean) {
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
                    if (!componentName) {
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
                                    componentName ===
                                    templateArray[i].security.artifact.node[j].resource
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
                                                    screenName === templateArray[i].security.artifact.resource
                                                ) {
                                                    let componentNameArray: string[] = []
                                                    for (
                                                        let j = 0;
                                                        j < templateArray[i].security.artifact.node.length;
                                                        j++
                                                    ) {
                                                        if (
                                                            componentName ===
                                                            templateArray[i].security.artifact.node[j].resource
                                                        ) {
                                                            componentNameArray.push(componentName)
                                                        }
                                                    }
                                                    return componentNameArray
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
                                                    templateArray[i].security.artifact.node[j].objElements[
                                                        k
                                                    ].SIFlag.selectedValue !== 'BTO'
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
                                            for (let i = 0; i < templateArray.length; i++) {
                                                if (
                                                    screenName === templateArray[i].security.artifact.resource
                                                ) {
                                                    let componentNameArray: string[] = []
                                                    for (
                                                        let j = 0;
                                                        j < templateArray[i].security.artifact.node.length;
                                                        j++
                                                    ) {
                                                        if (
                                                            componentName ===
                                                            templateArray[i].security.artifact.node[j].resource
                                                        ) {
                                                            componentNameArray.push(componentName.toLowerCase())
                                                        }
                                                    }
                                                    return componentNameArray
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
                                                    templateArray[i].security.artifact.node[j].objElements[
                                                        k
                                                    ].SIFlag.selectedValue !== 'BTO'
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
}
