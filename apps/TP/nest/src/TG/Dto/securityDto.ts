import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class securityDto {
  @ApiProperty({description: 'Key', example: 'TGA:ABKUF:BUILD:ABC:mvp:bank:v2'})
  @IsNotEmpty()
  key: string;

  @ApiProperty({description: 'nodeName', example: 'row1'})
  nodeName?: string;

  isTable?:boolean
}
