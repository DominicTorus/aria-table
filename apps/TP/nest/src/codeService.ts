import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class CodeService{

  private readonly logger = new Logger(CodeService.name);

  async customCode(data:any,code:any){  
    this.logger.log("Code Service started") 
    try{          
         var chkkey = Object.keys(data)
         var chkval = Object.values(data) 
       
        for(var s = 0; s < chkkey.length; s++){
          if(code.includes((chkkey[s]+'_val'))){           
            if (typeof chkval[s] === 'number') {             
              code = code.replace(new RegExp(chkkey[s] + '_val', 'g'), chkval[s]);
            }else if (typeof chkval[s] === 'string') {              
              code = code.replace(new RegExp(chkkey[s] + '_val', 'g'), `'${chkval[s]}'`);
            }else if (chkval[s] === null || chkval[s] === "") {            
              code = code.replace(new RegExp(chkkey[s] + '_val', 'g'), `'${chkval[s]}'`);
            }           
          }
        }
               
       var t1 = eval(code); 
       this.logger.log("code service completed")      
       return t1
    }catch(err){
      console.log("err",err)
      throw err
    }
  }
   
}