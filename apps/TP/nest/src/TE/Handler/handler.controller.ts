import { BadRequestException, Body, Controller, Headers, Logger, Post } from "@nestjs/common";
import { SavehandlerService } from "./handlerService";
import { ApiBody } from "@nestjs/swagger";
import { updateDTO } from "../Dto/input";
import { LockService } from "src/lock.service";

@Controller('handler')
export class saveHandlerController {
    constructor(
      private readonly savehandlerService: SavehandlerService,
      private readonly lockservice:LockService) {}
    private readonly logger = new Logger(saveHandlerController.name);
 

    @Post('pagination')
    async paginationHandler(@Body() input, @Headers('Authorization') auth:any){  
      var token = auth.split(' ')[1];
      return await this.savehandlerService.paginationHandler(token,input.path,input.page,input.count,input.selectColumns,input.filterColumns,input.sfkey,input.dfkey)
    }

    @ApiBody({
        description: 'Input parameters',
        type: updateDTO,
    })
    @Post('update')
    async getUpdate(@Body() input, @Headers('Authorization') auth: any,) {       
       try {
        this.logger.log('update handler started')          
            if (input.primaryKey && input.url && input.tableName && input.data && auth) {
                var token = auth.split(' ')[1];  
                var lock:any         
           
            if (input.lockDetails && input.lockDetails.ttl) {   
              this.logger.log('lock verified')    
                const resource = [`locks:${input.tableName}:${input.primaryKey}`];
                const ttl = input.lockDetails.ttl
                lock = await this.lockservice.acquireLock(resource, ttl);               
                this.logger.log(`Lock acquired for ${input.primaryKey}`);
            }

            var result = await this.savehandlerService.updateHandler(input.data, input.key, input.upId, input.url,input.tableName, input.primaryKey, token)
            this.logger.log('updated result',result)
            
            if(result != undefined || result != null){     
              if(result.statusCode){   
              if(result.statusCode == 201) {
                if(input.lockDetails && input.lockDetails.ttl){
                 // await new Promise((resolve) => setTimeout(resolve, 10000));  
                  await this.lockservice.releaseLock(lock);        
                  this.logger.log(`Lock released for ${input.primaryKey}`);          
                }
                return result
              }
            }
            }
          } else {
            throw 'primarykey/tablename/data/token not found'
        }
        }
        catch (error) {     
          console.log(error)     
          if(input.lockDetails){         
            if(input.lockDetails.ttl && JSON.stringify(error).includes('quorum')){
              throw new BadRequestException('Resource locked by other user');
            }
            if(lock){
              await this.lockservice.releaseLock(lock);
              this.logger.log(`Lock released for ${input.primaryKey}`);
            }
            
          }      
          throw new BadRequestException(error);
        }  
    }  
    
    @Post('save')
    async save(@Body() input, @Headers('Authorization') auth: any): Promise<any> {
      var token = auth.split(' ')[1];   
        
        if (input.data && input.url) 
          return await this.savehandlerService.savehandler(input.data, input.url, input.key, input.event, input.nodeId, input.nodeName,input.nodeType, token, input.upId)
        else
          return 'data/url is required'
    }
   
}