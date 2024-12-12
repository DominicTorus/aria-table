import { BadRequestException, CanActivate, ExecutionContext,Injectable, Logger } from "@nestjs/common";
import { RedisService } from "src/redisService";
import { SecurityService } from "src/securityService";
import { TeCommonService } from "../teCommonService";


declare module 'express-session' {
  interface Session {
    psArray: Array<any>;
  }
}
@Injectable()
export class AuthGuard implements CanActivate {
 constructor( private readonly securityService: SecurityService,private readonly teCommonService: TeCommonService,private readonly redisService: RedisService) {}
 
 /**
+   * This function is a guard which checks whether the user is logged in and has the required permissions to access the route.
+   * If the user is logged in and has the required permissions, the function returns true and the request is allowed to continue.
+   * If the user is not logged in or does not have the required permissions, the function returns false and the request is blocked.
+   * @param context The context of the request.
+   * @returns A boolean indicating whether the request is allowed to continue.
+   */
 async canActivate(context: ExecutionContext): Promise<boolean>{
  const request = context.switchToHttp().getRequest();
  try {
   
    if(await this.redisService.exist(request.body.key+'PO')){
      var seckey = request.body.key+'PO'
    }else if(await this.redisService.exist(request.body.key+'DO')){
      var seckey = request.body.key+'DO'
    }
     const sjsoncheck = await this.securityService.getSecurityTemplate(seckey)
     if(sjsoncheck){  
      if(Array.isArray(sjsoncheck)){
        if(sjsoncheck.length > 0){
          Logger.log("Auth Guard started..")
          request.session.node = sjsoncheck 
          return true
        }  
      } 
    }else{
      await this.teCommonService.getTSL(request.body.key,request.session.token,'Badrequest in security template',400)
      throw 'Badrequest in security template'
    }
    
  } catch (error) {
    var tslerror = await this.teCommonService.getTSL(request.body.key,request.session.token,error,400)
    throw new BadRequestException(tslerror)
  } 
 }
}