import { BadGatewayException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from 'src/redisService';
import {
  BadRequestException,
  ConflictException,
  CustomException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  NotAcceptableException,
} from './customException';
import { JwtService } from '@nestjs/jwt';
import {
  artifactType,
  auth_secret,
  fabric,
  group,
  sortOrderOfArtifacts,
  tenantProfileTemplate,
} from './constants';
import {
  comparePasswords,
  getRecentKeyStructure,
  hashPassword,
} from './auth/hashing.utility';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  auth: {
    user: 'support@torus.tech',
    pass: 'Welcome@100',
  },
});

@Injectable()
export class TpService {
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async throwCustomException(error: any) {
    console.log(error);

    if (error instanceof CustomException) {
      throw error; // Re-throw the specific custom exception
    }
    throw new CustomException(
      'An unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async getAllClientTenantList(type?: string) {
    try {
      switch (type) {
        case 'c':
          const keysOfClient = await this.redisService.getKeys(
            'T:C:PROFILE:setup:NA',
          );
          //C for fetching clients
          if (Array.isArray(keysOfClient) && keysOfClient.length) {
            let clients = new Set([]);
            for (let i = 0; i < keysOfClient.length; i++) {
              const client = keysOfClient[i].split(':');
              clients.add(client[5]);
            }
            return Array.from(clients);
          } else {
            throw new NotFoundException('No clients exists');
          }
        default:
          const keysOfTenant = await this.redisService.getKeys(
            'TGA:T:PROFILE:setup:NA',
          );
          //T for fetching tenants
          if (Array.isArray(keysOfTenant) && keysOfTenant.length) {
            let tenants = new Set([]);
            for (let i = 0; i < keysOfTenant.length; i++) {
              const tenant = keysOfTenant[i].split(':');
              tenants.add(tenant[5]);
            }
            return Array.from(tenants);
          } else {
            throw new NotFoundException('No tenant exists');
          }
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async signIntoTorus(
    client: string,
    role: string,
    username: string,
    password: string,
    type: 't' | 'c' = 't',
  ) {
    try {
      if (!client || !username || !password) {
        throw new BadRequestException('Check all credentials given correctly');
      }

      const userCachekey =
        type == 't'
          ? `TGA:T:PROFILE:setup:NA:${client}:v1:users`
          : `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${client}:AFK:PROFILE:AFVK:v1:users`;

      const userResponse = await this.redisService.getJsonData(userCachekey);
      const orpsResponse = await this.redisService.getJsonData(
        `T:C:PROFILE:setup:NA:${client}:v1:authorization`,
      );

      const users = JSON.parse(userResponse);
      const loggedInUser = users.find(
        (user: any) =>
          (user.loginId === username || user.email === username) &&
          comparePasswords(password, user.password),
      );

      if (!loggedInUser) {
        throw new NotFoundException('User not found');
      }

      if (type === 'c' && orpsResponse) {
        const orps = JSON.parse(orpsResponse);
        let orpsdata: any[] = [];
        let orgGrpCodeArr: any[] = [];
        let orgCodeArr: any[] = [];
        let roleGrpCodeArr: any[] = [];
        let roleCodeArr: any[] = [];
        let psGrpCodeArr: any[] = [];
        let psArr: any[] = [];
        let orgsicodeArr: any[] = [];
        let rolesiCodeArr: any[] = [];
        let pssicodearr: any[] = [];

        for (let i = 0; i < orps.orgGrp.length; i++) {
          const org = orps.orgGrp[i].org;
          if (orps.orgGrp[i].SIFlag.selectedValue == 'A') {
            var actionallowed = orps.orgGrp[i].actionAllowed.selectedValue;
          }

          for (let a = 0; a < org.length; a++) {
            orgsicodeArr.push(org[a].orgCode);
            [...new Set(orgsicodeArr)];

            const rolegrp = org[a].roleGrp;

            for (let b = 0; b < rolegrp.length; b++) {
              if (rolegrp[b].SIFlag.selectedValue == 'A') {
                var roleaction = rolegrp[b].actionAllowed.selectedValue;
              }

              const roles = rolegrp[b].roles;

              for (let c = 0; c < roles.length; c++) {
                rolesiCodeArr.push(roles[c].roleCode);
                [...new Set(rolesiCodeArr)];
                const users = roles[c]?.users;

                if (users && users.includes(username)) {
                  const orgGrpCode = orps.orgGrp[i].orgGrpCode;
                  orgGrpCodeArr.push(orgGrpCode);
                  [...new Set(orgGrpCodeArr)];

                  const orgCode = org[a].orgCode;
                  orgCodeArr.push(orgCode);

                  const roleGrpCode = rolegrp[b].roleGrpCode;
                  roleGrpCodeArr.push(roleGrpCode);
                  const roleCode = roles[c].roleCode;
                  roleCodeArr.push(roleCode);

                  let group = orpsdata.find(
                    (item) => item.orGrpCode === orgGrpCode,
                  );
                  if (!group) {
                    group = {
                      orGrpCode: orgGrpCode,
                      orgCode: [],
                      roleGroups: [],
                    };
                    orpsdata.push(group);
                  }

                  if (!group.orgCode.includes(orgCode)) {
                    group.orgCode.push(orgCode);
                  }

                  let roleGroup = group.roleGroups.find(
                    (rg) => rg.roleGrpCode === roleGrpCode,
                  );
                  if (!roleGroup) {
                    roleGroup = {
                      roleGrpCode: roleGrpCode,
                      roleCode: [],
                      psGroups: [],
                    };
                    group.roleGroups.push(roleGroup);
                  }

                  if (!roleGroup.roleCode.includes(roleCode)) {
                    roleGroup.roleCode.push(roleCode);
                  }

                  for (let k = 0; k < roles[c].psGrp.length; k++) {
                    const psGroup = roles[c].psGrp[k];
                    for (let j = 0; j < psGroup.ps.length; j++) {
                      const psCode = psGroup.ps[j].psCode;
                      // psArr.push(psCode);
                      var tenant = psGroup.ps[j].tenants;
                      psArr.push(tenant);
                    }
                    if (psGroup.SIFlag.selectedValue == 'A') {
                      var psaction = psGroup.actionAllowed.selectedValue;
                    }
                    const psGrpCode = psGroup.psGrpCode;

                    psGrpCodeArr.push(psGrpCode);

                    let psGroupItem = roleGroup.psGroups.find(
                      (pg) => pg.psGrpCode === psGrpCode,
                    );
                    if (!psGroupItem) {
                      psGroupItem = {
                        psGrpCode: psGrpCode,
                        psCode: [],
                      };
                      roleGroup.psGroups.push(psGroupItem);
                    }

                    for (let l = 0; l < psGroup.ps.length; l++) {
                      const psCode = psGroup.ps[l].psCode;
                      // pssicodearr.push(psCode);

                      if (!psGroupItem.psCode.includes(psCode)) {
                        psGroupItem.psCode.push(psCode);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        var auth = {
          orgGrp: [...new Set(orgGrpCodeArr)],
          orgs: [...new Set(orgCodeArr)],
          roleGrp: [...new Set(roleGrpCodeArr)],
          roles: [...new Set(roleCodeArr)],
          psGrp: [...new Set(psGrpCodeArr)],
          ps: [...new Set(psArr)],
        };
        delete loggedInUser.password;

        const token = await this.jwtService.signAsync(
          { ...loggedInUser, client, auth },
          {
            secret: auth_secret,
            expiresIn: '1h',
          },
        );

        return {
          token,
          authorized: true,
          tenantdata: psArr,
          email: loggedInUser.email,
        };
      } else {
        delete loggedInUser.password;

        const token = await this.jwtService.signAsync(
          { ...loggedInUser, client },
          {
            secret: auth_secret,
            expiresIn: '1h',
          },
        );

        return { token, authorized: true };
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async registerToTorus(
    client: string,
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    mobile: string,
    password: string,
    type: string = 't',
  ) {
    try {
      if (client && username && firstname && lastname && email && password) {
        const userCachekey =
          type == 't'
            ? `TGA:T:PROFILE:setup:NA:${client}:v1:users`
            : `T:C:PROFILE:setup:NA:${client}:v1:users`;

        const responseFromRedis =
          await this.redisService.getJsonData(userCachekey);
        if (responseFromRedis) {
          const userList = JSON.parse(responseFromRedis);
          //  check username or email exist already in the userList and if is
          // user name exist throw new Exception and if not register user
          for (let i = 0; i < userList.length; i++) {
            if (userList[i].loginId == username) {
              throw new ForbiddenException('please provide unique username');
            } else if (userList[i].email == email) {
              throw new ForbiddenException(
                'Email is already registered , provide another email or login with your account',
              );
            }
          }
          const newUser = {
            loginId: username,
            firstName: firstname,
            lastName: lastname,
            email,
            mobile,
            password: hashPassword(password),
            '2FAFlag': 'N',
          };
          userList.push(newUser);
          const res = await this.redisService.setJsonData(
            userCachekey,
            JSON.stringify(userList),
          );
          if (res) return 'User Registered Successfully';
        } else {
          const newUser = {
            loginId: username,
            firstName: firstname,
            lastName: lastname,
            email,
            mobile,
            password: hashPassword(password),
            '2FAFlag': 'N',
          };
          const res = await this.redisService.setJsonData(
            userCachekey,
            JSON.stringify([newUser]),
          );
          if (res) return 'User Registered Successfully';
        }
      } else {
        throw new BadRequestException(
          'Please provide all necessary credentials',
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getUserDetails(token) {
    try {
      if (token) {
        return await this.jwtService.decode(token);
      } else {
        throw new UnauthorizedException('token not provided');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getTenantProfile(tenant: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
        // `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
      );
      const envTemplate = tenantProfileTemplate.ENV;
      const updatedTemplate = { ...tenantProfileTemplate, ENV: envTemplate };
      if (responseFromRedis) {
        //send stored Tenant profile data from redis without AppGroups data
        const tenantProfileInfo = JSON.parse(responseFromRedis);
        const { ENV } = tenantProfileInfo;
        delete ENV.APPS;
        return { ...tenantProfileInfo, ENV: ENV };
      } else {
        return { ...updatedTemplate, Code: tenant };
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async postTenantProfile(tenant: string, tenantProfileInfo: any) {
    try {
      const UpdatedEnv = tenantProfileInfo.ENV;
      const responseFromRedis = await this.redisService.getJsonData(
        `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
      );
      if (responseFromRedis) {
        const existingTenantProfile = JSON.parse(responseFromRedis);
        const { ENV } = existingTenantProfile;
        UpdatedEnv.APPS = ENV.APPS;
        return await this.redisService.setJsonData(
          `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
          JSON.stringify({
            ...tenantProfileInfo,
            ENV: UpdatedEnv,
          }),
        );
      } else {
        return await this.redisService.setJsonData(
          `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
          JSON.stringify(tenantProfileInfo),
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async postTenantResource(
    tenant: string,
    resourceArray: any[],
    resourceType: 'app' | 'org' | 'role' | 'ps' | 'env',
  ) {
    try {
      if (tenant && resourceArray && resourceType) {
        const responseFromRedis = await this.redisService.getJsonData(
          `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
        );
        switch (resourceType) {
          case 'app':
            const UpdatedAg = resourceArray;
            if (responseFromRedis) {
              const existingTenantProfile = JSON.parse(responseFromRedis);
              return await this.redisService.setJsonData(
                `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
                JSON.stringify({
                  ...existingTenantProfile,
                  AG: UpdatedAg,
                }),
              );
            } else {
              return await this.redisService.setJsonData(
                `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
                JSON.stringify({ AG: resourceArray }),
              );
            }
          case 'org':
            const UpdatedOrg = resourceArray;
            if (responseFromRedis) {
              const existingTenantProfile = JSON.parse(responseFromRedis);
              return await this.redisService.setJsonData(
                `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
                JSON.stringify({
                  ...existingTenantProfile,
                  orgGrp: UpdatedOrg,
                }),
              );
            } else {
              return await this.redisService.setJsonData(
                `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
                JSON.stringify({ orgGrp: resourceArray }),
              );
            }
          case 'role':
            const UpdatedRole = resourceArray;
            if (responseFromRedis) {
              const existingTenantProfile = JSON.parse(responseFromRedis);
              return await this.redisService.setJsonData(
                `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
                JSON.stringify({
                  ...existingTenantProfile,
                  roleGrp: UpdatedRole,
                }),
              );
            } else {
              return await this.redisService.setJsonData(
                `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
                JSON.stringify({ roleGrp: resourceArray }),
              );
            }
          case 'ps':
            const UpdatedPS = resourceArray;
            if (responseFromRedis) {
              const existingTenantProfile = JSON.parse(responseFromRedis);
              return await this.redisService.setJsonData(
                `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
                JSON.stringify({
                  ...existingTenantProfile,
                  psGrp: UpdatedPS,
                }),
              );
            } else {
              return await this.redisService.setJsonData(
                `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
                JSON.stringify({ psGrp: resourceArray }),
              );
            }
        }
      } else {
        throw new BadRequestException(
          'Please provide all necessary credentials',
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAppGroupList(tenant: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
      );
      if (responseFromRedis) {
        const tenantProfileInfo = JSON.parse(responseFromRedis);
        const AppGroupList = tenantProfileInfo.AG.map((ele) => ele.code);
        return AppGroupList;
      } else {
        throw new Error('Tenant Details not available or tenant not exist');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAppList(tenant: string, appGroup: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        // `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
      );
      if (responseFromRedis && tenant && appGroup) {
        const tenantProfileInfo = JSON.parse(responseFromRedis);
        const existingAgIndex = tenantProfileInfo.AG.findIndex(
          (ele) => ele.code == appGroup,
        );
        if (existingAgIndex != -1) {
          const AppList = tenantProfileInfo['AG'][existingAgIndex]['APPS'].map(
            (ele) => ele.code,
          );
          return AppList;
        } else {
          throw new Error(
            'AppGroup not available in the tenant, please check AppGroup and App details',
          );
        }
      } else {
        throw new Error('Tenant Details not available or tenant not exist');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async deleteAppGroup(appGroup: string, tenant: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
      );
      if (responseFromRedis) {
        const tenantProfileInfo = JSON.parse(responseFromRedis);
        const existingAppGroupIndex = tenantProfileInfo.AG.findIndex(
          (ele) => ele.code == appGroup,
        );
        if (existingAppGroupIndex != -1) {
          tenantProfileInfo['AG'].splice(existingAppGroupIndex, 1);
          return await this.redisService.setJsonData(
            `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
            JSON.stringify(tenantProfileInfo),
          );
        } else {
          throw new Error('Given AppGroup not exist in tenant profile');
        }
      } else {
        throw new Error('There is not enough details to delete AppGroup');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAppEnvironment(tenantAndEnv: string, app: string) {
    try {
      const envObjTemplate = {
        code: app,
        version: '',
        status: '',
        appPath: '',
        generatedUrl: '',
        accessUrl: '',
      };
      const responseFromRedis = await this.redisService.getJsonData(
        `TGA:T:PROFILE:setup:NA:${tenantAndEnv}:v1`,
      );
      if (responseFromRedis) {
        var tenantProfileInfo = JSON.parse(responseFromRedis);
        const { ENV } = tenantProfileInfo;
        if (ENV.APPS) {
          const index = ENV.APPS.findIndex((item) => item.code == app);
          if (index != -1) {
            const AlterData = ENV.APPS[index];
            return AlterData;
          } else {
            return envObjTemplate;
          }
        } else {
          return envObjTemplate;
        }
      } else {
        throw new Error('There is not enough details to get App Environment');
      }
    } catch (error) {
      // Catch any other errors and throw a custom exception
      await this.throwCustomException(error);
    }
  }

  async postAppEnvironment(tenant: string, envAppObj: any) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
      );
      if (responseFromRedis) {
        var tenantProfileInfo = JSON.parse(responseFromRedis);
        const { ENV } = tenantProfileInfo;
        if (ENV.APPS) {
          const existingAppIndex = ENV.APPS.findIndex(
            (item) => item.code == envAppObj.code,
          );
          if (existingAppIndex != -1) {
            ENV.APPS.splice(existingAppIndex, 1, envAppObj);
          } else {
            ENV.APPS.push(envAppObj);
          }
        } else {
          ENV.APPS = [{ ...envAppObj }];
        }
        return await this.redisService.setJsonData(
          `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
          JSON.stringify({ ...tenantProfileInfo, ENV: ENV }),
        );
      } else {
        throw new Error('There is not enough details to post App Environment');
      }
    } catch (error) {
      // Catch any other errors and throw a custom exception
      await this.throwCustomException(error);
    }
  }

  async postAppRequirement(
    tenant: string,
    appGroup: string,
    app: string,
    reqObj: any,
    date?: any,
  ): Promise<any> {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `${tenant}:${appGroup}:${app}:requirements`,
      );

      if (responseFromRedis) {
        const requirementJson = JSON.parse(responseFromRedis);
        if (date !== undefined) {
          const index = requirementJson.findIndex(
            (item) => item.createddateTime == date,
          );

          return await this.redisService.setJsonData(
            `${tenant}:${appGroup}:${app}:requirements`,
            JSON.stringify(reqObj),
            `[${index}]`,
          );
        } else {
          requirementJson.push(reqObj);
          return await this.redisService.setJsonData(
            `${tenant}:${appGroup}:${app}:requirements`,
            JSON.stringify(requirementJson),
          );
        }
      } else {
        return await this.redisService.setJsonData(
          `${tenant}:${appGroup}:${app}:requirements`,
          JSON.stringify([{ ...reqObj }]),
        );
      }
    } catch (error) {
      // Catch any other errors and throw a custom exception
      await this.throwCustomException(error);
    }
  }

  async getAppRequirement(tenant: string, appGroup: string, app: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `${tenant}:${appGroup}:${app}:requirements`,
      );
      const appReqTemplate = [];

      if (responseFromRedis) {
        const requirementJson: any[] = JSON.parse(responseFromRedis);
        const res = requirementJson.filter((item) => item.recordType !== 'D');
        return res;
      } else {
        return appReqTemplate;
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAssemblerVersion(key: string) {
    try {
      if (key) {
        const allkeys = await this.redisService.getKeys(key);
        if (Array.isArray(allkeys) && allkeys.length) {
          const data: string[] = allkeys
            .map((item: string) => {
              return item.split(key)[1].split(':')[2];
            })
            .sort(
              (a: any, b: any) =>
                parseInt(b.replace('v', '')) - parseInt(a.replace('v', '')),
            );

          return [...new Set(data)];
        } else {
          return allkeys;
        }
      } else {
        throw new Error('Please provide valid key to fetch version');
      }
    } catch (error) {
      console.log('error', error);

      throw new CustomException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // async getAssemblerVersion(key: string) {
  //   try {
  //     if (key) {
  //       const allkeys = await this.redisService.getKeys(key);
  //       if (Array.isArray(allkeys) && allkeys.length) {
  //         const data: string[] = allkeys.map((item: string) => {
  //           return item.split(key)[1].split(':')[1];
  //         });
  //         return [...new Set(data)];
  //       } else {
  //         return allkeys;
  //       }
  //     } else {
  //       throw new Error('Please provide valid key to fetch version');
  //     }
  //   } catch (error) {
  //     await this.throwCustomException(error);
  //   }
  // }

  async getAssemblerData(key: string) {
    try {
      if (key) {
        const data = await this.redisService.getJsonData(key);
        if (data) {
          return JSON.parse(data);
        } else {
          throw new Error('There is no data available for the given key');
        }
      } else {
        throw new Error('Please provide valid key to fetch data');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async saveAssemblerData(key: string, data: any) {
    try {
      if (key && data) {
        const versions = await this.getAssemblerVersion(key);
        if (Array.isArray(versions) && versions.length) {
          //get versions array and check which version is maximum version and add one with that
          const newVersion =
            Math.max(...versions.map((item) => parseInt(item.slice(1)))) + 1;
          return await this.redisService.setJsonData(
            `${key}:v${newVersion}`,
            JSON.stringify(data),
          );
        } else {
          return await this.redisService.setJsonData(
            `${key}:v1`,
            JSON.stringify(data),
          );
        }
      } else {
        throw new Error('Either key or data not provided');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async updateAssemblerData(key: string, data: any) {
    try {
      if (key && data) {
        return await this.redisService.setJsonData(key, JSON.stringify(data));
      } else {
        throw new Error('Either key or data not provided correctly');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getORPGroupData(tenant: string, group: group) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
      );
      if (responseFromRedis) {
        const tenantProfileInfo = JSON.parse(responseFromRedis);

        switch (group) {
          case 'role':
            return tenantProfileInfo.roleGrp;
          case 'org':
            return tenantProfileInfo.orgGrp;
          case 'ps':
            return tenantProfileInfo.psGrp;
          case 'all':
            return {
              roleGrp: tenantProfileInfo.roleGrp,
              orgGrp: tenantProfileInfo.orgGrp,
              psGrp: tenantProfileInfo.psGrp,
            };
          default:
            throw new Error(
              'Provided group detail is unrecognised , please check correct group detail ',
            );
        }
      } else {
        throw new Error(
          'No Details available for the tenant please setup Tenant group data',
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async updateTokenWithORP(token: string, ORPData: any) {
    try {
      const payload = await this.jwtService.decode(token, { json: true });
      const updatedPayload = { ...payload, ...ORPData };
      return this.jwtService.signAsync(updatedPayload, {
        secret: 'cnkdnkddkdmkd',
      });
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async checkUser(token: string) {
    try {
      const payload = await this.jwtService.decode(token, { json: true });
      if (payload) {
        return payload.realm_access.roles.includes('portal-admin')
          ? true
          : false;
      } else {
        throw new Error('Token not valid');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getorggrp(tenant: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
      );
      if (responseFromRedis) {
        const sf = JSON.parse(responseFromRedis);
        return sf.orgGrp.map((ele) => ({
          grpName: ele.orgGrpName,
          grpCode: ele.orgGrpCode,
        }));
      } else {
        throw new Error('Data not found');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }
  async getorgFromTSF(tenant: string, code: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
      );
      if (responseFromRedis && code) {
        const tsf = JSON.parse(responseFromRedis);
        if (tsf.orgGrp && Array.isArray(tsf.orgGrp)) {
          const requiredOrgGrp = tsf.orgGrp.find(
            (ele: any) => ele.orgGrpCode == code,
          );
          if (requiredOrgGrp) {
            return requiredOrgGrp.org.map((ele: any) => ({
              code: ele.orgCode,
              name: ele.orgName,
            }));
          } else {
            throw new Error(
              'There is no OrgGroup available in the provided OrgGrp code',
            );
          }
        } else {
          throw new Error('Data not available');
        }
      } else {
        throw new Error('Check the payload containing OrgGrpcode');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getRGFromTSF(tenant: string, orgGrpcode: string, orgCode: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
      );
      if (responseFromRedis) {
        const tsf = JSON.parse(responseFromRedis);
        const requiredOrgGrp = tsf.orgGrp.find(
          (ele) => ele.orgGrpCode == orgGrpcode,
        );
        const requiredOrg = requiredOrgGrp.org.find(
          (ele) => ele.orgCode == orgCode,
        );
        return requiredOrg.roleGrp.map((ele) => ({
          grpName: ele.roleGrpName,
          grpCode: ele.roleGrpCode,
        }));
      } else {
        throw new Error('Data not found');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getRoleFromTSF(
    tenant: string,
    orgGrpcode: string,
    orgCode: string,
    roleGrpCode: string,
  ) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
      );
      if (responseFromRedis) {
        const tsf = JSON.parse(responseFromRedis);
        const requiredOrgGrp = tsf.orgGrp.find(
          (ele) => ele.orgGrpCode == orgGrpcode,
        );
        const requiredOrg = requiredOrgGrp.org.find(
          (ele) => ele.orgCode == orgCode,
        );
        const requiredRG = requiredOrg.roleGrp.find(
          (ele) => ele.roleGrpCode == roleGrpCode,
        );
        return requiredRG.roles.map((ele) => ({
          code: ele.roleCode,
          name: ele.roleName,
        }));
      } else {
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getPSGFromTSF(
    tenant: string,
    orgGrpcode: string,
    orgCode: string,
    roleGrpCode: string,
    roleCode: string,
  ) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
      );
      if (responseFromRedis) {
        const tsf = JSON.parse(responseFromRedis);
        const requiredOrgGrp = tsf.orgGrp.find(
          (ele) => ele.orgGrpCode == orgGrpcode,
        );
        const requiredOrg = requiredOrgGrp.org.find(
          (ele) => ele.orgCode == orgCode,
        );
        const requiredRG = requiredOrg.roleGrp.find(
          (ele) => ele.roleGrpCode == roleGrpCode,
        );
        const requirdRole = requiredRG.roles.find(
          (ele) => ele.roleCode == roleCode,
        );
        return requirdRole.psGrp.map((ele) => ({
          grpCode: ele.psGrpCode,
          grpName: ele.psGrpName,
        }));
      } else {
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getPSFromTSF(
    tenant: string,
    orgGrpcode: string,
    orgCode: string,
    roleGrpCode: string,
    roleCode: string,
    psGrpCode: string,
  ) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
      );
      if (responseFromRedis) {
        const tsf = JSON.parse(responseFromRedis);
        const requiredOrgGrp = tsf.orgGrp.find(
          (ele) => ele.orgGrpCode == orgGrpcode,
        );
        const requiredOrg = requiredOrgGrp.org.find(
          (ele) => ele.orgCode == orgCode,
        );
        const requiredRG = requiredOrg.roleGrp.find(
          (ele) => ele.roleGrpCode == roleGrpCode,
        );
        const requirdRole = requiredRG.roles.find(
          (ele) => ele.roleCode == roleCode,
        );

        const requiredPSG = requirdRole.psGrp.find(
          (ele) => ele.psGrpCode == psGrpCode,
        );
        return requiredPSG.ps.map((ele) => ({
          code: ele.psCode,
          name: ele.psName,
        }));
      } else {
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getTenantAgApp(
    orgGrpcode: string,
    orgCode: string,
    roleGrpCode: string,
    roleCode: string,
    psGrpCode: string,
    psCode: string,
  ) {
    try {
      const responseFromRedis = await this.redisService.getJsonData('t_sf');
      if (responseFromRedis) {
        const tsf = JSON.parse(responseFromRedis);

        const requiredOrgGrp = tsf.orgGrp.find(
          (ele) => ele.orgGrpCode == orgGrpcode,
        );
        const requiredOrg = requiredOrgGrp.org.find(
          (ele) => ele.orgCode == orgCode,
        );
        const requiredRG = requiredOrg.roleGrp.find(
          (ele) => ele.roleGrpCode == roleGrpCode,
        );
        const requirdRole = requiredRG.roles.find(
          (ele) => ele.roleCode == roleCode,
        );

        const requiredPSG = requirdRole.psGrp.find(
          (ele) => ele.psGrpCode == psGrpCode,
        );
        const requiredPS = requiredPSG.ps.find((ele) => ele.psCode == psCode);
        return requiredPS.tenants;
      } else {
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async processPortal(portal: any) {
    try {
      if (portal && typeof portal == 'object' && Array.isArray(portal)) {
        const processedData = portal.map((item: any) => {
          if (item.SIFlag == 'A') {
            return {
              resourceType: item.resourceType,
              SIFlag: item.SIFlag,
              actionAllowed: item.actionAllowed,
            };
          } else if (item.SIFlag == 'E') {
            return {
              resourceType: item.resourceType,
              SIFlag: item.SIFlag,
              actionDenied: item.actionDenied,
            };
          }
        });
        return processedData;
      } else {
        throw new Error('Provided portal data is not valid');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getPortal(token: string) {
    try {
      const payload = await this.jwtService.decode(token, { json: true });
      if (payload) {
        const { orgGrp, roleGrp, psGrp } = payload;

        const responseFromRedis = await this.redisService.getJsonData('t_sf');

        if (responseFromRedis) {
          const tsf = JSON.parse(responseFromRedis);

          const requiredOrgGrp = tsf.orgGrp.find(
            (ele) => ele.orgGrpCode == orgGrp.orgGrpCode,
          );

          const requiredOrg = requiredOrgGrp.org.find(
            (ele) => ele.orgCode == orgGrp.orgCode,
          );

          const requiredRoleGrp = requiredOrg.roleGrp.find(
            (ele) => ele.roleGrpCode == roleGrp.roleGrpCode,
          );

          const requiredrole = requiredRoleGrp.roles.find(
            (ele) => ele.roleCode == roleGrp.roleCode,
          );

          const requiredPSGrp = requiredrole.psGrp.find(
            (ele) => ele.psGrpCode == psGrp.psGrpCode,
          );

          const requiredPS = requiredPSGrp.ps.find(
            (ele) => ele.psCode == psGrp.psCode,
          );

          return await this.processPortal(requiredPS.portal);
        } else {
          throw new Error('Data not found');
        }
      } else {
        throw new Error('Token not valid');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getValueFromRedis(key: string) {
    try {
      if (key) {
        return await this.redisService.getJsonData(key);
      } else {
        throw new Error('key information not available');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async postValueinRedis(key: string, value: string) {
    try {
      return await this.redisService.setJsonData(key, JSON.stringify(value));
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAllKeys(keyPrefix: string) {
    try {
      const keys: any = await this.redisService.getKeys(keyPrefix);
      if (keys && keys.length) {
        return { data: keys };
      } else {
        return { error: 'No data available for the key' };
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }
  async getUserList(client: string, type: 't' | 'c' = 't') {
    try {
      if (client) {
        const userCachekey =
          type == 't'
            ? `TGA:T:PROFILE:setup:NA:${client}:v1:users`
            : `T:C:PROFILE:setup:NA:${client}:v1:users`;

        const data = await this.redisService.getJsonData(userCachekey);
        if (data) {
          const userlist: any[] = JSON.parse(data);
          return userlist.map((ele: any) => {
            delete ele.password;
            return ele;
          });
        } else {
          throw new NotFoundException('No data available for the key');
        }
      } else {
        throw new ForbiddenException('client information not available');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAuthorizedTenantDetails(token: string) {
    try {
      const payload: any = this.jwtService.decode(token, { json: true });

      if (payload && payload.auth && Array.isArray(payload.auth.ps)) {
        const tenantsArray = payload.auth.ps;

        // Create a map to track unique tenants by name
        const tenantsMap = new Map<string, any>();

        tenantsArray.forEach((tenantArray: any[]) => {
          tenantArray.forEach((tenant: any) => {
            if (!tenantsMap.has(tenant.name)) {
              // Add tenant if not already in map
              tenantsMap.set(tenant.name, {
                name: tenant.name,
                appGroups: [],
              });
            }

            const tenantData = tenantsMap.get(tenant.name);

            tenant.appGrp.forEach((appGrp: any) => {
              // Check if appGroup already exists
              const existingAppGroup = tenantData.appGroups.find(
                (ag: any) => ag.name === appGrp.name,
              );
              if (!existingAppGroup) {
                // Add new appGroup
                tenantData.appGroups.push({
                  name: appGrp.name,
                  apps: appGrp.app.map((app: any) => ({
                    name: app.name,
                  })),
                });
              } else {
                // Update existing appGroup with new apps
                const existingApps = new Set(
                  existingAppGroup.apps.map((app: any) => app.name),
                );
                appGrp.app.forEach((app: any) => {
                  if (!existingApps.has(app.name)) {
                    existingAppGroup.apps.push({ name: app.name });
                  }
                });
              }
            });
          });
        });

        const result = Array.from(tenantsMap.values());
        return result;
      } else {
        throw new UnauthorizedException('Invalid token payload');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getOrpsInfo(client: string) {
    try {
      if (client) {
        return await this.redisService.getJsonData(
          `T:C:PROFILE:setup:NA:${client}:v1`,
        );
      } else {
        throw new BadRequestException('Invalid client name');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getRecentArtifactDetailList(
    loginId: string,
    artifactType: artifactType,
    client?: string,
    fabric?: fabric | fabric[],
    catalog?: string | string[],
    artifactGrp?: string | string[],
    sortOrder: sortOrderOfArtifacts = 'Newest',
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
              for (const accessKey of ['crk', 'frk']) {
                const keyPrefix = `TCL:${accessKey.toUpperCase()}:${fab.toUpperCase()}:${cat}:${artGrp}`;
                const data: string[] =
                  await this.redisService.getKeys(keyPrefix);
                if (data && Array.isArray(data)) {
                  data.forEach((key) => {
                    key.endsWith('artifactInfo') &&
                      keys.push({ key, fab, accessKey });
                  });
                }
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
            var recentlyWorking;

            if (sortOrder == 'Recently Created') {
              recentlyWorking = versionObj.createdOn;
            } else if (sortOrder == 'Recently Modified') {
              recentlyWorking = versionObj.updatedOn;
            } else {
              recentlyWorking = versionObj.updatedOn || versionObj.createdOn;
            }

            // Initialize isPinned array if it doesn't exist
            const isPinned = versionObj.isPinned || [];

            // Check if the user has already pinned this artifact
            const isUserPinned = isPinned.some(
              (pin) => pin?.loginId === loginId,
            );

            if (artifactType == 'tpfrk') {
              if (
                versionObj?.sharingInfo?.find(
                  (item) => item?.sharedTo?.loginId === loginId,
                ) &&
                !versionObj.deleted
              ) {
                recentArtifacts.push({
                  artifactName,
                  version,
                  recentlyWorking,
                  fabric: artifactKeyDetail.fab,
                  catalog: catalogDetail,
                  artifactGrp: artifactGrpDetail,
                  artifactType: artifactKeyDetail.accessKey,
                  isLocked: versionObj.isLocked,
                  createdBy: versionObj.createdBy,
                  sharingInfo: versionObj.sharingInfo,
                  isUserPinned,
                });
              }
            } else {
              if (
                (versionObj.updatedBy === loginId ||
                  versionObj.createdBy === loginId) &&
                !versionObj.deleted
              ) {
                recentArtifacts.push({
                  artifactName,
                  version,
                  recentlyWorking,
                  fabric: artifactKeyDetail.fab,
                  catalog: catalogDetail,
                  artifactGrp: artifactGrpDetail,
                  artifactType: artifactKeyDetail.accessKey,
                  isLocked: versionObj.isLocked,
                  createdBy: versionObj.createdBy,
                  sharingInfo: versionObj.sharingInfo,
                  isUserPinned,
                });
              }
            }
          }
        }

        return recentArtifacts
          .filter((item) => item.recentlyWorking != '')
          .sort((a, b) => {
            // Sort by isUserPinned first
            if (a.isUserPinned && !b.isUserPinned) return -1;
            if (!a.isUserPinned && b.isUserPinned) return 1;

            // Then sort by the sortOrder (Newest or Oldest)
            if (sortOrder === 'Oldest') {
              return (
                new Date(a.recentlyWorking).getTime() -
                new Date(b.recentlyWorking).getTime()
              );
            } else {
              return (
                new Date(b.recentlyWorking).getTime() -
                new Date(a.recentlyWorking).getTime()
              );
            }
          });

        // if (sortOrder === 'Oldest') {
        //   return recentArtifacts
        //     .filter((item) => item.recentlyWorking != '')
        //     .sort(
        //       (a, b) =>
        //         new Date(a.recentlyWorking).getTime() -
        //         new Date(b.recentlyWorking).getTime(),
        //     );
        // }

        // return recentArtifacts
        //   .filter((item) => item.recentlyWorking != '')
        //   .sort(
        //     (a, b) =>
        //       new Date(b.recentlyWorking).getTime() -
        //       new Date(a.recentlyWorking).getTime(),
        //   );
      } else {
        throw new BadRequestException('Invalid input parameters');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async pushArtifact(
    artifactKeyPrefix: string,
    loginId: string,
    tenant: string,
    app: string,
    fabric?: fabric,
  ) {
    try {
      if (artifactKeyPrefix && loginId && tenant && app) {
        const artifactName = artifactKeyPrefix.split(':')[5];
        const version = artifactKeyPrefix.split(':')[6];
        const givenFabric = fabric ? fabric : artifactKeyPrefix.split(':')[2];
        const keys: string[] =
          await this.redisService.getKeys(artifactKeyPrefix);
        if (keys && Array.isArray(keys) && keys.length) {
          const overallResponse = await Promise.all(
            keys.map(async (key) => {
              const response = await this.redisService.copyData(
                key,
                `TGA:ABK${givenFabric.toUpperCase()}:BUILD:${tenant}:${app}:${artifactName}:${version}${key.replace(
                  artifactKeyPrefix,
                  '',
                )}`,
              );
              return response;
            }),
          );

          if (overallResponse.includes(0)) {
            throw new ConflictException('Failed to push artifact');
          } else {
            const logsData = {
              artifactName: artifactName,
              artifactKeyPrefix: artifactKeyPrefix,
              buildKeyPrefix: `TGA:ABK${givenFabric.toUpperCase()}:BUILD:${tenant}:${app}:${artifactName}:${version}`,
              version: version,
              loginId: loginId,
              timestamp: new Date(),
            };

            const responseFromRedis =
              await this.redisService.getJsonData('pushToBuildLogs');

            if (responseFromRedis) {
              const LogsArray = JSON.parse(responseFromRedis);
              LogsArray.push(logsData);
              await this.redisService.setJsonData(
                'pushToBuildLogs',
                JSON.stringify(LogsArray),
              );
            } else {
              await this.redisService.setJsonData(
                'pushToBuildLogs',
                JSON.stringify([logsData]),
              );
            }

            if (givenFabric.toLowerCase() == 'sf') {
              const sfData = await this.redisService.getJsonData(
                `${artifactKeyPrefix}:summary`,
              );
              if (sfData) {
                const response = await this.updateTenantProfileIfNotExists(
                  tenant,
                  JSON.parse(sfData),
                );
              }
            }

            return 'Artifact pushed successfully';
          }
        } else {
          throw new BadRequestException('No data available for the key');
        }
      } else {
        throw new BadRequestException('Provide all necessary parameters');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async updateTenantProfileIfNotExists(tenant: string, sfData: any) {
    try {
      const orpsGrp = { orgGrp: [], roleGrp: [], psGrp: [] };

      const addUniqueItem = (
        array: any[],
        newItem: any,
        compareKey: string,
      ) => {
        if (!array.some((item) => item[compareKey] === newItem[compareKey])) {
          array.push(newItem);
        }
      };

      const processPsGrp = (psGrp: any[]) => {
        psGrp.forEach(({ psGrpName, psGrpCode, ps }) => {
          let psGrpItem = orpsGrp.psGrp.find(
            (pg) => pg.psGrpCode === psGrpCode,
          );
          if (!psGrpItem) {
            psGrpItem = { psGrpName, psGrpCode, ps: [] };
            orpsGrp.psGrp.push(psGrpItem);
          }
          ps.forEach(({ psName, psCode }) => {
            addUniqueItem(psGrpItem.ps, { psName, psCode }, 'psCode');
          });
        });
      };

      const processRoleGrp = (roleGrp: any[]) => {
        roleGrp.forEach(({ roleGrpName, roleGrpCode, roles }) => {
          let roleGrpItem = orpsGrp.roleGrp.find(
            (rg) => rg.roleGrpCode === roleGrpCode,
          );
          if (!roleGrpItem) {
            roleGrpItem = { roleGrpName, roleGrpCode, roles: [] };
            orpsGrp.roleGrp.push(roleGrpItem);
          }
          roles.forEach(({ roleName, roleCode, psGrp }) => {
            addUniqueItem(
              roleGrpItem.roles,
              { roleName, roleCode },
              'roleCode',
            );
            processPsGrp(psGrp);
          });
        });
      };

      sfData.orgGrp.forEach(({ orgGrpName, orgGrpCode, org }) => {
        const orgGrpItem = { orgGrpName, orgGrpCode, org: [] };
        orpsGrp.orgGrp.push(orgGrpItem);
        org.forEach(({ orgCode, orgName, roleGrp }) => {
          const orgItem = { orgCode, orgName };
          addUniqueItem(orgGrpItem.org, orgItem, 'orgCode');
          processRoleGrp(roleGrp);
        });
      });

      const responseFromRedis = await this.redisService.getJsonData(
        `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
      );

      if (responseFromRedis) {
        const profileData = JSON.parse(responseFromRedis);
        const { roleGrp, orgGrp, psGrp } = profileData;

        if (roleGrp) {
          roleGrp.forEach((rg) => {
            const existingRoleGrp = orpsGrp.roleGrp.find(
              (nrg) => nrg.roleGrpCode === rg.roleGrpCode,
            );
            if (existingRoleGrp) {
              rg.roles.forEach((role) =>
                addUniqueItem(existingRoleGrp.roles, role, 'roleCode'),
              );
            } else {
              orpsGrp.roleGrp.push(rg);
            }
          });
        }

        if (orgGrp) {
          orgGrp.forEach((og) => {
            const existingOrgGrp = orpsGrp.orgGrp.find(
              (nog) => nog.orgGrpCode === og.orgGrpCode,
            );
            if (existingOrgGrp) {
              og.org.forEach((org) =>
                addUniqueItem(existingOrgGrp.org, org, 'orgCode'),
              );
            } else {
              orpsGrp.orgGrp.push(og);
            }
          });
        }

        if (psGrp) {
          psGrp.forEach((pg) => {
            const existingPsGrp = orpsGrp.psGrp.find(
              (npg) => npg.psGrpCode === pg.psGrpCode,
            );
            if (existingPsGrp) {
              pg.ps.forEach((ps) =>
                addUniqueItem(existingPsGrp.ps, ps, 'psCode'),
              );
            } else {
              orpsGrp.psGrp.push(pg);
            }
          });
        }
        await this.redisService.setJsonData(
          `TGA:T:PROFILE:setup:NA:${tenant}:v1`,
          JSON.stringify({
            ...profileData,
            roleGrp: orpsGrp.roleGrp,
            orgGrp: orpsGrp.orgGrp,
            psGrp: orpsGrp.psGrp,
          }),
        );

        return 'success';
      } else {
        throw new NotFoundException('Tenant Profile not found, check for key');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAllCatalogs(artifactType?: artifactType | artifactType[]) {
    try {
      const accessKeyArray = artifactType
        ? typeof artifactType === 'string'
          ? [artifactType]
          : artifactType
        : ['crk', 'frk'];

      // Use map to create an array of promises
      const promises = accessKeyArray.map(async (accessKey) => {
        // Fetch keys for each accessKey
        const response = await this.redisService.getKeys(
          `TCL:${accessKey.toUpperCase()}`,
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
      await this.throwCustomException(error);
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
        : ['crk', 'frk'];

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
                  `TCL:${accessKey.toUpperCase()}:${fab.toUpperCase()}:${catalogKey}`,
                ),
              )
            : [
                this.redisService.getKeys(
                  `TCL:${accessKey.toUpperCase()}:${fab.toUpperCase()}`,
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
      await this.throwCustomException(error);
    }
  }

  async getArtifactRelatedToBuild(tenant: string, appGrp: string, app: string) {
    try {
      if (!tenant || !appGrp || !app) {
        throw new NotAcceptableException('Invalid input parameters');
      }
      const buildKeyPrefix = `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${appGrp}:AFK:${app}`;
      const versionList = await this.getAssemblerVersion(buildKeyPrefix);
      const currentVersion = versionList.length
        ? Math.max(...versionList.map((item) => parseInt(item.slice(1))))
        : null;
      if (!currentVersion) {
        throw new NotFoundException('No artifacts found');
      }
      const buildConfiguration = JSON.parse(
        await this.redisService.getJsonData(
          `${buildKeyPrefix}:AFVK:v${currentVersion}:bldc`,
        ),
      );
      if (
        !buildConfiguration ||
        !buildConfiguration.hasOwnProperty('buildKey') ||
        !buildConfiguration.buildKey
      ) {
        throw new NotFoundException('No data available');
      }
      const artifactKeys = new Set([]);

      for (const build of buildConfiguration.buildKey) {
        artifactKeys.add(build.buildKey);
      }

      const overallResponse = await Promise.all(
        Array.from(artifactKeys).map(async (keyPrefix) => {
          const response = await this.redisService.getJsonData(
            `${keyPrefix}:AFI`,
          );
          if (response) {
            const versionObj = JSON.parse(response);
            const fabric = keyPrefix.split(':')[5].toLowerCase();
            const catalog = keyPrefix.split(':')[7];
            const artifactGrp = keyPrefix.split(':')[9];
            const artifactName = keyPrefix.split(':')[11];
            const version = keyPrefix.split(':')[13];
            return {
              artifactName,
              version,
              recentlyWorking: versionObj.updatedOn || versionObj.createdOn,
              fabric,
              catalog,
              artifactGrp,
              isLocked: versionObj.isLocked,
            };
          } else {
            return null;
          }
        }),
      );
      return overallResponse.filter((item) => item !== null);
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async renameArtifact(
    artifactType: artifactType,
    fabric: fabric,
    catalog: string,
    artifactGrp: string,
    oldName: string,
    newName: string,
  ) {
    try {
      if (artifactType && catalog && artifactGrp && oldName && newName) {
        const keyPrefix = `TCL:${artifactType.toUpperCase()}:${fabric.toUpperCase()}:${catalog}:${artifactGrp}:${oldName}`;
        const allOldKeys = await this.redisService.getKeys(keyPrefix);
        const newKeyPrefix = `TCL:${artifactType.toUpperCase()}:${fabric.toUpperCase()}:${catalog}:${artifactGrp}:${newName}`;
        const doesnewArtifactNameAlreadyExist =
          await this.redisService.getKeys(newKeyPrefix);
        if (!doesnewArtifactNameAlreadyExist.length) {
          const overallResponse = await Promise.all(
            allOldKeys.map(async (key: string) => {
              const response = await this.redisService.renameKey(
                key,
                `${newKeyPrefix}${key.replace(keyPrefix, '')}`,
              );
              return response;
            }),
          );
          return 'Artifact Renamed Successfully';
        } else {
          throw new NotAcceptableException(
            'Artifact Name Already Exists in the same group',
          );
        }
      } else {
        throw new BadRequestException('Invalid Input parameters');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async moveArtifact(
    sourceKeyPrefix: string,
    targetKeyPrefix: string,
    artifactName: string,
    version: string,
  ) {
    try {
      if (sourceKeyPrefix && targetKeyPrefix && artifactName && version) {
        const keysRelatedToArtifact = await this.redisService.getKeys(
          `${sourceKeyPrefix}:${artifactName}`,
        );
        const doesArtifactExistOnTarget = await this.redisService.getKeys(
          `${targetKeyPrefix}:${artifactName}`,
        );
        if (!doesArtifactExistOnTarget.length) {
          const overallResponse = await Promise.all(
            keysRelatedToArtifact.map(async (key: string) => {
              const response = await this.redisService.renameKey(
                key,
                `${targetKeyPrefix}${key.replace(sourceKeyPrefix, '')}`,
              );
              return response;
            }),
          );
          return 'Artifact Moved Successfully';
        } else {
          throw new Error('Artifact already exists on target destination');
        }
      } else {
        throw new BadRequestException('Invalid Input parameters');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }
  async shareArtifact(
    loginId: string,
    artifactType: artifactType,
    fabric: fabric,
    catalog: string,
    artifactGrp: string,
    artifactName: string,
    version: string,
    shareTo: { email: string; name: string },
    accessType: 'Can View' | 'Can Edit' | 'Full Access',
  ) {
    try {
      if (
        !loginId ||
        !artifactType ||
        !fabric ||
        !catalog ||
        !artifactGrp ||
        !artifactName ||
        !version ||
        !shareTo
      ) {
        throw new BadRequestException('Invalid Input parameters');
      }

      const redisKey = `TCL:${artifactType.toUpperCase()}:${fabric.toUpperCase()}:${catalog}:${artifactGrp}:${artifactName}:${version}:artifactInfo`;
      const artifactResponse = await this.redisService.getJsonData(redisKey);

      if (!artifactResponse) {
        throw new NotFoundException('Artifact not found');
      }

      const artifactInfo = JSON.parse(artifactResponse);
      const newSharingInfo = {
        sharedBy: loginId,
        sharedTo: shareTo,
        sharedAt: new Date(),
        accessType,
      };

      // If sharingInfo exists, check if the artifact is already shared
      if (artifactInfo.sharingInfo) {
        const existingShare = artifactInfo.sharingInfo.find(
          (item) => item.sharedTo.email === shareTo.email,
        );

        if (existingShare) {
          if (existingShare.accessType === accessType) {
            throw new NotAcceptableException('Already shared with this user');
          } else {
            // Update the access type
            existingShare.accessType = accessType;
          }
        } else {
          artifactInfo.sharingInfo.push(newSharingInfo);
        }
      } else {
        artifactInfo.sharingInfo = [newSharingInfo];
      }

      await this.redisService.setJsonData(
        redisKey,
        JSON.stringify(artifactInfo),
      );
      return artifactInfo.sharingInfo;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async deleteArtifact(
    loginId: string,
    artifactType: artifactType,
    fabric: fabric,
    catalog: string,
    artifactGrp: string,
    artifactName: string,
    version: string,
  ) {
    try {
      const redisKey = `TCL:${artifactType.toUpperCase()}:${fabric.toUpperCase()}:${catalog}:${artifactGrp}:${artifactName}:${version}:artifactInfo`;
      const artifactResponse = await this.redisService.getJsonData(redisKey);
      const artifactInfo = JSON.parse(artifactResponse);
      artifactInfo.deleted = true;
      await this.redisService.setJsonData(
        redisKey,
        JSON.stringify(artifactInfo),
      );
      return 'Artifact Deleted Successfully';
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async pinArtifact(loginId: string, artifactKey: string) {
    try {
      const artifactResponse = await this.redisService.getJsonData(artifactKey);
      if (artifactResponse) {
        const artifactInfo = JSON.parse(artifactResponse);
        artifactInfo.isPinned = artifactInfo.isPinned || [];

        // Check if the user has already pinned this artifact
        if (artifactInfo.isPinned.some((pin) => pin.loginId === loginId)) {
          throw new NotAcceptableException('Artifact already pinned');
        }

        // Get all artifacts to check the total number of pins by the user
        const pinnedArtifacts = await this.getPinnedArtifactsByUser(loginId);

        if (pinnedArtifacts.length >= 3) {
          // Sort artifacts by timestamp and remove the oldest one
          pinnedArtifacts.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );

          // Remove the oldest pinned artifact
          const oldestArtifactKey = pinnedArtifacts[0].artifactKey;
          await this.unpinArtifact(loginId, oldestArtifactKey);
        }

        // Add the loginId with timestamp to the isPinned array
        artifactInfo.isPinned.push({
          loginId,
          timestamp: new Date().toISOString(),
        });

        // Save the updated artifact info back to Redis
        await this.redisService.setJsonData(
          artifactKey,
          JSON.stringify(artifactInfo),
        );

        return 'Artifact pinned successfully';
      } else {
        throw new NotFoundException('Artifact not found');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getPinnedArtifactsByUser(loginId: string) {
    const keys = await this.redisService.getKeys('artifactInfo');
    const pinnedArtifacts = [];

    for (const key of keys) {
      const artifactResponse = await this.redisService.getJsonData(key);
      if (artifactResponse) {
        const artifactInfo = JSON.parse(artifactResponse);
        if (artifactInfo.isPinned) {
          const pinInfo = artifactInfo.isPinned.find(
            (pin) => pin.loginId === loginId,
          );
          if (pinInfo) {
            pinnedArtifacts.push({
              artifactKey: key,
              timestamp: pinInfo.timestamp,
            });
          }
        }
      }
    }

    return pinnedArtifacts;
  }

  async unpinArtifact(loginId: string, artifactKey: string) {
    try {
      const artifactResponse = await this.redisService.getJsonData(artifactKey);
      if (artifactResponse) {
        const artifactInfo = JSON.parse(artifactResponse);

        // Remove the loginId from the isPinned array
        artifactInfo.isPinned = artifactInfo.isPinned.filter(
          (pin) => pin.loginId !== loginId,
        );

        // Save the updated artifact info back to Redis
        await this.redisService.setJsonData(
          artifactKey,
          JSON.stringify(artifactInfo),
        );

        return 'Artifact unpinned successfully';
      } else {
        throw new NotFoundException('Artifact not found');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getSecurityTemplateData(tenant: string) {
    try {
      const responseFromRedis = await this.redisService.getJsonData(
        `TGA:T:PROFILE:setup:NA:${tenant}:v1:securityTemplate`,
      );
      const userResponse = await this.redisService.getJsonData(
        `TGA:T:PROFILE:setup:NA:${tenant}:v1:users`,
      );
      let securityTemplateData = [];
      if (responseFromRedis) {
        securityTemplateData = JSON.parse(responseFromRedis);
        if (userResponse) {
          const userlist = JSON.parse(userResponse);
          securityTemplateData = securityTemplateData.map((data) => {
            var noOfUsers = 0;
            userlist.forEach((user) => {
              if (
                user?.accessProfile &&
                user.accessProfile.includes(data.accessProfile)
              ) {
                noOfUsers += 1;
              }
            });
            return { ...data, 'no.ofusers': noOfUsers };
          });
        }
      }
      return securityTemplateData;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async postSecurityTemplateData(tenant: string, data: []) {
    try {
      if (tenant && data) {
        const UpdatedSecurityTemplateData = data;
        return await this.redisService.setJsonData(
          `TGA:T:PROFILE:setup:NA:${tenant}:v1:securityTemplate`,
          JSON.stringify([...UpdatedSecurityTemplateData]),
        );
      } else {
        throw new BadRequestException(
          'Please provide all necessary credentials',
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAccessProfiles(tenant: string) {
    try {
      if (!tenant) {
        throw new BadRequestException('Please provide tenant name');
      }
      const responseFromRedis = await this.redisService.getJsonData(
        `TGA:T:PROFILE:setup:NA:${tenant}:v1:securityTemplate`,
      );
      const accessProfileArray = [];
      const accessProfileWithProductAndService = {};
      if (responseFromRedis) {
        const accessProfileData: any[] = JSON.parse(responseFromRedis);
        accessProfileData.forEach((accessProfileObj) => {
          var noOfProdService = 0;
          accessProfileObj['products/Services'].forEach((productGrp: any) => {
            noOfProdService += productGrp['ps'].length;
          });
          accessProfileWithProductAndService[accessProfileObj?.accessProfile] =
            noOfProdService;
          accessProfileArray.push(accessProfileObj?.accessProfile);
        });
      }
      return accessProfileWithProductAndService;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async postUserList(tenant: string, data: any[]) {
    try {
      if (!tenant || !data || !Array.isArray(data)) {
        throw new BadRequestException('Invalid credentials');
      }
      var userList = [];
      const responseFromRedis = await this.redisService.getJsonData(
        `TGA:T:PROFILE:setup:NA:${tenant}:v1:users`,
      );
      if (responseFromRedis) {
        const existingUserList: any[] = JSON.parse(responseFromRedis);
        data.forEach((newUser) => {
          if (newUser.password) {
            userList.push({
              ...newUser,
              password: hashPassword(newUser.password),
            });
          } else {
            const existingUserObj = existingUserList.find(
              (existinguser) => existinguser.email == newUser.email,
            );
            userList.push({
              ...newUser,
              password: existingUserObj?.password,
            });
          }
        });
      } else {
        userList = data.map((item) => ({
          ...item,
          password: hashPassword(item.password),
        }));
      }
      return await this.redisService.setJsonData(
        `TGA:T:PROFILE:setup:NA:${tenant}:v1:users`,
        JSON.stringify([...userList]),
      );
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async pushArtifactToBuild(
    artifactKeyPrefix: string,
    loginId: string,
    tenant: string,
    appGrp: string,
    app: string,
    version?: string,
  ) {
    try {
      if (!tenant || !appGrp || !app || !artifactKeyPrefix || !loginId) {
        throw new BadRequestException('Invalid credentials');
      }

      const structuredArtifactKey = getRecentKeyStructure(artifactKeyPrefix);
      if (structuredArtifactKey['FNGK'] === 'AFC') {
        throw new NotAcceptableException(
          'Artifact already pushed to the build',
        );
      }

      const copiedArtifactKeyPrefix = artifactKeyPrefix.replace(
        ':AF:',
        ':AFC:',
      );
      const allKeysRelatedToArtifact =
        await this.redisService.getKeys(artifactKeyPrefix);

      await Promise.all(
        allKeysRelatedToArtifact.map((key: string) =>
          this.redisService.copyData(
            key,
            key.replace(artifactKeyPrefix, copiedArtifactKeyPrefix),
          ),
        ),
      );

      let redisKey: string;

      if (version) {
        redisKey = `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${appGrp}:AFK:${app}:AFVK:${version}:bldc`;
      } else {
        const versions = await this.getAssemblerVersion(
          `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${appGrp}:AFK:${app}:AFVK`,
        );
        let newVersion;
        if (versions && Array.isArray(versions) && versions.length) {
          newVersion =
            Math.max(...versions.map((item) => parseInt(item.slice(1)))) + 1;
        } else {
          newVersion = 1;
        }
        redisKey = `CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${appGrp}:AFK:${app}:AFVK:v${newVersion}:bldc`;
      }
      const responseFromRedis = await this.redisService.getJsonData(redisKey);
      const recentBuildInfo = {
        artifactKey: artifactKeyPrefix,
        buildKey: copiedArtifactKeyPrefix,
        loginId,
        timestamp: new Date(),
        fabric: getRecentKeyStructure(copiedArtifactKeyPrefix)['FNK'],
      };

      let updatedBuildKey = [recentBuildInfo];

      if (responseFromRedis) {
        const bldc = JSON.parse(responseFromRedis);
        updatedBuildKey = bldc.buildKey
          ? [...bldc.buildKey, recentBuildInfo]
          : updatedBuildKey;
        await this.redisService.setJsonData(
          redisKey,
          JSON.stringify({
            ...bldc,
            buildKey: updatedBuildKey,
            setupKey: `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
          }),
        );
      } else {
        await this.redisService.setJsonData(
          redisKey,
          JSON.stringify({
            buildKey: updatedBuildKey,
            setupKey: `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`,
            artifactList: [],
          }),
        );
      }

      return 'Artifact pushed to build successfully';
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async postNewTenantResource(
    tenant: string,
    resourceArray: any[] | any,
    resourceType: 'app' | 'org' | 'env' | 'profile',
  ) {
    try {
      if (tenant && resourceArray && resourceType) {
        const tenantResourceKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`;
        const responseFromRedis =
          await this.redisService.getJsonData(tenantResourceKey);
        if (responseFromRedis) {
          const tenantProfile = JSON.parse(responseFromRedis);
          switch (resourceType) {
            case 'app':
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({ ...tenantProfile, AG: resourceArray }),
              );
            case 'org':
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({ ...tenantProfile, orgGrp: resourceArray }),
              );
            case 'env':
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({ ...tenantProfile, env: resourceArray }),
              );
            case 'profile':
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({ ...tenantProfile, ...resourceArray }),
              );
            default:
              throw new BadRequestException(
                `Please provide valid resource type ${resourceType}`,
              );
          }
        } else {
          switch (resourceType) {
            case 'app':
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({ ...tenantProfileTemplate, AG: resourceArray }),
              );
            case 'org':
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({
                  ...tenantProfileTemplate,
                  orgGrp: resourceArray,
                }),
              );
            case 'env':
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({
                  ...tenantProfileTemplate,
                  env: resourceArray,
                }),
              );
            case 'profile':
              return await this.redisService.setJsonData(
                tenantResourceKey,
                JSON.stringify({ ...tenantProfileTemplate, ...resourceArray }),
              );
            default:
              throw new BadRequestException(
                `Please provide valid resource type ${resourceType}`,
              );
          }
        }
      } else {
        throw new BadRequestException(
          'Please provide all necessary credentials',
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getTenantOrganizationMatrix(tenant: string) {
    try {
      if (!tenant) {
        throw new BadRequestException(
          'Please provide tenant to get organization matrix',
        );
      }
      const tenantResourceKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenant}:AFK:PROFILE:AFVK:v1:tpc`;
      const responseFromRedis =
        await this.redisService.getJsonData(tenantResourceKey);
      if (!responseFromRedis) {
        throw new NotFoundException('No organization matrix found');
      }
      const tenantProfile = JSON.parse(responseFromRedis);
      if (tenantProfile?.orgGrp) {
        return tenantProfile.orgGrp;
      } else {
        throw new NotFoundException(
          'No organization matrix found , try setting an organization',
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getAppEnv(tenantCode: string) {
    try {
      if (!tenantCode) {
        throw new BadRequestException(
          'Please provide tenant to get app env info',
        );
      }
      const tenantProfileInfo = JSON.parse(
        await this.redisService.getJsonData(
          `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenantCode}:AFK:PROFILE:AFVK:v1:tpc`,
        ),
      );
      if (
        !tenantProfileInfo ||
        !tenantProfileInfo.AG ||
        !tenantProfileInfo.hasOwnProperty('ENV')
      ) {
        throw new NotFoundException('No app env info found');
      }
      const resultArray = [];
      const appGroupData = tenantProfileInfo.AG;
      const envData = tenantProfileInfo.ENV;

      for (const appgrp of appGroupData) {
        const requiredAppGrp = {
          code: appgrp.code,
          name: appgrp.name,
          APPS: [],
        };
        if (appgrp.APPS && Array.isArray(appgrp.APPS)) {
          for (const app of appgrp.APPS) {
            const requiredAppCode = app.code;
            for (const env of envData) {
              env.APPS = env.APPS || [];
              const requiredAppEnvData = env.APPS.find(
                (envApp) => envApp?.code === requiredAppCode,
              );
              if (requiredAppEnvData) {
                const { code: envTitle, HostName, HostIP, volumePath } = env;
                const envData = {
                  env: envTitle,
                  HostName,
                  HostIP,
                  volumePath,
                };
                if (!requiredAppGrp.APPS.some((a) => a.code == app.code)) {
                  requiredAppGrp.APPS.push({
                    ...app,
                    ...requiredAppEnvData,
                    ...envData,
                  });
                }
              } else {
                if (!requiredAppGrp.APPS.some((a) => a.code == app.code)) {
                  requiredAppGrp.APPS.push({ ...app });
                }
              }
            }
          }
        }
        resultArray.push(requiredAppGrp);
      }

      return resultArray;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async potAppEnv(tenantCode: string, data: any[]) {
    try {
      if (!tenantCode || !data || !Array.isArray(data)) {
        throw new BadRequestException('lack of proper data to continue');
      }
      const tenantResourceKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${tenantCode}:AFK:PROFILE:AFVK:v1:tpc`;
      const tenantProfile = JSON.parse(
        await this.redisService.getJsonData(tenantResourceKey),
      );
      if (!tenantProfile) {
        throw new NotFoundException('No data found for a requested tenant');
      }
      const ENV = structuredClone(tenantProfile.ENV);
      const AG = [];
      for (const appgrp of data) {
        const requiredAppGrp = {
          code: appgrp.code,
          name: appgrp.name,
          APPS: [],
        };
        for (const app of appgrp.APPS) {
          if (app.env) {
            const appEnvInfo = {
              code: app.code,
              version: app?.version,
              status: app?.status,
              generatedUrl: app?.generatedUrl,
              accessUrl: app?.accessUrl,
              appPath: app?.appPath,
            };
            const existingEnvIndex = ENV.findIndex(
              (envObj: any) => envObj.code == app.env,
            );
            if (existingEnvIndex != -1) {
              const existingAppIndex = ENV[existingEnvIndex].APPS
                ? ENV[existingEnvIndex].APPS.findIndex(
                    (envApp) => envApp.code == appEnvInfo.code,
                  )
                : -1;
              if (existingAppIndex != -1) {
                ENV[existingEnvIndex].APPS[existingAppIndex] = appEnvInfo;
              } else {
                if (ENV[existingEnvIndex].APPS) {
                  ENV[existingEnvIndex].APPS.push(appEnvInfo);
                } else {
                  ENV[existingEnvIndex].APPS = [appEnvInfo];
                }
              }
              requiredAppGrp.APPS.push({ code: app?.code, name: app?.name });
            }
          }
        }
        AG.push(requiredAppGrp);
      }
      return await this.redisService.setJsonData(
        tenantResourceKey,
        JSON.stringify({ ...tenantProfile, AG, ENV }),
      );
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getClientProfile(clientCode: string) {
    const clientProfile = {};
    try {
      if (!clientCode) {
        throw new BadRequestException('Please provide client code');
      }
      const clientProfileKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`;
      const responseFromRedis =
        await this.redisService.getJsonData(clientProfileKey);
      if (!responseFromRedis) {
        throw new NotFoundException('No client profile found');
      } else {
        Object.entries(JSON.parse(responseFromRedis)).forEach(
          ([key, value]) => {
            if (typeof value == 'string') {
              clientProfile[key] = value;
            }
          },
        );
      }
      return clientProfile;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async PostClientProfile(clientCode: string, data: any) {
    try {
      if (!clientCode) {
        throw new BadRequestException('Please provide client code');
      }
      const clientResourceKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`;
      const responseFromRedis =
        await this.redisService.getJsonData(clientResourceKey);
      const clientProfile = JSON.parse(responseFromRedis);
      return await this.redisService.setJsonData(
        clientResourceKey,
        JSON.stringify({ ...clientProfile, ...data }),
      );
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async MyAccountForClient(token: string) {
    try {
      const payload: any = this.jwtService.decode(token);
      if (!payload) {
        throw new BadRequestException('Please provide valid token');
      } else {
        const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${payload.client}:AFK:PROFILE:AFVK:v1:users`;
        const responseFromRedis =
          await this.redisService.getJsonData(userCachekey);
        const userList = JSON.parse(responseFromRedis);
        const reqiredUser = userList.find(
          (user) => user.email === payload.email,
        );
        delete reqiredUser.password;
        return reqiredUser;
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async updateMyAccount(clientCode: string, data: any) {
    try {
      if (!clientCode) {
        throw new BadRequestException('Please provide client code');
      }
      const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:users`;
      const responseFromRedis =
        await this.redisService.getJsonData(userCachekey);
      const userList: any[] = JSON.parse(responseFromRedis);
      const reqiredUser = userList.find((user) => user.email === data.email);
      const reqiredUserIndex = userList.findIndex(
        (user) => user.email === data.email,
      );
      if (!reqiredUser) {
        throw new NotFoundException('User not found');
      }
      if (data?.password) {
        const hashedPassword = hashPassword(data.password);
        userList.splice(reqiredUserIndex, 1, {
          ...data,
          password: hashedPassword,
        });
      } else {
        userList.splice(reqiredUserIndex, 1, {
          ...data,
          password: reqiredUser.password,
        });
      }

      return await this.redisService.setJsonData(
        userCachekey,
        JSON.stringify(userList),
      );
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async clientUserAddition(clientCode: string, data: any) {
    try {
      if (!clientCode || !data) {
        throw new BadRequestException('Invalid input parameters');
      }
      const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:users`;
      const clientProfileResourceKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`;
      const userList: any[] = JSON.parse(
        await this.redisService.getJsonData(userCachekey),
      );
      const clientProfile = JSON.parse(
        await this.redisService.getJsonData(clientProfileResourceKey),
      );
      const { email, firstName, lastName, password, loginId: username } = data;

      const mailOptions = {
        from: 'support@torus.tech',
        to: email,
        subject: ` Welcome to ${clientProfile.clientName} – Let’s Get Started! `,
        text: `Hi ${firstName} ${lastName},

Welcome to ${clientProfile.clientName}! Your account has been successfully created, and you can now log in to start using our platform.

Your Credentials:
clientCode : ${clientCode}
Username: ${username}
Password: ${password}
What to do next:
Log in: Use the credentials above to log in to your account here: http://nextjs9x.tvlgss.com/login.
Change your password: For security, we recommend updating your password after logging in. You can easily do this by navigating to the profile settings.
Need assistance?
If you have any questions or run into any issues, feel free to contact us at support@torus.tech. We're happy to help!

Thank you for choosing ${clientProfile.clientName} – we look forward to supporting you!

Best regards,
The ${clientProfile.clientName} Team
[support@torus.tech]`,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          throw new ForbiddenException('There is an issue with sending otp');
        } else {
          console.log('Email sent: ' + info.response);
          // return `Email sent`;
        }
      });

      userList.push({ ...data, password: hashPassword(data.password) });
      await this.redisService.setJsonData(
        userCachekey,
        JSON.stringify(userList),
      );
      const newUserList = structuredClone(userList);

      let result = [];

      for (const user of newUserList) {
        delete user.password;
        result.push(user);
      }

      return result;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async getDynamicTenantCode(
    clientCode: string,
    tenantName: string,
    Logo?: string,
  ) {
    try {
      if (!clientCode || !tenantName) {
        throw new BadRequestException('invalid input parameters');
      }
      const clientProfileKey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:tpc`;
      const clientProfile = JSON.parse(
        await this.redisService.getJsonData(clientProfileKey),
      );
      const tenantList = clientProfile?.tenantList
        ? new Set(clientProfile?.tenantList)
        : new Set([]);
      const tenantKeys: string[] = await this.redisService.getKeys(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK`,
      );
      const dynamicTenantKeys = tenantKeys.filter((key) =>
        key.includes(`CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:TT`),
      );
      var newTenantCode = '';
      if (dynamicTenantKeys.length == 0) {
        newTenantCode = 'TT001';
      } else {
        const structuredClientKeys = dynamicTenantKeys.map(
          (key: string) => getRecentKeyStructure(key)['AFGK'],
        );
        const maxExistingCode = Math.max(
          ...structuredClientKeys.map((item) => parseInt(item.slice(2))),
        );
        newTenantCode = `TT${String(maxExistingCode + 1).padStart(3, '0')}`;
      }
      tenantList.add(newTenantCode);
      await this.redisService.setJsonData(
        clientProfileKey,
        JSON.stringify({
          ...clientProfile,
          tenantList: Array.from(tenantList),
        }),
      );
      await this.redisService.setJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${newTenantCode}:AFK:PROFILE:AFVK:v1:tpc`,
        JSON.stringify({
          ...tenantProfileTemplate,
          Code: newTenantCode,
          Name: tenantName,
          Logo: Logo ? Logo : '',
        }),
      );
      return newTenantCode;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  // async postClientUserRoles(clientCode:string , roles:any[]){
  //   try {
  //     if(!clientCode || !roles || Array.isArray(roles)){
  //       throw new BadRequestException('Improper data to continue')
  //     }
  //     const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:users`
  //     const roleCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:userRoles`
  //     const userList = JSON.parse(await this.redisService.getJsonData(userCachekey));
  //     if(userList && Array.isArray(userList)){
  //       for (const userObj of userList) {
  //         if(userObj?.accessProfile && Array.isArray(userObj.accessProfile)){
  //           for (const accessProfile of userObj?.accessProfile) {
  //             const accessProfileArray = (roles as any[]).map((roleObj)=> roleObj.role)
  //             if(!accessProfileArray.includes(accessProfile)){

  //             }
  //           }
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     await this.throwCustomException(error)
  //   }
  // }

  async postClientUserRoles(clientCode: string, roles: any[]) {
    try {
      // Validate inputs
      if (!clientCode || !roles || !Array.isArray(roles)) {
        throw new BadRequestException('Improper data to continue');
      }
  
      // Cache keys for users and roles
      const userCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:users`;
      const roleCachekey = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${clientCode}:AFK:PROFILE:AFVK:v1:userRoles`;
  
      // Get the list of users from Redis
      const userList = JSON.parse(await this.redisService.getJsonData(userCachekey));
  
      if (userList && Array.isArray(userList)) {
        // Extract roles from the input for easier comparison
        const roleNames = roles.map(roleObj => roleObj.role);
  
        for (const userObj of userList) {
          if (userObj?.accessProfile && Array.isArray(userObj.accessProfile)) {
            // Filter the accessProfile array to only include roles present in roleNames
            userObj.accessProfile = userObj.accessProfile.filter(accessProfile =>
              roleNames.includes(accessProfile) || accessProfile == 'admin'
            );
          }
        }
  
        // Update the userList in Redis after filtering
        await this.redisService.setJsonData(userCachekey, JSON.stringify(userList));
  
        // Update the roles in Redis if needed (optional if roles need to be stored)
        await this.redisService.setJsonData(roleCachekey, JSON.stringify(roles));
  
        return { message: 'User roles successfully updated.' };
      } else {
        throw new BadRequestException('User list not found');
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }
  
}
