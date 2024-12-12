import { ApiProperty } from "@nestjs/swagger";

export class Input {
   
    @ApiProperty({ description: 'Security Key', example: 'ABC:MSP:ME:SF:bankmaster:v3' })
    sfkey: string;
  
    @ApiProperty({ description: 'Process Key', example: 'ABC:MSP:ME:PF:bankmaster:v3:' })
    key: string;
    
    @ApiProperty({ description: 'Mode', example: 'E' })
    mode: string;

    @ApiProperty({ description: 'token', example: '' })
    token?: string;    
  
    @ApiProperty({ description: 'Security Flag', example: 'Y', required: false })
    sflag?: string;

    upId?:string;    
  }

  export class ResumeDTO {

    @ApiProperty({ description: 'Security Key', example: 'ABC:MSP:ME:SF:bankmaster:v3' })
    sfkey: string;
  
    @ApiProperty({ description: 'Process Key', example: 'ABC:MSP:ME:PF:bankmaster:v3:' })
    key: string;
  
    @ApiProperty({ description: 'User ID', example: 'ct6df5cw19964f1m0qv0' })
    upId: string;
  
    @ApiProperty({ description: 'Mode', example: 'E' })
    mode: string;
  }
  
  export class FormdataDTO {

    @ApiProperty({ description: 'Security Key', example: 'ABC:MSP:ME:SF:bankmaster:v3' })
    sfkey: string;
  
    @ApiProperty({ description: 'Process Key', example: 'ABC:MSP:ME:PF:bankmaster:v3:' })
    key: string;
  
    @ApiProperty({ description: 'User ID', example: 'ct6df5cw19964f1m0qv0' })
    upId: string;
  
    @ApiProperty({ description: 'Node ID', example: 'e58f776e-336c-4a91-901b-b79897796a2c' })
    nodeId: string;
  
    @ApiProperty({ description: 'Node Name', example: 'HumanTaskNode' })
    nodeName: string;
  
    @ApiProperty({ description: 'Form Data', example: '{ fromAccountNo: 1234567890,fromAccHolderName:Raja, toAccountNo: 1234509876,toAccHolderName: Siva,dateOfTransaction: 04/01/2024,amount: 10000,currency: INR,status: Active,role: admin,amlCheck: Y,roleCheck: admin,CScore: 20,balance: 100}'})
    formdata: string;
  
    @ApiProperty({ description: 'Mode', example: 'E' })
    mode: string;
  }

  export class NodeExecuteDTO {

    @ApiProperty({ description: 'Security Key', example: 'ABC:MSP:ME:SF:bankmaster:v3' })
    sfkey: string;
  
    @ApiProperty({ description: 'Process Key', example: 'ABC:MSP:ME:PF:bankmaster:v3:' })
    key: string;
  
    @ApiProperty({ description: 'User ID', example: 'ct6df5cw19964f1m0qv0' })
    upId: string;
  
    @ApiProperty({ description: 'Node ID', example: 'e58f776e-336c-4a91-901b-b79897796a2c' })
    nodeId: string;
  
    @ApiProperty({ description: 'Node Name', example: 'ManualInput' })
    nodeName: string;
  
    @ApiProperty({ description: 'Node Type', example: 'HumanTaskNode' })
    nodeType: string;
  }

  export class DebugNodeDTO {

    @ApiProperty({ description: 'Security Key', example: 'ABC:MSP:ME:SF:bankmaster:v3' })
    sfkey: string;
  
    @ApiProperty({ description: 'Process Key', example: 'ABC:MSP:ME:PF:bankmaster:v3:' })
    key: string;
  
    @ApiProperty({ description: 'User ID', example: 'ct6df5cw19964f1m0qv05' })
    upId: string;
  
    @ApiProperty({ description: 'Node ID', example: 'e58f776e-336c-4a91-901b-b79897796a2c' })
    nodeId: string;
  
    @ApiProperty({ description: 'Node Name', example: 'ManualInput' })
    nodeName: string;
  
    @ApiProperty({ description: 'Node Type', example: 'HumanTaskNode' })
    nodeType: string;

    @ApiProperty({ description: 'Params', example: '{"interest":"2"}' })
    params: object;
  }

  export class DebugRequestDTO {

    @ApiProperty({ description: 'Process Key', example: 'ABC:MSP:ME:PF:bankmaster:v3:' })
    key: string;
  
    @ApiProperty({ description: 'User ID', example: 'ct6df5cw19964f1m0qv0' })
    upId: string;
  
    @ApiProperty({ description: 'Node Name', example: 'ManualInput' })
    nodeName: string;

    @ApiProperty({ description: 'Node ID', example: 'humantasknode' })
    nodeId: string;
  
  }

  export class DebugHtRequestDTO {

    @ApiProperty({ description: 'Process Key', example: 'ABC:MSP:ME:PF:bankmaster:v3:' })
    key: string;
  
    @ApiProperty({ description: 'User ID', example: 'ct6df5cw19964f1m0qv0' })
    upId: string;
  
    @ApiProperty({ description: 'Node Name', example: 'ManualInput' })
    nodeName: string;

    @ApiProperty({ description: 'Node ID', example: 'HumanTaskNode' })
    nodeId: string;

  }

  export class DebugresponseDTO {

    @ApiProperty({ description: 'Process Key', example: 'ABC:MSP:ME:PF:bankmaster:v3:' })
    key: string;
  
    @ApiProperty({ description: 'User ID', example: 'ct6df5cw19964f1m0qv045' })
    upId: string;

    @ApiProperty({ description: 'Node ID', example: 'e58f776e-336c-4a91-901b-b79897796a2c' })
    nodeId: string;

    @ApiProperty({ description: 'Node Name', example: 'ManualInput' })
    nodeName: string;
  }

  export class updateDTO {
 
    @ApiProperty({ description: 'Data', example: 'ABC:MSP:ME:PF:bankmaster:v3:' })
    data: string;
 
    @ApiProperty({ description: 'Key', example: 'ABC:MSP:ME:PF:bankmaster:v3:' })
    Key: string;
 
    @ApiProperty({ description: 'UPID', example: 'cvty65hhjh899o1m0qv0' })
    upId: string;
 
    @ApiProperty({ description: 'Table Name', example: 'bankmaster' })
    tableName: string;
 
    @ApiProperty({ description: 'Param', example: 'ABC:MSP:ME:PF:bankmaster:v3:' })
    param: string;
 
    @ApiProperty({ description: 'Security Key', example: 'ABC:MSP:ME:SF:bankmaster:v3:' })
    sfKey: string;
 
    @ApiProperty({ description: 'Token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyjhfj5ufhru857gjuhg8t78gu78t57ugtju85' })
    token: string;
  }
 
 
  export class refreshDTO {
 
    @ApiProperty({ description: 'Refresh Key', example: 'ABC:MSP:ME:PF:bankmaster:v3:' })
    key: string;
 
    @ApiProperty({ description: 'Token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyjhfj5ufhru857gjuhg8t78gu78t57ugtju85' })
    token: string;
 
    @ApiProperty({ description: 'UPID', example: 'cvty65hhjh899o1m0qv0' })
    upid: string;
  }
 
  export class readAPIDTO {

    @ApiProperty({ description: 'Source', example: 'redis' })
    SOURCE: string;
 
    @ApiProperty({ description: 'Target', example: 'mongo' })
    TARGET: string;
 
    @ApiProperty({ description: 'CK', example: 'TCL' })
    CK: string; 
   
    @ApiProperty({ description: 'FNGK', example: 'AF' })
    FNGK: string;
 
    @ApiProperty({ description: 'FNK', example: 'DF' })
    FNK: string;
 
    @ApiProperty({ description: 'CATK', example: ['FINTECH'] })
    CATK: string[];
 
    @ApiProperty({ description: 'AFGK', example: ['VPHCoreMaster'] })
    AFGK: string[];
 
    @ApiProperty({ description: 'AFK', example: ['bankmaster'] })
    AFK: string[];
 
    @ApiProperty({ description: 'AFVK', example: ['v1'] })
    AFVK: string[];
 
     @ApiProperty({ description: 'AFSK', example: 'nodeProperty' })
    AFSK: string;
  }

  export class deleteAPIDTO {
 
   @ApiProperty({ description: 'Source', example: 'redis' })
    SOURCE: string;
 
    @ApiProperty({ description: 'Target', example: 'mongo' })
    TARGET: string;
 
    @ApiProperty({ description: 'CK', example: 'TCL' })
    CK: string;
 
    @ApiProperty({ description: 'FNGK', example: 'AF' })
    FNGK: string;
 
    @ApiProperty({ description: 'FNK', example: 'DF' })
    FNK: string;
 
    @ApiProperty({ description: 'CATK', example: 'FINTECH' })
    CATK: string[];
 
    @ApiProperty({ description: 'AFGK', example: 'VPHCoreMaster' })
    AFGK: string[];
 
    @ApiProperty({ description: 'AFK', example: 'bankmaster' })
    AFK: string[];
 
    @ApiProperty({ description: 'AFVK', example: 'v1' })
    AFVK: string[]; 
   
    @ApiProperty({ description: 'AFSK', example: 'nodeProperty'})
    AFSK: string;
  }
 
  export class updateAPIDTO {
 
    @ApiProperty({ description: 'Source', example: 'redis' })
    SOURCE: string;
 
    @ApiProperty({ description: 'Target', example: 'mongo' })
    TARGET: string;
 
    @ApiProperty({ description: 'CK', example: 'TCL' })
    CK: string;
 
   
    @ApiProperty({ description: 'FNGK', example: 'AF' })
    FNGK: string;
 
    @ApiProperty({ description: 'FNK', example: 'DF' })
    FNK: string;
 
    @ApiProperty({ description: 'CATK', example: 'FINTECH' })
    CATK: string[];
 
    @ApiProperty({ description: 'AFGK', example: 'VPHCoreMaster' })
    AFGK: string[];
 
    @ApiProperty({ description: 'AFK', example: 'bankmaster' })
    AFK: string;
 
    @ApiProperty({ description: 'AFVK', example: 'v1' })
    AFVK: string[]; 
  
    @ApiProperty({ description: 'AFSK', example: {processFlow:{}} })
    AFSK: object; 
  
  }
 
  export class setAPIDTO {
 
    @ApiProperty({ description: 'Source', example: 'redis' })
    SOURCE: string;
 
    @ApiProperty({ description: 'Target', example: 'mongo' })
    TARGET: string;
 
    @ApiProperty({ description: 'CK', example: 'TCL' })
    CK: string; 
   
    @ApiProperty({ description: 'FNGK', example: 'AF' })
    FNGK: string;
 
    @ApiProperty({ description: 'FNK', example: 'DF' })
    FNK: string;
 
    @ApiProperty({ description: 'CATK', example: 'FINTECH' })
    CATK: string[];
 
    @ApiProperty({ description: 'AFGK', example: 'VPHCoreMaster' })
    AFGK: string[];
 
    @ApiProperty({ description: 'AFK', example: 'bankmaster' })
    AFK: string[];
 
    @ApiProperty({ description: 'AFVK', example: 'v1' })
    AFVK: string[]; 
   
    @ApiProperty({ description: 'AFSK', example: {processFlow:{}} })
    AFSK: object; 
    
  }