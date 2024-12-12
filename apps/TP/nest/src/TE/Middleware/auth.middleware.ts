import { Injectable, NestMiddleware, NotAcceptableException, NotFoundException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { RedisService } from 'src/redisService';
import { TeCommonService } from '../teCommonService';

declare module 'express-session' {
  interface Session {
    sToken: any;
  }
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService, private readonly teCommonService: TeCommonService) {}
  
   /**
+   * Middleware function to authenticate the request.
+   * It checks if the token is present in the request headers.
+   * If the token is not present, it throws a NotAcceptableException.
+   * It also checks if the process key and security key are present in the request body.
+   * If either of them is missing, it throws a NotFoundException.
+   * Finally, it checks if the security key exists in the Redis database.
+   * If the security key is not found or the security json is empty, it throws a NotFoundException.
+   * If all the checks pass, it calls the next middleware function.
+   *
+   * @param {Request} req - The request object.
+   * @param {Response} res - The response object.
+   * @param {NextFunction} next - The next middleware function.
+   * @returns {Promise<void>} - A promise that resolves when the authentication is successful.
+   */
  async use(req: Request, res: Response, next: NextFunction) {    
    console.log(req.ip);   
 
    if(req.headers.authorization == undefined){
      let err = await this.teCommonService.getTSL(req.body.key,tokenhead,'Given token not found',400)
      throw new NotAcceptableException(err)
    }

    var tokenhead: any = req.headers.authorization.split(' ')[1];    
    req.session.sToken = tokenhead;
 
    if(!req.body.key){
      let err = await this.teCommonService.getTSL(req.body.key,tokenhead,'Given Process Key not found',400)
      throw new NotFoundException(err)
    }    
    
      var availablesfkey = JSON.parse(await this.redisService.getJsonData(req.body.key+'PO')) || JSON.parse(await this.redisService.getJsonData(req.body.key+'DO'))       
     
      if(availablesfkey != null){
      if(Object.keys(availablesfkey).length>0){
        console.log("Execution started...")
        next()
      }
      else{
        let err = await this.teCommonService.getTSL(req.body.key,tokenhead,'Given Security json is empty in Redis',400)
        throw new NotFoundException(err)
      }
      }else{
        let err = await this.teCommonService.getTSL(req.body.key,tokenhead,'Given Security key is not found in Redis',400)
        throw new NotFoundException(err)
      }  
  }
}