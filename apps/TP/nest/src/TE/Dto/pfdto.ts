import { IsNotEmpty, IsNotEmptyObject, IsSemVer, IsString } from "class-validator"

export class pfDto {
      @IsNotEmpty()
      @IsString()
      key: string      
      upId: string
      @IsNotEmpty()
      @IsString()
      event: string
      @IsNotEmptyObject()
      data: object
      token:string
      @IsNotEmpty()
      nodeId: string
      @IsNotEmpty()
      nodeName:string
      @IsNotEmpty()
      nodeType:string      
  }