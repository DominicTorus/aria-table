import { Controller } from "@nestjs/common";
import { TSService } from "./ts.service";
import { EventPattern } from "@nestjs/microservices";
import { PoEvent } from "src/TE/Dto/poevent";

@Controller('ts')
export class TSController {
    constructor(private readonly tsService: TSService){}

        @EventPattern('RequestInitiated') 
        async RequestInitiated(input: PoEvent) { 
           return await this.tsService.getTSProcess(input)
        }       
           @EventPattern('RequestCompleted') 
        async RequestCompleted(input: PoEvent) { 
           return await this.tsService.getTSProcess(input)
        }       
           @EventPattern('WaitingForApproval') 
        async WaitingForApproval(input: PoEvent) { 
           return await this.tsService.getTSProcess(input)
        }       
           @EventPattern('RequestProcessed') 
        async RequestProcessed(input: PoEvent) { 
           return await this.tsService.getTSProcess(input)
        }       
           @EventPattern('Approved') 
        async Approved(input: PoEvent) { 
           return await this.tsService.getTSProcess(input)
        }       
           @EventPattern('Rejected') 
        async Rejected(input: PoEvent) { 
           return await this.tsService.getTSProcess(input)
        }       
    
}